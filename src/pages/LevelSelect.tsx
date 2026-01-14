import { useEffect, useState, useRef } from "react";
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
  const isInitialMount = useRef(true);

  useEffect(() => {
    const savedSpeed = localStorage.getItem('narratorSpeed');
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
  }, []);

  const levels = [
    { 
      label: "Nivel 1: Introducción", 
      route: "/learn/level/1",
      narration: "Nivel 1: Introducción. Aprende los conceptos básicos de ecuaciones."
    },
    { 
      label: "Nivel 2: Operaciones Básicas", 
      route: "/learn/level/2",
      narration: "Nivel 2: Operaciones Básicas. Practica con suma, resta, multiplicación y división."
    },
    { 
      label: "Nivel 3: Variables en Ambos Lados", 
      route: "/learn/level/3",
      narration: "Nivel 3: Variables en Ambos Lados. Resuelve ecuaciones más complejas."
    },
    { 
      label: "Volver al Menú Principal", 
      route: "/menu",
      narration: "Volver al Menú Principal."
    },
  ];

  const { focusedIndex, setItemRef } = useKeyboardNav({
    itemCount: levels.length,
    onSelect: (index) => {
      navigate(levels[index].route);
    },
  });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setNarration("Elige Tu Nivel de Aprendizaje. " + levels[0].narration);
      return;
    }
    setNarration(levels[focusedIndex].narration);
  }, [focusedIndex]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-8">
      <Narration text={narration} speed={speed} onSpeakingChange={setIsSpeaking} />
      <Snelly isSpeaking={isSpeaking} />
      
      <div className="max-w-2xl mx-auto pt-24">
        <header className="border-4 border-primary bg-gradient-to-br from-card to-accent/20 p-8 rounded-2xl mb-8 shadow-2xl">
          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Elige Tu Nivel
          </h1>
          <p className="text-center text-muted-foreground mt-4">
            Selecciona el nivel de dificultad para comenzar
          </p>
        </header>

        <nav className="space-y-4" role="navigation" aria-label="Selección de nivel">
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

        <aside className="mt-8 p-4 border-2 border-border bg-muted rounded-lg text-sm text-muted-foreground" aria-label="Controles">
          <h2 className="font-semibold mb-3 text-foreground">Controles de Teclado:</h2>
          <ul className="space-y-2">
            <li><kbd className="px-2 py-1 bg-background rounded border">↑↓</kbd> o <kbd className="px-2 py-1 bg-background rounded border">Tab</kbd> Navegar opciones</li>
            <li><kbd className="px-2 py-1 bg-background rounded border">Enter</kbd> Seleccionar nivel</li>
          </ul>
        </aside>
      </div>
    </main>
  );
};

export default LevelSelect;
