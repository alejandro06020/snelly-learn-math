import { ReactNode } from "react";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  size?: "small" | "medium" | "large";
  badge?: string;
}

/**
 * HeroSection - Prominent header component
 * Implements Nielsen's Heuristic #8: Aesthetic and minimalist design
 */
const HeroSection = ({
  title,
  subtitle,
  children,
  size = "medium",
  badge,
}: HeroSectionProps) => {
  const sizeClasses = {
    small: "p-6 sm:p-8",
    medium: "p-8 sm:p-10",
    large: "p-10 sm:p-14",
  };

  const titleSizes = {
    small: "text-3xl sm:text-4xl",
    medium: "text-4xl sm:text-5xl",
    large: "text-5xl sm:text-6xl lg:text-7xl",
  };

  return (
    <header className={`hero-card text-center mb-8 ${sizeClasses[size]}`}>
      {badge && (
        <span 
          tabIndex={0}
          className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-primary bg-primary/10 rounded-full"
        >
          {badge}
        </span>
      )}
      
      <h1 
        tabIndex={0}
        className={`${titleSizes[size]} text-gradient mb-4`}
      >
        {title}
      </h1>
      
      {subtitle && (
        <p 
          tabIndex={0}
          className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto"
        >
          {subtitle}
        </p>
      )}
      
      {children}
    </header>
  );
};

export default HeroSection;
