import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2, Gauge, Power, Mic, ArrowLeft } from "lucide-react";
import PageLayout from "@/components/ui/PageLayout";
import HeroSection from "@/components/ui/HeroSection";
import KeyboardHelper from "@/components/ui/KeyboardHelper";
import Modal from "@/components/ui/Modal";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

interface Settings {
  volume: number;
  speed: number;
  enabled: boolean;
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
    };
  });

  useEffect(() => {
    setSpeed(settings.speed);
  }, [settings.speed]);

  const [showNarratorWarning, setShowNarratorWarning] = useState(false);

  const getSpeedLabel = (speed: number): string => {
    if (speed <= 0.7) return "Lento";
    if (speed <= 1.0) return "Normal";
    if (speed <= 1.5) return "Rápido";
    return "Muy rápido";
  };

  const settingsList = [
    { 
      key: "volume", 
      label: "Volumen", 
      value: `${settings.volume}%`, 
      icon: <Volume2 className="w-5 h-5" />,
      description: "Volumen de la narración"
    },
    { 
      key: "speed", 
      label: "Velocidad", 
      value: `${settings.speed.toFixed(1)}x (${getSpeedLabel(settings.speed)})`, 
      icon: <Gauge className="w-5 h-5" />,
      description: "Velocidad de la narración"
    },
    { 
      key: "enabled", 
      label: "Narrador", 
      value: settings.enabled ? "Activado" : "Desactivado", 
      icon: <Power className="w-5 h-5" />,
      description: "Activar o desactivar la narración"
    },
    { 
      key: "exit", 
      label: "Guardar y Volver", 
      value: "", 
      icon: <ArrowLeft className="w-5 h-5" />,
      description: "Volver al menú principal"
    },
  ];

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('narratorSpeed', newSettings.speed.toString());
    localStorage.setItem('narratorVolume', newSettings.volume.toString());
    localStorage.setItem('narratorEnabled', newSettings.enabled.toString());
  };

  const { focusedIndex, setItemRef } = useKeyboardNav({
    itemCount: settingsList.length,
    onSelect: (index) => {
      if (settingsList[index].key === "exit") {
        navigate("/menu");
      }
    },
    onNext: () => {
      if (showNarratorWarning) return;
      
      const setting = settingsList[focusedIndex];
      const newSettings = { ...settings };
      
      if (setting.key === "volume") {
        newSettings.volume = Math.min(100, settings.volume + 10);
      } else if (setting.key === "speed") {
        newSettings.speed = Math.min(2.0, Number((settings.speed + 0.1).toFixed(1)));
      } else if (setting.key === "enabled") {
        if (settings.enabled === true) {
          setShowNarratorWarning(true);
          return;
        }
        newSettings.enabled = true;
      }
      
      saveSettings(newSettings);
    },
    onPrev: () => {
      if (showNarratorWarning) return;
      
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
        newSettings.enabled = true;
      }
      
      saveSettings(newSettings);
    },
    enabled: !showNarratorWarning,
  });

  useEffect(() => {
    if (showNarratorWarning) {
      setNarration("Advertencia. Si desactivas el narrador, no podrás escuchar instrucciones. Presiona Enter para desactivar o cualquier otra tecla para cancelar.");
    } else {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        setNarration(`Opciones de Accesibilidad. Volumen: ${settings.volume} por ciento.`);
        return;
      }
      const setting = settingsList[focusedIndex];
      if (setting.key === "exit") {
        setNarration("Guardar y Volver al Menú Principal.");
      } else {
        setNarration(`${setting.label}. Valor actual: ${setting.value}. Usa flechas izquierda y derecha para ajustar.`);
      }
    }
  }, [focusedIndex, showNarratorWarning, settings]);

  useEffect(() => {
    if (!showNarratorWarning) return;

    const handleNarratorWarning = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.key === "Enter") {
        const newSettings = { ...settings, enabled: false };
        saveSettings(newSettings);
        setShowNarratorWarning(false);
      } else {
        setShowNarratorWarning(false);
      }
    };

    window.addEventListener("keydown", handleNarratorWarning);
    return () => window.removeEventListener("keydown", handleNarratorWarning);
  }, [showNarratorWarning, settings]);

  const keyboardControls = [
    { keys: ["↑", "↓"], action: "Navegar opciones" },
    { keys: ["←", "→"], action: "Ajustar valores" },
    { keys: ["Enter"], action: "Confirmar" },
  ];

  return (
    <PageLayout
      narration={narration}
      speed={speed}
      onSpeakingChange={setIsSpeaking}
      isSpeaking={isSpeaking}
    >
      {/* Warning Modal */}
      <Modal
        open={showNarratorWarning}
        title="⚠️ Desactivar Narrador"
        description="Esta acción puede dificultar el uso de la aplicación."
        variant="warning"
        showCloseButton={false}
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Sin el narrador, no podrás escuchar las instrucciones ni la ayuda por voz.
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-semibold text-destructive">
              Presiona <kbd>Enter</kbd> para desactivar
            </p>
            <p className="text-muted-foreground">
              Presiona cualquier otra tecla para cancelar
            </p>
          </div>
        </div>
      </Modal>

      <div className="pt-8 sm:pt-16">
        <HeroSection
          title="Opciones"
          subtitle="Personaliza tu experiencia de aprendizaje"
          size="small"
        />

        {/* Settings list */}
        <section className="space-y-3" role="list" aria-label="Configuraciones">
          {settingsList.map((setting, index) => (
            <button
              key={setting.key}
              ref={setItemRef(index)}
              className={`btn-interactive group ${focusedIndex === index ? 'focused' : ''} ${setting.key === 'exit' ? 'border-accent/30 bg-accent/5' : ''}`}
              onClick={() => {
                if (setting.key === "exit") {
                  navigate("/menu");
                }
              }}
              aria-label={setting.key === "exit" ? setting.label : `${setting.label}: ${setting.value}`}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${
                  setting.key === 'enabled' 
                    ? settings.enabled 
                      ? 'bg-success/10 text-success' 
                      : 'bg-muted text-muted-foreground'
                    : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                }`}>
                  {setting.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span className="block text-lg font-semibold text-foreground">
                    {setting.label}
                  </span>
                  {setting.description && (
                    <span className="block text-sm text-muted-foreground">
                      {setting.description}
                    </span>
                  )}
                </div>

                {/* Value */}
                {setting.value && (
                  <div className="flex-shrink-0">
                    <span className={`text-lg font-bold ${
                      setting.key === 'enabled'
                        ? settings.enabled ? 'text-success' : 'text-muted-foreground'
                        : 'text-primary'
                    }`}>
                      {setting.value}
                    </span>
                  </div>
                )}
              </div>

              {/* Adjustment hint for adjustable settings */}
              {setting.key !== "exit" && focusedIndex === index && (
                <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <kbd>←</kbd>
                  <span>Disminuir</span>
                  <span className="mx-2">|</span>
                  <kbd>→</kbd>
                  <span>Aumentar</span>
                </div>
              )}

              {/* Focus indicator */}
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-primary transition-all duration-200 ${
                  focusedIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          ))}
        </section>

        <KeyboardHelper controls={keyboardControls} />
      </div>
    </PageLayout>
  );
};

export default Options;
