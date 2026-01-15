import snellyImage from "@/assets/snelly-character.png";

interface SnellyProps {
  isSpeaking?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
}

/**
 * Snelly - The friendly snail mascot
 * Provides visual feedback for narration state
 */
const Snelly = ({ isSpeaking = false, size = "medium", className = "" }: SnellyProps) => {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-20 h-20",
    large: "w-28 h-28"
  };

  return (
    <div 
      className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 ${sizeClasses[size]} transition-all duration-300 ease-out z-40 ${className}`}
      role="img"
      aria-label={isSpeaking ? "Snelly está hablando" : "Snelly el caracol guía"}
    >
      {/* Glow effect when speaking */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-300 ${
          isSpeaking 
            ? 'bg-primary/20 scale-125 blur-xl' 
            : 'bg-transparent scale-100'
        }`}
        aria-hidden="true"
      />
      
      {/* Main container */}
      <div 
        className={`relative w-full h-full bg-gradient-to-br from-card to-muted rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-300 ${
          isSpeaking 
            ? 'border-primary scale-110 shadow-xl shadow-primary/20' 
            : 'border-border scale-100 hover:scale-105'
        }`}
      >
        <img 
          src={snellyImage}
          alt=""
          aria-hidden="true"
          className={`w-[85%] h-[85%] object-contain transition-transform duration-300 ${
            isSpeaking ? 'scale-105' : 'scale-100'
          }`}
        />
        
        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="absolute -top-1 -right-1 flex items-center justify-center">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-primary" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Snelly;
