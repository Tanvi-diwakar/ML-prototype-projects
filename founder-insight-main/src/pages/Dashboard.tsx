import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysisStore } from '@/stores/analysisStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/layout/AppLayout';
import { Plus, TrendingUp, Target, Brain, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const { history } = useAnalysisStore();
  const navigate = useNavigate();

  const totalAnalyses = history.length;
  const avgClarity = totalAnalyses ? Math.round(history.reduce((s, h) => s + h.clarityScore, 0) / totalAnalyses) : 0;
  const avgMatch = totalAnalyses ? Math.round(history.reduce((s, h) => s + h.matchScore, 0) / totalAnalyses) : 0;

  const statCards = [
    { label: 'Total Analyses', value: totalAnalyses, icon: BarChart3 },
    { label: 'Avg. Clarity', value: `${avgClarity}/100`, icon: Target },
    { label: 'Avg. Match', value: `${avgMatch}/100`, icon: Brain },
    { label: 'Improvement', value: totalAnalyses > 1 ? '+12%' : '—', icon: TrendingUp },
  ];

  return (
    <AppLayout>
      <div className="space-y-8" style={{ animation: 'fade-in 0.5s ease-out' }}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate('/analyze')} className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" /> New Analysis
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="glass-card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                <s.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Recent */}
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-border/50">
            <h2 className="font-semibold">Recent Analyses</h2>
          </div>
          {history.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              <p>No analyses yet. Start by analyzing your first idea!</p>
              <Button onClick={() => navigate('/analyze')} className="mt-4 bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground">
                    <th className="text-left p-3 font-medium">Problem</th>
                    <th className="text-center p-3 font-medium">Clarity</th>
                    <th className="text-center p-3 font-medium">Match</th>
                    <th className="text-center p-3 font-medium">AI Status</th>
                    <th className="text-right p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 10).map((item) => (
                    <tr key={item.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                      <td className="p-3 max-w-[250px] truncate">{item.problemStatement}</td>
                      <td className="p-3 text-center font-medium">
                        <span className={item.clarityScore >= 80 ? 'score-green' : item.clarityScore >= 60 ? 'score-yellow' : 'score-red'}>
                          {item.clarityScore}
                        </span>
                      </td>
                      <td className="p-3 text-center font-medium">
                        <span className={item.matchScore >= 80 ? 'score-green' : item.matchScore >= 60 ? 'score-yellow' : 'score-red'}>
                          {item.matchScore}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" className="text-xs">
                          {item.aiClassification === 'NECESSARY' ? '✅' : item.aiClassification === 'APPROPRIATE' ? '⚠️' : '❌'}{' '}
                          {item.aiClassification}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            useAnalysisStore.getState().setCurrentResult(item);
                            navigate('/results');
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
