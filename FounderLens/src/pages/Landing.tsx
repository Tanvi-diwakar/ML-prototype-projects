import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Target, Brain, Lightbulb, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold gradient-text">FounderLens AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="sm" className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-3xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Startup Analysis
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Validate your startup's{' '}
            <span className="gradient-text">problem-solution fit</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Get instant AI-powered scoring on problem clarity, solution match, and AI necessity. 
            Actionable recommendations to strengthen your pitch.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                Start Analyzing <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-border/30">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 max-w-4xl">
          {[
            { icon: Target, title: 'Problem Clarity', desc: 'Evaluate how well-defined your problem statement is with detailed breakdowns.' },
            { icon: Brain, title: 'Solution Match', desc: 'Measure semantic alignment between your problem and proposed solution.' },
            { icon: Lightbulb, title: 'AI Necessity', desc: 'Determine if AI/ML is truly needed or if simpler solutions exist.' },
          ].map((f) => (
            <div key={f.title} className="glass-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
