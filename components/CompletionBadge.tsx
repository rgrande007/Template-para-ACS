interface CompletionBadgeProps {
  percentage: number;
}

export default function CompletionBadge({ percentage }: CompletionBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-stone-200 sm:w-28">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium text-muted">{percentage}% preenchido</span>
    </div>
  );
}
