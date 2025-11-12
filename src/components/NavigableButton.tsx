import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavigableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  focused?: boolean;
}

const NavigableButton = forwardRef<HTMLButtonElement, NavigableButtonProps>(
  ({ children, focused, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "w-full p-6 text-left text-xl font-medium border-4 border-border rounded transition-all",
          "bg-card text-card-foreground hover:bg-secondary",
          "focus:outline-none focus:ring-4 focus:ring-focus-ring focus:border-focus",
          focused && "ring-4 ring-focus-ring border-focus bg-secondary",
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-3">
          <span className="text-2xl">▸</span>
          <span>{children}</span>
        </span>
      </button>
    );
  }
);

NavigableButton.displayName = "NavigableButton";

export default NavigableButton;
