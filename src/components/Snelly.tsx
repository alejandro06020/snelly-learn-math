import snellyImage from "@/assets/snelly-character.png";

interface SnellyProps {
  isSpeaking?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
}

const Snelly = ({ isSpeaking = false, size = "medium", className = "" }: SnellyProps) => {
  const sizeClasses = {
    small: "w-20 h-20",
    medium: "w-28 h-28",
    large: "w-40 h-40"
  };

  return (
    <div 
      className={`fixed bottom-6 left-6 ${sizeClasses[size]} bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 ease-in-out border-3 border-primary/30 ${className} ${
        isSpeaking 
          ? 'scale-105 border-primary shadow-2xl shadow-primary/20' 
          : 'scale-100 hover:scale-102'
      }`}
      role="img"
      aria-label={isSpeaking ? "Snelly está hablando" : "Snelly el caracol narrador"}
    >
      <img 
        src={snellyImage}
        alt=""
        aria-hidden="true"
        className={`w-full h-full object-contain transition-transform duration-500 ease-in-out ${
          isSpeaking ? 'scale-105' : 'scale-100'
        }`}
      />
      {isSpeaking && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default Snelly;
