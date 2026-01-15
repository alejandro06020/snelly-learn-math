import { useEffect } from "react";
import { useSpeech } from "../../hooks/useSpeech";
import { Button } from "./button";
import { Volume2, Square, Keyboard } from "lucide-react";

export interface KeyControl {
  keys: string[];
  action: string;
}

interface KeyboardHelperProps {
  controls: KeyControl[];
  compact?: boolean;
}

// Mapa de traducción de teclas y símbolos a lenguaje natural
const KEY_MAP: Record<string, string> = {
  // Teclas técnicas
  'ArrowRight': 'Flecha derecha',
  'ArrowLeft': 'Flecha izquierda',
  'ArrowUp': 'Flecha arriba',
  'ArrowDown': 'Flecha abajo',
  'Enter': 'Enter',
  'Escape': 'Escape',
  'Esc': 'Escape',
  'Space': 'Espacio',
  'Tab': 'Tabulador',
  'Backspace': 'Borrar',
  'Shift': 'Shift',
  'Control': 'Control',
  'Alt': 'Alt',
  'h': 'H',
  
  // Símbolos visuales usados en la UI
  '↑': 'Flecha arriba',
  '↓': 'Flecha abajo',
  '←': 'Flecha izquierda',
  '→': 'Flecha derecha',
  'Espacio': 'Espacio'
};

const getReadableKey = (key: string) => KEY_MAP[key] || key;

// Función auxiliar exportada para generar el texto de instrucciones
export const getKeyboardInstructions = (controls: KeyControl[]) => {
  const instructions = controls.map(control => {
    const keysText = control.keys.map(getReadableKey).join(" o ");
    return `Para ${control.action}, presiona ${keysText}`;
  }).join(". ");
  
  return `Guía de navegación: ${instructions}`;
};

const KeyboardHelper = ({ controls, compact = false }: KeyboardHelperProps) => {
  const { speak, stop, isSpeaking } = useSpeech();

  const handleSpeakInstructions = () => {
    if (isSpeaking) {
      stop();
      return;
    }
    
    const fullText = `${getKeyboardInstructions(controls)}. Puedes presionar la tecla H para detener o repetir esto.`;
    speak(fullText, { speed: 1.05 });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        handleSpeakInstructions();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [controls, isSpeaking, speak, stop]);

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={handleSpeakInstructions}
          title="Escuchar controles (Tecla H)"
        >
          {isSpeaking ? <Square className="h-3 w-3 text-primary" /> : <Volume2 className="h-3 w-3" />}
        </Button>
        {controls.map((control, index) => (
          <span key={index} className="flex items-center gap-1.5 whitespace-nowrap">
            {control.keys.map((key, keyIndex) => (
              <span key={keyIndex} className="flex items-center">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  {key}
                </kbd>
                {keyIndex < control.keys.length - 1 && <span className="mx-1">o</span>}
              </span>
            ))}
            <span>{control.action}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <aside className="controls-helper mt-8 rounded-lg border bg-card p-4 shadow-sm" aria-label="Guía de controles de teclado">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-primary" />
          Controles de Teclado
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSpeakInstructions}
          className="gap-2 h-8 text-xs relative"
          title="Presiona 'H' para escuchar"
        >
          {isSpeaking ? (
            <>
              <Square className="h-3 w-3 fill-current text-primary" />
              Detener
            </>
          ) : (
            <>
              <Volume2 className="h-3 w-3" />
              Escuchar guía <kbd className="hidden sm:inline-block ml-1 text-[10px] bg-muted px-1 rounded border">H</kbd>
            </>
          )}
        </Button>
      </div>
      <ul className="space-y-2">
        {controls.map((control, index) => (
          <li key={index} className="flex items-center justify-between text-sm group hover:bg-muted/50 p-1.5 rounded transition-colors">
            <span className="text-muted-foreground">{control.action}</span>
            <span className="flex items-center gap-1">
              {control.keys.map((key, keyIndex) => (
                <span key={keyIndex} className="flex items-center">
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 min-w-[20px] justify-center">
                    {key}
                  </kbd>
                  {keyIndex < control.keys.length - 1 && <span className="mx-1 text-muted-foreground text-xs">o</span>}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default KeyboardHelper;