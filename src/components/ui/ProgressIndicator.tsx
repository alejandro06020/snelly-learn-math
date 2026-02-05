interface ProgressIndicatorProps {
  current: number;
  total: number;
  showLabels?: boolean;
  labels?: string[];
}

/**
 * ProgressIndicator - Visual progress feedback
 * Implements Nielsen's Heuristic #1: Visibility of system status
 */
const ProgressIndicator = ({
  current,
  total,
  showLabels = false,
  labels,
}: ProgressIndicatorProps) => {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="mb-6" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total}>
      {/* Text indicator */}
      <div className="flex items-center justify-between text-sm mb-2">
        <span tabIndex={0} className="text-muted-foreground">
          Paso {current + 1} de {total}
        </span>
        <span tabIndex={0} className="font-medium text-primary">
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Dot indicators */}
      {total <= 10 && (
        <div className="flex justify-center gap-2 mt-4" aria-hidden="true">
          {Array.from({ length: total }).map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${
                current === index
                  ? "active"
                  : current > index
                  ? "completed"
                  : ""
              }`}
            />
          ))}
        </div>
      )}

      {/* Labels */}
      {showLabels && labels && labels.length === total && (
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          {labels.map((label, index) => (
            <span
              key={index}
              className={current === index ? "text-primary font-medium" : ""}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
