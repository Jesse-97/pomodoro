function ProgressRing({ time, total, color }) {
  const radius = 100;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = time / total;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <svg
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      <circle
        stroke="var(--ring-bg)"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />

      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ filter: `drop-shadow(0px 0px 6px ${color})` }}
      />
    </svg>
  );
}

export default ProgressRing;