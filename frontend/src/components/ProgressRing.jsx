export default function ProgressRing({ value, max = 100, size = 80, stroke = 6, color = 'var(--green)' }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference * (1 - pct);

  return (
    <div className="progress-ring-wrap">
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--gray-100)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
          fill="var(--navy)" fontSize={size * 0.2} fontWeight="700">
          {Math.round(pct * 100)}%
        </text>
      </svg>
    </div>
  );
}
