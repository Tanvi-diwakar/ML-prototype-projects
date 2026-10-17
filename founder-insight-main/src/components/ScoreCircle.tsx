interface ScoreCircleProps {
  score: number;
  label: string;
  size?: number;
}

export default function ScoreCircle({ score, label, size = 120 }: ScoreCircleProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colorClass = score >= 80 ? 'score-green' : score >= 60 ? 'score-yellow' : 'score-red';
  const strokeColor = score >= 80 ? 'hsl(145, 65%, 45%)' : score >= 60 ? 'hsl(38, 92%, 55%)' : 'hsl(0, 72%, 55%)';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(222, 30%, 18%)"
            strokeWidth="6"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="animate-score-fill"
            style={{ animationDelay: '0.3s' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${colorClass}`}>{score}</span>
        </div>
      </div>
      <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{label}</span>
    </div>
  );
}
