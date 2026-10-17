import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysisStore } from '@/stores/analysisStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/layout/AppLayout';
import { Search } from 'lucide-react';
import { format } from 'date-fns';

export default function HistoryPage() {
  const { history } = useAnalysisStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const perPage = 10;

  const filtered = history.filter(
    (h) =>
      h.problemStatement.toLowerCase().includes(search.toLowerCase()) ||
      h.proposedSolution.toLowerCase().includes(search.toLowerCase())
  );

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <AppLayout>
      <div className="space-y-6" style={{ animation: 'fade-in 0.5s ease-out' }}>
        <h1 className="text-2xl font-bold">Analysis History</h1>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search analyses..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">No analyses found.</p>
        ) : (
          <>
            <div className="glass-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground">
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-left p-3 font-medium">Problem</th>
                    <th className="text-center p-3 font-medium">Clarity</th>
                    <th className="text-center p-3 font-medium">Match</th>
                    <th className="text-center p-3 font-medium">AI</th>
                    <th className="text-right p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((item) => (
                    <tr key={item.id} className="border-b border-border/30 hover:bg-secondary/30">
                      <td className="p-3 text-muted-foreground whitespace-nowrap">{format(new Date(item.timestamp), 'MMM d')}</td>
                      <td className="p-3 max-w-[200px] truncate">{item.problemStatement}</td>
                      <td className="p-3 text-center font-medium">{item.clarityScore}</td>
                      <td className="p-3 text-center font-medium">{item.matchScore}</td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" className="text-xs">{item.aiClassification}</Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => {
                          useAnalysisStore.getState().setCurrentResult(item);
                          navigate('/results');
                        }}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</Button>
                <span className="text-sm text-muted-foreground">{page + 1} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
