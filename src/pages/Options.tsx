import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Narration from "@/components/Narration";
import Snelly from "@/components/Snelly";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

interface Settings {
  volume: number;
  speed: number;
  enabled: boolean;
  voice: string;
}

const Options = () => {
  const navigate = useNavigate();
  const [narration, setNarration] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const isInitialMount = useRef(true);
  
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSpeed = localStorage.getItem('narratorSpeed');
    const savedVolume = localStorage.getItem('narratorVolume');
    const savedEnabled = localStorage.getItem('narratorEnabled');
    
    return {
      volume: savedVolume ? parseInt(savedVolume) : 50,
      speed: savedSpeed ? parseFloat(savedSpeed) : 1.0,
      enabled: savedEnabled ? savedEnabled === 'true' : true,
      voice: "Snelly (Aria)",
    };
  });

  useEffect(() => {
    setSpeed(settings.speed);
  }, [settings.speed]);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showNarratorWarning, setShowNarratorWarning] = useState(false);

  const getSpeedLabel = (speed: number): string => {
    if (speed === 2.0) return "el doble";
    if (speed === 3.0) return "el triple";
    return `${speed}x`;
  };

  const settingsList = [
    { key: "volume", label: "Volumen del Narrador", value: `${settings.volume}%`, type: "number" },
    { key: "speed", label: "Velocidad del Narrador", value: getSpeedLabel(settings.speed), type: "number" },
    { key: "enabled", label: "Activar Narrador", value: settings.enabled ? "ACTIVADO" : "DESACTIVADO", type: "toggle" },
    { key: "voice", label: "Voz del Narrador", value: settings.voice, type: "text" },
    { key: "exit", label: "Volver al Menú", value: "", type: "action" },
  ];

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('narratorSpeed', newSettings.speed.toString());
    localStorage.setItem('narratorVolume', newSettings.volume.toString());
    localStorage.setItem('narratorEnabled', newSettings.enabled.toString());
    setHasUnsavedChanges(false);
  };

  const { focusedIndex, setItemRef } = useKeyboardNav({
    itemCount: settingsList.length,
    onSelect: (index) => {
      if (settingsList[index].key === "exit") {
        if (hasUnsavedChanges) {
          setShowConfirmation(true);
        } else {
          navigate("/menu");
        }
      }
    },
    onNext: () => {
      if (showConfirmation || showNarratorWarning) return;
      
      const setting = settingsList[focusedIndex];
      const newSettings = { ...settings };
      
      if (setting.key === "volume") {
        newSettings.volume = Math.min(100, settings.volume + 10);
      } else if (setting.key === "speed") {
        newSettings.speed = Math.min(4.0, Number((settings.speed + 0.1).toFixed(1)));
      } else if (setting.key === "enabled") {
        if (settings.enabled === true) {
          setShowNarratorWarning(true);
          return;
        }
        newSettings.enabled = !settings.enabled;
      }
      
      if (JSON.stringify(newSettings) !== JSON.stringify(settings)) {
        saveSettings(newSettings);
        setHasUnsavedChanges(true);
      }
    },
    onPrev: () => {
      if (showConfirmation || showNarratorWarning) return;
      
      const setting = settingsList[focusedIndex];
      const newSettings = { ...settings };
      
      if (setting.key === "volume") {
        newSettings.volume = Math.max(0, settings.volume - 10);
      } else if (setting.key === "speed") {
        newSettings.speed = Math.max(0.5, Number((settings.speed - 0.1).toFixed(1)));
      } else if (setting.key === "enabled") {
        if (settings.enabled === true) {
          setShowNarratorWarning(true);
          return;
        }
        newSettings.enabled = !settings.enabled;
      }
      
      if (JSON.stringify(newSettings) !== JSON.stringify(settings)) {
        saveSettings(newSettings);
        setHasUnsavedChanges(true);
      }
    },
    enabled: !showConfirmation && !showNarratorWarning,
  });

  useEffect(() => {
    if (showNarratorWarning) {
      setNarration("Advertencia. Si desactivas el narrador, no podrás escuchar instrucciones ni navegar con facilidad. Presiona ENTER para desactivar de todas formas. Presiona cualquier otra tecla para cancelar.");
    } else if (showConfirmation) {
      setNarration("Tienes cambios sin guardar. Presiona ENTER para salir y guardar. Presiona cualquier otra tecla para volver a opciones.");
    } else {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        setNarration(`Opciones de Accesibilidad. Volumen del Narrador: el valor actual es ${settings.volume} por ciento.`);
        return;
      }
      const setting = settingsList[focusedIndex];
      if (setting.key === "exit") {
        setNarration("Volver al Menú Principal.");
      } else {
        setNarration(`${setting.label}. El valor actual es ${setting.value}.`);
      }
    }
  }, [focusedIndex, showConfirmation, showNarratorWarning, settings]);

  useEffect(() => {
    if (!showNarratorWarning) return;

    const handleNarratorWarning = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.key === "Enter") {
        const newSettings = { ...settings, enabled: false };
        saveSettings(newSettings);
        setHasUnsavedChanges(true);
        setShowNarratorWarning(false);
      } else {
        setShowNarratorWarning(false);
      }
    };

    window.addEventListener("keydown", handleNarratorWarning);
    return () => window.removeEventListener("keydown", handleNarratorWarning);
  }, [showNarratorWarning, settings]);

  useEffect(() => {
    if (!showConfirmation) return;

    const handleConfirmation = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.key === "Enter") {
        setShowConfirmation(false);
        navigate("/menu");
      } else {
        setShowConfirmation(false);
      }
    };

    window.addEventListener("keydown", handleConfirmation);
    return () => window.removeEventListener("keydown", handleConfirmation);
  }, [showConfirmation, navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-8">
      <Narration text={narration} speed={speed} onSpeakingChange={setIsSpeaking} />
      <Snelly isSpeaking={isSpeaking} />
      
      {showNarratorWarning && (
        <div 
          className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center z-50"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="warning-title"
          aria-describedby="warning-description"
        >
          <div className="bg-card border-4 border-destructive rounded-2xl p-12 max-w-2xl shadow-2xl">
            <h2 id="warning-title" className="text-4xl font-bold mb-6 text-center text-destructive">⚠️ Advertencia</h2>
            <p id="warning-description" className="text-xl text-center mb-6 text-foreground">
              Si desactivas el narrador, no podrás escuchar las instrucciones ni navegar con facilidad por la aplicación.
            </p>
            <p className="text-lg text-center mb-8 text-muted-foreground">
              Esta aplicación está diseñada para ser accesible con el narrador activo.
            </p>
            <div className="space-y-3 text-center text-lg">
              <p className="font-bold text-destructive">Presiona ENTER para desactivar de todas formas</p>
              <p className="text-muted-foreground">Presiona cualquier otra tecla para cancelar</p>
            </div>
          </div>
        </div>
      )}
      
      {showConfirmation && (
        <div 
          className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center z-40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div className="bg-card border-4 border-primary rounded-2xl p-12 max-w-2xl shadow-2xl">
            <h2 id="confirm-title" className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">¿Salir de Opciones?</h2>
            <p className="text-xl text-center mb-8 text-muted-foreground">
              Tienes cambios sin guardar.
            </p>
            <div className="space-y-3 text-center text-lg">
              <p className="font-bold text-primary">Presiona ENTER para salir y guardar</p>
              <p className="text-muted-foreground">Presiona cualquier otra tecla para volver</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto pt-24">
        <header className="border-4 border-primary bg-gradient-to-br from-card to-accent/20 p-8 rounded-2xl mb-8 shadow-2xl">
          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Opciones de Accesibilidad
          </h1>
        </header>

        <section className="space-y-4" role="list" aria-label="Configuraciones">
          {settingsList.map((setting, index) => (
            <button
              key={setting.key}
              ref={setItemRef(index)}
              className={`w-full p-6 text-left border-4 border-border rounded-lg transition-all bg-card
                focus:outline-none focus:ring-4 focus:ring-focus-ring focus:border-focus
                ${focusedIndex === index ? "ring-4 ring-focus-ring border-focus bg-secondary" : ""}
                ${setting.key === "exit" ? "bg-muted" : ""}`}
              onClick={() => {
                if (setting.key === "exit") {
                  navigate("/menu");
                }
              }}
              aria-label={setting.key === "exit" ? setting.label : `${setting.label}: ${setting.value}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xl font-medium">{setting.label}</span>
                {setting.value && (
                  <span className="text-2xl font-bold">{setting.value}</span>
                )}
              </div>
              {setting.type !== "action" && focusedIndex === index && (
                <div className="mt-2 text-sm text-muted-foreground">
                  ← → Usa flechas Izquierda/Derecha para ajustar
                </div>
              )}
            </button>
          ))}
        </section>

        <aside className="mt-8 p-4 border-2 border-border bg-muted rounded-lg text-sm text-muted-foreground" aria-label="Controles">
          <h2 className="font-semibold mb-3 text-foreground">Controles de Teclado:</h2>
          <ul className="space-y-2">
            <li><kbd className="px-2 py-1 bg-background rounded border">↑↓</kbd> o <kbd className="px-2 py-1 bg-background rounded border">Tab</kbd> Navegar configuraciones</li>
            <li><kbd className="px-2 py-1 bg-background rounded border">← →</kbd> Ajustar valores</li>
            <li><kbd className="px-2 py-1 bg-background rounded border">Enter</kbd> Confirmar y salir</li>
          </ul>
        </aside>
      </div>
    </main>
  );
};

export default Options;
