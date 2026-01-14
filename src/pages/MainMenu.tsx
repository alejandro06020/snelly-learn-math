import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Narration from "@/components/Narration";
import Snelly from "@/components/Snelly";
import NavigableButton from "@/components/NavigableButton";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

const MainMenu = () => {
  const navigate = useNavigate();
  const [narration, setNarration] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const savedSpeed = localStorage.getItem('narratorSpeed');
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
  }, []);

  const menuOptions = [
    { label: "Aprender", route: "/learn", narration: "Botón Aprender. Accede a las lecciones de ecuaciones." },
    { label: "Ejercicios", route: "/exercises", narration: "Botón Ejercicios. Practica resolviendo ecuaciones." },
    { label: "Opciones", route: "/options", narration: "Botón Opciones. Configura la accesibilidad." },
  ];

  const { focusedIndex, setItemRef } = useKeyboardNav({
    itemCount: menuOptions.length,
    onSelect: (index) => {
      navigate(menuOptions[index].route);
    },
  });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setNarration("Menú Principal de SnailMath. Botón Aprender. Accede a las lecciones de ecuaciones.");
      return;
    }
    setNarration(menuOptions[focusedIndex].narration);
  }, [focusedIndex]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-8">
      <Narration text={narration} speed={speed} onSpeakingChange={setIsSpeaking} />
      <Snelly isSpeaking={isSpeaking} />
      
      <div className="max-w-2xl mx-auto pt-24">
        <header className="border-4 border-primary bg-gradient-to-br from-card to-accent/20 p-12 rounded-2xl mb-12 shadow-2xl">
          <h1 className="text-7xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SnailMath
          </h1>
          <p className="text-center text-xl text-muted-foreground font-medium">
            Aprende ecuaciones de forma accesible
          </p>
        </header>

        <nav className="space-y-4" role="navigation" aria-label="Menú principal">
          {menuOptions.map((option, index) => (
            <NavigableButton
              key={option.label}
              ref={setItemRef(index)}
              focused={focusedIndex === index}
              onClick={() => navigate(option.route)}
            >
              {option.label}
            </NavigableButton>
          ))}
        </nav>

        <aside className="mt-8 p-4 border-2 border-border bg-muted rounded-lg text-sm text-muted-foreground" aria-label="Guía de controles">
          <h2 className="font-semibold mb-3 text-foreground">Controles de Teclado:</h2>
          <ul className="space-y-2">
            <li><kbd className="px-2 py-1 bg-background rounded border">↑↓</kbd> o <kbd className="px-2 py-1 bg-background rounded border">Tab</kbd> Navegar opciones</li>
            <li><kbd className="px-2 py-1 bg-background rounded border">Enter</kbd> Seleccionar opción</li>
          </ul>
        </aside>
      </div>
    </main>
  );
};

export default MainMenu;
