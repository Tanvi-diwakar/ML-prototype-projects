import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysisStore } from '@/stores/analysisStore';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Sparkles, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/components/layout/AppLayout';

export default function Analyze() {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [aiIdea, setAiIdea] = useState('');
  const [noAi, setNoAi] = useState(false);
  const { isAnalyzing, setIsAnalyzing, setCurrentResult, addToHistory } = useAnalysisStore();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!problem.trim() || !solution.trim()) {
      toast.error('Problem and solution are required');
      return;
    }
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze', {
        body: {
          problemStatement: problem.trim(),
          proposedSolution: solution.trim(),
          aiImplementation: noAi ? null : aiIdea.trim() || null,
        },
      });
      if (error) throw error;
      setCurrentResult(data);
      addToHistory(data);
      navigate('/results');
    } catch (err: any) {
      toast.error(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8" style={{ animation: 'fade-in 0.5s ease-out' }}>
        <div>
          <h1 className="text-2xl font-bold">Analyze Your Idea</h1>
          <p className="text-muted-foreground mt-1">Describe your startup problem and solution to get AI-powered insights.</p>
        </div>

        <div className="space-y-6">
          {/* Problem */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Problem Statement *</Label>
              <Tooltip>
                <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  <p className="font-semibold mb-1">Good:</p>
                  <p>"Small clinics lose 30% of patients due to 48-hour appointment scheduling delays, costing $2,400/month per clinic."</p>
                  <p className="font-semibold mt-2 mb-1">Bad:</p>
                  <p>"Healthcare needs improvement."</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <textarea
              className="w-full min-h-[140px] rounded-lg bg-secondary border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Describe the problem you're solving. Be specific about who experiences it, how often, and how much it costs them (time/money)."
              maxLength={2000}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />
            <p className="text-xs text-muted-foreground text-right">{problem.length}/2000 characters</p>
          </div>

          {/* Solution */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Proposed Solution *</Label>
              <Tooltip>
                <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  <p className="font-semibold mb-1">Aligned:</p>
                  <p>"An AI chatbot that automates appointment scheduling via SMS, reducing wait times from 48 hours to 5 minutes."</p>
                  <p className="font-semibold mt-2 mb-1">Misaligned:</p>
                  <p>"A blockchain platform for healthcare."</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <textarea
              className="w-full min-h-[140px] rounded-lg bg-secondary border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Describe your solution. Explain how it addresses the problem, who it's for, and what makes it different."
              maxLength={3000}
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
            />
            <p className="text-xs text-muted-foreground text-right">{solution.length}/3000 characters</p>
          </div>

          {/* AI Idea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">AI Implementation Idea</Label>
                <span className="text-xs text-muted-foreground">(optional)</span>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="no-ai" className="text-xs text-muted-foreground">Not using AI</Label>
                <Switch id="no-ai" checked={noAi} onCheckedChange={setNoAi} />
              </div>
            </div>
            {!noAi && (
              <>
                <textarea
                  className="w-full min-h-[100px] rounded-lg bg-secondary border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Describe how you plan to use AI/ML in your solution. Be specific about the use case, model type, and data requirements."
                  maxLength={1500}
                  value={aiIdea}
                  onChange={(e) => setAiIdea(e.target.value)}
                />
                <p className="text-xs text-muted-foreground text-right">{aiIdea.length}/1500 characters</p>
              </>
            )}
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !problem.trim() || !solution.trim()}
            className="w-full bg-primary hover:bg-primary/90 h-12 text-base gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing... (up to 30s)
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Idea
              </>
            )}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
