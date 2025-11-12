import { useEffect, useState } from "react";

interface NarrationProps {
  text: string;
}

const Narration = ({ text }: NarrationProps) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  return (
    <div 
      className="fixed top-4 left-1/2 -translate-x-1/2 max-w-3xl w-full px-4 z-50"
      role="status"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="bg-narration-bg text-narration-text p-6 rounded border-2 border-foreground shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-lg font-bold">🔊</div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider mb-1 opacity-75">
              Snelly Narra:
            </div>
            <div className="text-lg font-medium leading-relaxed">
              {displayText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Narration;
