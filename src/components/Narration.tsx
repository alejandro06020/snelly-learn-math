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
  const { speak, isSpeaking, isLoading } = useSpeech();
  const [isNarratorEnabled, setIsNarratorEnabled] = useState(true);
  
  useEffect(() => {
    const savedEnabled = localStorage.getItem('narratorEnabled');
    setIsNarratorEnabled(savedEnabled !== 'false');
  }, []);

  useEffect(() => {
    if (!isNarratorEnabled) return;
    
    if (text.trim()) {
      speak(text, {
        speed,
        onStart: () => onSpeakingChange?.(true),
        onEnd: () => onSpeakingChange?.(false)
      });
    }
  }, [text, speed, isNarratorEnabled]);

  useEffect(() => {
    onSpeakingChange?.(isSpeaking);
  }, [isSpeaking, onSpeakingChange]);

  // Solo renderiza un elemento oculto para accesibilidad (screen readers)
  return (
    <NarrationContext.Provider value={{ isSpeaking }}>
      <div 
        className="sr-only"
        role="status"
        aria-live="assertive"
        aria-atomic="true"
      >
        {text}
      </div>
    </NarrationContext.Provider>
  );
};

export default Narration;
