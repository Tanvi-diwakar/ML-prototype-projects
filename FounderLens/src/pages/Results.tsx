import { useNavigate } from 'react-router-dom';
import { useAnalysisStore } from '@/stores/analysisStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import ScoreCircle from '@/components/ScoreCircle';
import AppLayout from '@/components/layout/AppLayout';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';

const priorityConfig = {
  CRITICAL: { emoji: '🔴', className: 'bg-destructive/15 text-destructive border-destructive/30' },
  HIGH: { emoji: '🟡', className: 'bg-warning/15 text-warning border-warning/30' },
  MEDIUM: { emoji: '🟢', className: 'bg-success/15 text-success border-success/30' },
  LOW: { emoji: '⚪', className: 'bg-muted text-muted-foreground border-border' },
};

const aiClassConfig = {
  NECESSARY: { className: 'bg-success/15 text-success border-success/30' },
  APPROPRIATE: { className: 'bg-warning/15 text-warning border-warning/30' },
  'OVER-ENGINEERED': { className: 'bg-destructive/15 text-destructive border-destructive/30' },
};

export default function Results() {
  const { currentResult, toggleRecommendation } = useAnalysisStore();
  const navigate = useNavigate();

  if (!currentResult) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-muted-foreground">No analysis results found.</p>
          <Button onClick={() => navigate('/analyze')}>Start an Analysis</Button>
        </div>
      </AppLayout>
    );
  }

  const r = currentResult;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8" style={{ animation: 'fade-in 0.5s ease-out' }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/analyze')} className="text-muted-foreground mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <h1 className="text-2xl font-bold">Analysis Results</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="font-mono">{r.analysisId}</span>
              <span>•</span>
              <span>{format(new Date(r.timestamp), 'PPpp')}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1"><Download className="w-3.5 h-3.5" /> PDF</Button>
            <Button variant="outline" size="sm" className="gap-1"><FileText className="w-3.5 h-3.5" /> CSV</Button>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Clarity */}
          <div className="glass-card p-6 flex flex-col items-center gap-4">
            <ScoreCircle score={r.clarityScore} label="Problem Clarity" />
            <div className="w-full space-y-2 text-xs">
              {Object.entries(r.clarityBreakdown).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">{key}</span>
                  <span className="font-medium">{val}/100</span>
                </div>
              ))}
            </div>
          </div>

          {/* Match */}
          <div className="glass-card p-6 flex flex-col items-center gap-4">
            <ScoreCircle score={r.matchScore} label="Solution Match" />
            <Badge variant="outline" className="text-xs">±{r.matchConfidence}% confidence</Badge>
          </div>

          {/* AI Necessity */}
          <div className="glass-card p-6 flex flex-col items-center gap-4">
            <ScoreCircle score={r.aiNecessityScore} label="AI Necessity" />
            <Badge className={aiClassConfig[r.aiClassification].className}>
              {r.aiClassification}
            </Badge>
            <p className="text-xs text-muted-foreground text-center">{r.aiJustification}</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Top 5 Recommendations</h2>
          <div className="space-y-3">
            {r.recommendations.map((rec) => {
              const prio = priorityConfig[rec.priority];
              return (
                <div key={rec.id} className="glass-card p-5 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={rec.addressed}
                        onCheckedChange={() => toggleRecommendation(rec.id)}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{prio.emoji}</span>
                          <Badge variant="outline" className={`text-[10px] ${prio.className}`}>{rec.priority}</Badge>
                          <span className={`font-semibold text-sm ${rec.addressed ? 'line-through text-muted-foreground' : ''}`}>
                            {rec.title}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                        {rec.example && (
                          <p className="text-xs text-accent mt-1 italic">💡 {rec.example}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Button onClick={() => navigate('/analyze')} className="bg-primary hover:bg-primary/90">Analyze Another Idea</Button>
          <Button variant="outline" onClick={() => navigate('/history')}>View History</Button>
        </div>
      </div>
    </AppLayout>
  );
}
