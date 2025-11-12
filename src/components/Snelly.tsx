const Snelly = () => {
  return (
    <div className="fixed bottom-4 left-4 w-24 h-24 border-4 border-foreground bg-muted rounded-lg flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full p-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        {/* Shell */}
        <circle cx="60" cy="50" r="25" strokeWidth="3" />
        <path d="M 60 30 Q 70 40 60 50 Q 50 40 60 30" strokeWidth="2" />
        <path d="M 60 50 Q 70 60 60 70 Q 50 60 60 50" strokeWidth="2" />
        
        {/* Body */}
        <ellipse cx="35" cy="60" rx="18" ry="12" strokeWidth="3" />
        
        {/* Head */}
        <ellipse cx="25" cy="50" rx="12" ry="10" strokeWidth="3" />
        
        {/* Eye stalks */}
        <line x1="22" y1="45" x2="20" y2="38" strokeWidth="2" />
        <line x1="28" y1="45" x2="30" y2="38" strokeWidth="2" />
        
        {/* Eyes */}
        <circle cx="20" cy="36" r="2" fill="currentColor" />
        <circle cx="30" cy="36" r="2" fill="currentColor" />
        
        {/* Smile */}
        <path d="M 22 52 Q 25 54 28 52" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
};

export default Snelly;
