import { useEffect, useState } from "react";
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
  const [pendingChanges, setPendingChanges] = useState<Settings | null>(null);

  const settingsList = [
    { key: "volume", label: "Volumen del Narrador", value: `${settings.volume}%`, type: "number" },
    { key: "speed", label: "Velocidad del Narrador", value: `${settings.speed}x`, type: "number" },
    { key: "enabled", label: "Activar Narrador", value: settings.enabled ? "ACTIVADO" : "DESACTIVADO", type: "toggle" },
    { key: "voice", label: "Voz del Narrador", value: settings.voice, type: "text" },
    { key: "exit", label: "Salir de Opciones", value: "", type: "action" },
  ];

  const { focusedIndex, setItemRef } = useKeyboardNav({
    itemCount: settingsList.length,
    onSelect: (index) => {
      if (settingsList[index].key === "exit") {
        navigate("/");
      }
    },
    onNext: () => {
      if (showConfirmation) return;
      
      const setting = settingsList[focusedIndex];
      const newSettings = { ...settings };
      
      if (setting.key === "volume") {
        newSettings.volume = Math.min(100, settings.volume + 10);
      } else if (setting.key === "speed") {
        newSettings.speed = Math.min(2.0, Number((settings.speed + 0.1).toFixed(1)));
      } else if (setting.key === "enabled") {
        newSettings.enabled = !settings.enabled;
      }
      
      if (JSON.stringify(newSettings) !== JSON.stringify(settings)) {
        setPendingChanges(newSettings);
        setShowConfirmation(true);
      }
    },
    onPrev: () => {
      if (showConfirmation) return;
      
      const setting = settingsList[focusedIndex];
      const newSettings = { ...settings };
      
      if (setting.key === "volume") {
        newSettings.volume = Math.max(0, settings.volume - 10);
      } else if (setting.key === "speed") {
        newSettings.speed = Math.max(0.5, Number((settings.speed - 0.1).toFixed(1)));
      } else if (setting.key === "enabled") {
        newSettings.enabled = !settings.enabled;
      }
      
      if (JSON.stringify(newSettings) !== JSON.stringify(settings)) {
        setPendingChanges(newSettings);
        setShowConfirmation(true);
      }
    },
    enabled: !showConfirmation,
  });

  useEffect(() => {
    if (showConfirmation) {
      setNarration("Las modificaciones serán guardadas. Presiona ENTER para aceptar. Presiona cualquier otra tecla para cancelar.");
    } else {
      if (focusedIndex === 0 && narration === "") {
        setNarration(`Menú de Opciones. Volumen del Narrador: el valor actual es ${settings.volume} por ciento.`);
      } else {
        const setting = settingsList[focusedIndex];
        if (setting.key === "exit") {
          setNarration("Salir de Opciones. Vuelve al Menú Principal.");
        } else {
          setNarration(`${setting.label}. El valor actual es ${setting.value}.`);
        }
      }
    }
  }, [focusedIndex, showConfirmation, settings]);

  useEffect(() => {
    if (!showConfirmation) return;

    const handleConfirmation = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (pendingChanges) {
          setSettings(pendingChanges);
          // Save to localStorage
          localStorage.setItem('narratorSpeed', pendingChanges.speed.toString());
          localStorage.setItem('narratorVolume', pendingChanges.volume.toString());
          localStorage.setItem('narratorEnabled', pendingChanges.enabled.toString());
        }
        setShowConfirmation(false);
        setPendingChanges(null);
        navigate("/");
      } else {
        setShowConfirmation(false);
        setPendingChanges(null);
      }
    };

    window.addEventListener("keydown", handleConfirmation);
    return () => window.removeEventListener("keydown", handleConfirmation);
  }, [showConfirmation, pendingChanges, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-8">
      <Narration text={narration} speed={speed} onSpeakingChange={setIsSpeaking} />
      <Snelly isSpeaking={isSpeaking} />
      
      {showConfirmation && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-card border-4 border-primary rounded-2xl p-12 max-w-2xl shadow-2xl">
            <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Confirmar Cambios</h2>
            <p className="text-xl text-center mb-8 text-muted-foreground">
              Las modificaciones serán guardadas.
            </p>
            <div className="space-y-3 text-center text-lg">
              <p className="font-bold text-primary">Presiona ENTER para aceptar</p>
              <p className="text-muted-foreground">Presiona cualquier otra tecla para cancelar</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto pt-24">
        <div className="border-4 border-primary bg-gradient-to-br from-card to-accent/20 p-8 rounded-2xl mb-8 shadow-2xl">
          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Opciones de Accesibilidad
          </h1>
        </div>

        <div className="space-y-4" role="list" aria-label="Settings">
          {settingsList.map((setting, index) => (
            <button
              key={setting.key}
              ref={setItemRef(index)}
              className={`w-full p-6 text-left border-4 border-border rounded transition-all bg-card
                focus:outline-none focus:ring-4 focus:ring-focus-ring focus:border-focus
                ${focusedIndex === index ? "ring-4 ring-focus-ring border-focus bg-secondary" : ""}
                ${setting.key === "exit" ? "bg-muted" : ""}`}
              onClick={() => {
                if (setting.key === "exit") {
                  navigate("/");
                }
              }}
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
        </div>

        <div className="mt-8 p-4 border-2 border-border bg-muted rounded text-sm text-muted-foreground">
          <p className="font-medium mb-2">Controles de Teclado:</p>
          <ul className="space-y-1">
            <li>↑↓ Flechas o Tab - Navegar configuraciones</li>
            <li>← → Flechas Izquierda/Derecha - Ajustar valores</li>
            <li>Enter - Confirmar y salir</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Options;
