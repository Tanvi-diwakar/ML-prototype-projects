import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { problemStatement, proposedSolution, aiImplementation } = await req.json();

    if (!problemStatement || !proposedSolution) {
      return new Response(JSON.stringify({ error: "Problem and solution are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an expert startup advisor and analyst. Analyze the following startup idea and return a JSON object with this exact structure. Be rigorous, specific, and actionable.

Return ONLY valid JSON with this structure:
{
  "clarityScore": <number 0-100>,
  "clarityBreakdown": {
    "completeness": <number 0-100>,
    "specificity": <number 0-100>,
    "userFocus": <number 0-100>,
    "urgency": <number 0-100>
  },
  "matchScore": <number 0-100>,
  "matchConfidence": <number 1-10>,
  "aiNecessityScore": <number 0-100>,
  "aiClassification": "<NECESSARY|APPROPRIATE|OVER-ENGINEERED>",
  "aiJustification": "<1-2 sentence explanation>",
  "recommendations": [
    {
      "title": "<short title>",
      "description": "<2-3 sentence explanation>",
      "example": "<actionable example>",
      "priority": "<CRITICAL|HIGH|MEDIUM|LOW>"
    }
  ]
}

Scoring criteria:
- clarityScore: weighted = 0.4*completeness + 0.3*specificity + 0.2*userFocus + 0.1*urgency
- completeness: Does the problem identify target users, pain points, context, and have >100 chars?
- specificity: Are there quantifiable metrics, numbers, frequencies?
- userFocus: Is there a clear target segment with demographics?
- urgency: Are there urgency markers or financial impact mentioned?
- matchScore: How semantically aligned is the solution to the problem? Does the solution directly address each pain point?
- aiNecessityScore: Is AI truly needed? +points for computer vision, NLP, prediction, pattern recognition. -points for simple CRUD, regex, basic stats, email/notifications.
- aiClassification: >=80 NECESSARY, 50-79 APPROPRIATE, <50 OVER-ENGINEERED
- Provide exactly 5 recommendations sorted by priority.

${aiImplementation === null ? "The founder indicated they are NOT using AI, so skip AI necessity evaluation and set aiNecessityScore to 50, aiClassification to 'APPROPRIATE', and aiJustification to 'AI evaluation skipped - not applicable'." : ""}`;

    const userPrompt = `Problem Statement:
${problemStatement}

Proposed Solution:
${proposedSolution}

${aiImplementation ? `AI Implementation Idea:\n${aiImplementation}` : "AI Implementation: Not specified"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_analysis",
              description: "Return the startup analysis results",
              parameters: {
                type: "object",
                properties: {
                  clarityScore: { type: "number" },
                  clarityBreakdown: {
                    type: "object",
                    properties: {
                      completeness: { type: "number" },
                      specificity: { type: "number" },
                      userFocus: { type: "number" },
                      urgency: { type: "number" },
                    },
                    required: ["completeness", "specificity", "userFocus", "urgency"],
                  },
                  matchScore: { type: "number" },
                  matchConfidence: { type: "number" },
                  aiNecessityScore: { type: "number" },
                  aiClassification: { type: "string", enum: ["NECESSARY", "APPROPRIATE", "OVER-ENGINEERED"] },
                  aiJustification: { type: "string" },
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        example: { type: "string" },
                        priority: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
                      },
                      required: ["title", "description", "example", "priority"],
                    },
                  },
                },
                required: ["clarityScore", "clarityBreakdown", "matchScore", "matchConfidence", "aiNecessityScore", "aiClassification", "aiJustification", "recommendations"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI analysis failed");
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    
    let analysis;
    if (toolCall?.function?.arguments) {
      analysis = typeof toolCall.function.arguments === 'string' 
        ? JSON.parse(toolCall.function.arguments) 
        : toolCall.function.arguments;
    } else {
      // Fallback: try parsing from content
      const content = aiResult.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not parse AI response");
      analysis = JSON.parse(jsonMatch[0]);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const seqNum = Math.floor(Math.random() * 99999).toString().padStart(5, '0');

    const result = {
      id,
      analysisId: `ANL-${new Date().getFullYear()}-${seqNum}`,
      timestamp: now,
      problemStatement,
      proposedSolution,
      aiImplementation,
      clarityScore: Math.round(analysis.clarityScore),
      clarityBreakdown: {
        completeness: Math.round(analysis.clarityBreakdown.completeness),
        specificity: Math.round(analysis.clarityBreakdown.specificity),
        userFocus: Math.round(analysis.clarityBreakdown.userFocus),
        urgency: Math.round(analysis.clarityBreakdown.urgency),
      },
      matchScore: Math.round(analysis.matchScore),
      matchConfidence: analysis.matchConfidence,
      aiNecessityScore: Math.round(analysis.aiNecessityScore),
      aiClassification: analysis.aiClassification,
      aiJustification: analysis.aiJustification,
      recommendations: (analysis.recommendations || []).slice(0, 5).map((r: any, i: number) => ({
        id: `rec-${id}-${i}`,
        title: r.title,
        description: r.description,
        example: r.example,
        priority: r.priority,
        addressed: false,
      })),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
