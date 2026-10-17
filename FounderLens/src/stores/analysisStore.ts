import { create } from 'zustand';

export interface AnalysisResult {
  id: string;
  analysisId: string;
  timestamp: string;
  problemStatement: string;
  proposedSolution: string;
  aiImplementation: string | null;
  clarityScore: number;
  clarityBreakdown: {
    completeness: number;
    specificity: number;
    userFocus: number;
    urgency: number;
  };
  matchScore: number;
  matchConfidence: number;
  aiNecessityScore: number;
  aiClassification: 'NECESSARY' | 'APPROPRIATE' | 'OVER-ENGINEERED';
  aiJustification: string;
  recommendations: Recommendation[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  example: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  addressed: boolean;
}

interface AnalysisState {
  currentResult: AnalysisResult | null;
  history: AnalysisResult[];
  isAnalyzing: boolean;
  setCurrentResult: (result: AnalysisResult) => void;
  setIsAnalyzing: (v: boolean) => void;
  addToHistory: (result: AnalysisResult) => void;
  setHistory: (results: AnalysisResult[]) => void;
  toggleRecommendation: (recId: string) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentResult: null,
  history: [],
  isAnalyzing: false,
  setCurrentResult: (result) => set({ currentResult: result }),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
  addToHistory: (result) => set((s) => ({ history: [result, ...s.history] })),
  setHistory: (results) => set({ history: results }),
  toggleRecommendation: (recId) =>
    set((s) => ({
      currentResult: s.currentResult
        ? {
            ...s.currentResult,
            recommendations: s.currentResult.recommendations.map((r) =>
              r.id === recId ? { ...r, addressed: !r.addressed } : r
            ),
          }
        : null,
    })),
}));
