import snellyImage from "@/assets/snelly-character.png";

interface SnellyProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

/**
 * Snelly - The friendly snail mascot
 * Visual mascot for the application
 */
const Snelly = ({ size = "medium", className = "" }: SnellyProps) => {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-20 h-20",
    large: "w-28 h-28"
  };

  return (
    <div 
      className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 ${sizeClasses[size]} transition-all duration-300 ease-out z-40 ${className}`}
      role="img"
      aria-label="Snelly el caracol guía"
    >
      {/* Main container */}
      <div 
        className="relative w-full h-full bg-gradient-to-br from-card to-muted rounded-full flex items-center justify-center shadow-lg border-2 border-border scale-100 hover:scale-105 transition-all duration-300"
      >
        <img 
          src={snellyImage}
          alt="Snelly, el caracol guía de SnailMath"
          className="w-[85%] h-[85%] object-contain"
        />
      </div>
    </div>
  );
};

export default Snelly;
