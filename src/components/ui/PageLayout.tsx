import { ReactNode } from "react";
import Narration from "@/components/Narration";
import Snelly from "@/components/Snelly";

interface PageLayoutProps {
  children: ReactNode;
  narration?: string;
  speed?: number;
  onSpeakingChange?: (speaking: boolean) => void;
  isSpeaking?: boolean;
  showSnelly?: boolean;
  snellySize?: "small" | "medium" | "large";
}

/**
 * PageLayout - Consistent layout wrapper for all pages
 * Implements Nielsen's Heuristic #4: Consistency and standards
 */
const PageLayout = ({
  children,
  narration = "",
  speed = 1.0,
  onSpeakingChange,
  isSpeaking = false,
  showSnelly = true,
  snellySize = "medium",
}: PageLayoutProps) => {
  return (
    <div className="page-container bg-gradient-to-b from-background to-muted/30">
      {/* Skip link for keyboard users - Heuristic #7: Flexibility */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      {/* Narrator - invisible but functional for accessibility */}
      <Narration text={narration} speed={speed} onSpeakingChange={onSpeakingChange} />

      {/* Snelly character - visual feedback */}
      {showSnelly && <Snelly isSpeaking={isSpeaking} size={snellySize} />}

      {/* Main content area */}
      <main id="main-content" className="content-wrapper animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
