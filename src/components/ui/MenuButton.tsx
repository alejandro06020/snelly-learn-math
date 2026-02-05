import { forwardRef, ReactNode } from "react";
import { ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  focused?: boolean;
  icon?: ReactNode;
  description?: string;
  status?: "default" | "completed" | "current" | "locked";
  variant?: "default" | "primary" | "secondary" | "danger";
  onItemFocus?: () => void;
}

/**
 * MenuButton - Interactive menu item with clear affordances
 * Implements:
 * - Heuristic #1: Visibility of system status (focused state)
 * - Heuristic #5: Error prevention (clear affordances)
 * - Heuristic #6: Recognition rather than recall (icons, descriptions)
 */
const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  (
    {
      children,
      focused,
      icon,
      description,
      status = "default",
      variant = "default",
      className,
      disabled,
      onItemFocus,
      onFocus,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: "",
      primary: "border-primary/30 bg-primary/5 hover:bg-primary/10",
      secondary: "border-accent/30 bg-accent/5 hover:bg-accent/10",
      danger: "border-destructive/30 bg-destructive/5 hover:bg-destructive/10 text-destructive",
    };

    const statusIcon = {
      default: <ChevronRight className="w-5 h-5 text-muted-foreground" />,
      completed: <Check className="w-5 h-5 text-success" />,
      current: <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />,
      locked: <div className="w-5 h-5 text-muted-foreground">🔒</div>,
    };

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      onItemFocus?.();
      onFocus?.(e);
    };

    return (
      <button
        ref={ref}
        disabled={disabled || status === "locked"}
        className={cn(
          "btn-interactive group",
          focused && "focused",
          variantStyles[variant],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        aria-current={status === "current" ? "step" : undefined}
        onFocus={handleFocus}
        {...props}
      >
        <div className="flex items-center gap-4">
          {/* Icon area */}
          {icon && (
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {icon}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <span className="block text-lg font-semibold text-foreground truncate">
              {children}
            </span>
            {description && (
              <span className="block text-sm text-muted-foreground mt-0.5 truncate">
                {description}
              </span>
            )}
          </div>

          {/* Status indicator */}
          <div className="flex-shrink-0">
            {statusIcon[status]}
          </div>
        </div>

        {/* Focus indicator bar */}
        <div
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-primary transition-all duration-200",
            focused ? "opacity-100" : "opacity-0"
          )}
        />
      </button>
    );
  }
);

MenuButton.displayName = "MenuButton";

export default MenuButton;
