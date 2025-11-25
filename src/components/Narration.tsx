import { useEffect, useState, createContext, useContext } from "react";
import { useSpeech } from "@/hooks/useSpeech";

interface NarrationProps {
  text: string;
  speed?: number;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

interface NarrationContextType {
  isSpeaking: boolean;
}

const NarrationContext = createContext<NarrationContextType>({ isSpeaking: false });

export const useNarration = () => useContext(NarrationContext);

const Narration = ({ text, speed = 1.0, onSpeakingChange }: NarrationProps) => {
  const [displayText, setDisplayText] = useState("");
  const { speak, isSpeaking, isLoading } = useSpeech();
  
  useEffect(() => {
    setDisplayText(text);
    if (text.trim()) {
      speak(text, {
        speed,
        onStart: () => onSpeakingChange?.(true),
        onEnd: () => onSpeakingChange?.(false)
      });
    }
  }, [text, speed]);

  useEffect(() => {
    onSpeakingChange?.(isSpeaking);
  }, [isSpeaking, onSpeakingChange]);

  return (
    <NarrationContext.Provider value={{ isSpeaking }}>
      <div 
        className="fixed top-4 left-1/2 -translate-x-1/2 max-w-3xl w-full px-4 z-50"
        role="status"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground p-6 rounded-xl border-2 border-primary-foreground/20 shadow-2xl backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-2xl animate-pulse">
              {isLoading ? "⏳" : isSpeaking ? "🔊" : "💬"}
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider mb-2 opacity-90 font-semibold">
                Snelly Narra:
              </div>
              <div className="text-lg font-medium leading-relaxed">
                {displayText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </NarrationContext.Provider>
  );
};

export default Narration;
