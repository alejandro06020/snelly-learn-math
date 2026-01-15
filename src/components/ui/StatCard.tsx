import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  variant?: "default" | "success" | "warning" | "error";
}

/**
 * StatCard - Display key metrics with visual emphasis
 * Implements Nielsen's Heuristic #1: Visibility of system status
 */
const StatCard = ({
  label,
  value,
  icon,
  variant = "default",
}: StatCardProps) => {
  const variantStyles = {
    default: "bg-card border-border",
    success: "bg-success/10 border-success/30",
    warning: "bg-warning/10 border-warning/30",
    error: "bg-error/10 border-error/30",
  };

  const valueStyles = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  };

  return (
    <div
      className={`p-4 rounded-xl border-2 ${variantStyles[variant]} flex items-center gap-4`}
      aria-label={`${label}: ${value}`}
    >
      {icon && (
        <div className={`flex-shrink-0 ${valueStyles[variant]}`}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <span className="block text-sm text-muted-foreground">{label}</span>
        <span className={`block text-2xl font-bold ${valueStyles[variant]}`} aria-live="polite">
          {value}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
