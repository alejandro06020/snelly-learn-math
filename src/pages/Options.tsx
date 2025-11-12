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
  const [settings, setSettings] = useState<Settings>({
    volume: 50,
    speed: 1.0,
    enabled: true,
    voice: "Snelly (Current)",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Settings | null>(null);

  const settingsList = [
    { key: "volume", label: "Narrator Volume", value: `${settings.volume}%`, type: "number" },
    { key: "speed", label: "Narrator Speed", value: `${settings.speed}x`, type: "number" },
    { key: "enabled", label: "Activate Narrator", value: settings.enabled ? "ON" : "OFF", type: "toggle" },
    { key: "voice", label: "Narrator Voice", value: settings.voice, type: "text" },
    { key: "exit", label: "Exit Options", value: "", type: "action" },
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
      setNarration("Modifications will be saved. Press ENTER to accept. Press any other key to cancel.");
    } else {
      if (focusedIndex === 0 && narration === "") {
        setNarration(`Options menu. Narrator Volume: current value is ${settings.volume} percent.`);
      } else {
        const setting = settingsList[focusedIndex];
        if (setting.key === "exit") {
          setNarration("Exit Options. Returns to Main Menu.");
        } else {
          setNarration(`${setting.label}. Current value is ${setting.value}.`);
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
    <div className="min-h-screen bg-background p-8">
      <Narration text={narration} />
      <Snelly />
      
      {showConfirmation && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-40">
          <div className="bg-card border-8 border-foreground rounded-lg p-12 max-w-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center">Confirm Changes</h2>
            <p className="text-xl text-center mb-8">
              Modifications will be saved.
            </p>
            <div className="space-y-3 text-center text-lg">
              <p className="font-bold">Press ENTER to accept</p>
              <p>Press any other key to cancel</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto pt-24">
        <div className="border-4 border-foreground bg-card p-8 rounded-lg mb-8">
          <h1 className="text-4xl font-bold text-center uppercase tracking-wider">
            Accessibility Options
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
                  ← → Use Left/Right arrows to adjust
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 border-2 border-border bg-muted rounded text-sm text-muted-foreground">
          <p className="font-medium mb-2">Keyboard Controls:</p>
          <ul className="space-y-1">
            <li>↑↓ Arrow Keys or Tab - Navigate settings</li>
            <li>← → Left/Right Arrows - Adjust values</li>
            <li>Enter - Confirm and exit</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Options;
