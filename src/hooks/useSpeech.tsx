import { useState, useCallback, useRef, useEffect } from 'react';

interface SpeechOptions {
  voice?: string;
  speed?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    // ALWAYS cancel any ongoing speech immediately
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
    setIsLoading(false);

    if (!text.trim()) return;

    setIsLoading(true);

    // Small delay to ensure cancellation is processed
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        // Find Spanish voice
        const spanishVoice = voices.find(voice => 
          voice.lang.startsWith('es') || voice.lang.includes('ES')
        );
        
        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }

        utterance.lang = 'es-ES';
        utterance.rate = options.speed || 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
          setIsLoading(false);
          setIsSpeaking(true);
          options.onStart?.();
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          utteranceRef.current = null;
          options.onEnd?.();
        };

        utterance.onerror = (event) => {
          // Ignore 'interrupted' errors as they're expected when cancelling
          if (event.error !== 'interrupted') {
            console.error('Speech error:', event);
          }
          setIsSpeaking(false);
          setIsLoading(false);
          utteranceRef.current = null;
        };

        window.speechSynthesis.speak(utterance);
      } catch (error: any) {
        console.error('Speech error:', error);
        setIsSpeaking(false);
        setIsLoading(false);
      }
    }, 50);
  }, [voices]);

  const stop = useCallback(() => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  return { speak, stop, isSpeaking, isLoading };
};
