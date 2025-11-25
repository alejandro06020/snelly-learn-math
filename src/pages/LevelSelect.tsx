import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Narration from "@/components/Narration";
import Snelly from "@/components/Snelly";
import NavigableButton from "@/components/NavigableButton";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

const LevelSelect = () => {
  const navigate = useNavigate();
  const [narration, setNarration] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  useEffect(() => {
    const savedSpeed = localStorage.getItem('narratorSpeed');
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
  }, []);

  const levels = [
    { 
      label: "Nivel 1: Introducción", 
      route: "/learn/level/1",
      narration: "Nivel 1: Introducción. Botón."
    },
    { 
      label: "Nivel 2: Operaciones Básicas", 
      route: "/learn/level/2",
      narration: "Nivel 2: Operaciones Básicas. Botón."
    },
    { 
      label: "Nivel 3: Variables en Ambos Lados", 
      route: "/learn/level/3",
      narration: "Nivel 3: Variables en Ambos Lados. Botón."
    },
    { 
      label: "Volver al Menú Principal", 
      route: "/",
      narration: "Volver al Menú Principal. Botón."
    },
  ];

  const { focusedIndex, setItemRef } = useKeyboardNav({
    itemCount: levels.length,
    onSelect: (index) => {
      navigate(levels[index].route);
    },
  });

  useEffect(() => {
    if (focusedIndex === 0 && narration === "") {
      setNarration("Elige Tu Nivel. Nivel 1: Introducción. Botón.");
    } else {
      setNarration(levels[focusedIndex].narration);
    }
  }, [focusedIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-8">
      <Narration text={narration} speed={speed} onSpeakingChange={setIsSpeaking} />
      <Snelly isSpeaking={isSpeaking} />
      
      <div className="max-w-2xl mx-auto pt-24">
        <div className="border-4 border-primary bg-gradient-to-br from-card to-accent/20 p-8 rounded-2xl mb-8 shadow-2xl">
          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Elige Tu Nivel
          </h1>
        </div>

        <nav className="space-y-4" role="navigation" aria-label="Level selection">
          {levels.map((level, index) => (
            <NavigableButton
              key={level.label}
              ref={setItemRef(index)}
              focused={focusedIndex === index}
              onClick={() => navigate(level.route)}
            >
              {level.label}
            </NavigableButton>
          ))}
        </nav>

        <div className="mt-8 p-4 border-2 border-border bg-muted rounded text-sm text-muted-foreground">
          <p className="font-medium mb-2">Controles de Teclado:</p>
          <ul className="space-y-1">
            <li>↑↓ Flechas o Tab - Navegar opciones</li>
            <li>Enter - Seleccionar nivel</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;
