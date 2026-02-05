import { ReactNode } from "react";
import Snelly from "@/components/Snelly";

interface PageLayoutProps {
  children: ReactNode;
  showSnelly?: boolean;
  snellySize?: "small" | "medium" | "large";
}

/**
 * PageLayout - Consistent layout wrapper for all pages
 * Implements Nielsen's Heuristic #4: Consistency and standards
 * Screen reader friendly - relies on native HTML semantics
 */
const PageLayout = ({
  children,
  showSnelly = true,
  snellySize = "medium",
}: PageLayoutProps) => {
  return (
    <div className="page-container bg-gradient-to-b from-background to-muted/30">
      {/* Skip link for keyboard users - Heuristic #7: Flexibility */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      {/* Snelly character - visual mascot */}
      {showSnelly && <Snelly size={snellySize} />}

      {/* Main content area */}
      <main id="main-content" className="content-wrapper animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
