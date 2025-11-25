interface SnellyProps {
  isSpeaking?: boolean;
}

const Snelly = ({ isSpeaking = false }: SnellyProps) => {
  return (
    <div className={`fixed bottom-6 left-6 w-32 h-32 border-4 border-primary bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${isSpeaking ? 'animate-bounce scale-110' : 'scale-100'}`}>
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full p-3 text-primary transition-transform duration-300 ${isSpeaking ? 'scale-110' : 'scale-100'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        {/* Shell */}
        <circle cx="60" cy="50" r="25" strokeWidth="3" className="fill-primary/10" />
        <path d="M 60 30 Q 70 40 60 50 Q 50 40 60 30" strokeWidth="2" />
        <path d="M 60 50 Q 70 60 60 70 Q 50 60 60 50" strokeWidth="2" />
        
        {/* Body */}
        <ellipse cx="35" cy="60" rx="18" ry="12" strokeWidth="3" className="fill-primary/5" />
        
        {/* Head */}
        <ellipse cx="25" cy="50" rx="12" ry="10" strokeWidth="3" className="fill-primary/5" />
        
        {/* Eye stalks - animated when speaking */}
        <line 
          x1="22" y1="45" 
          x2="20" y2={isSpeaking ? "36" : "38"} 
          strokeWidth="2" 
          className="transition-all duration-200"
        />
        <line 
          x1="28" y1="45" 
          x2="30" y2={isSpeaking ? "36" : "38"} 
          strokeWidth="2"
          className="transition-all duration-200"
        />
        
        {/* Eyes - blink when speaking */}
        <circle cx="20" cy="36" r={isSpeaking ? "3" : "2"} fill="currentColor" className="transition-all duration-200" />
        <circle cx="30" cy="36" r={isSpeaking ? "3" : "2"} fill="currentColor" className="transition-all duration-200" />
        
        {/* Smile - bigger when speaking */}
        <path 
          d={isSpeaking ? "M 22 52 Q 25 56 28 52" : "M 22 52 Q 25 54 28 52"} 
          strokeWidth="2" 
          fill="none"
          className="transition-all duration-200"
        />
      </svg>
    </div>
  );
};

export default Snelly;
