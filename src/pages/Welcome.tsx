import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Narration from "@/components/Narration";
import Snelly from "@/components/Snelly";
import NavigableButton from "@/components/NavigableButton";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

const Welcome = () => {
  const navigate = useNavigate();
  const [narration, setNarration] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const savedSpeed = localStorage.getItem('narratorSpeed');
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
  }, []);

  const sections = [
    {
      title: "¡Bienvenido a SnailMath!",
      content: "Soy Snelly, tu caracol guía. Te ayudaré a aprender ecuaciones matemáticas de forma divertida y accesible.",
      narration: "¡Bienvenido a SnailMath! Soy Snelly, tu caracol guía. Te ayudaré a aprender ecuaciones matemáticas de forma divertida y accesible."
    },
    {
      title: "Navegación por Teclado",
      content: "Usa las flechas arriba y abajo para moverte entre opciones. Presiona Enter para seleccionar.",
      narration: "Navegación por Teclado. Usa las flechas arriba y abajo para moverte entre opciones. Presiona Enter para seleccionar."
    },
    {
      title: "Controles Especiales",
      content: "Presiona Espacio para repetir la narración. Usa Escape para abrir menús o volver atrás.",
      narration: "Controles Especiales. Presiona Espacio para repetir la narración. Usa Escape para abrir menús o volver atrás."
    }
  ];

  const menuOptions = [
    { label: "Siguiente", action: () => {
      if (currentSection < sections.length - 1) {
        setCurrentSection(currentSection + 1);
      }
    }, narration: "Botón Siguiente." },
    { label: "Ir al Menú Principal", action: () => navigate("/menu"), narration: "Botón Ir al Menú Principal." },
  ];

  const displayedOptions = currentSection === sections.length - 1 
    ? [{ label: "Comenzar", action: () => navigate("/menu"), narration: "Botón Comenzar. Ir al menú principal." }]
    : menuOptions;

  const { focusedIndex, setItemRef, setFocusedIndex } = useKeyboardNav({
    itemCount: displayedOptions.length,
    onSelect: (index) => {
      displayedOptions[index].action();
    },
  });

  useEffect(() => {
    setFocusedIndex(0);
    if (currentSection === 0 && narration === "") {
      setNarration(sections[currentSection].narration);
    } else {
      setNarration(sections[currentSection].narration);
    }
  }, [currentSection]);

  useEffect(() => {
    if (focusedIndex >= 0) {
      setNarration(displayedOptions[focusedIndex].narration);
    }
  }, [focusedIndex, displayedOptions]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-8">
      <Narration text={narration} speed={speed} onSpeakingChange={setIsSpeaking} />
      <Snelly isSpeaking={isSpeaking} size="large" />
      
      <div className="max-w-2xl mx-auto pt-16">
        <header className="border-4 border-primary bg-gradient-to-br from-card to-accent/20 p-12 rounded-2xl mb-8 shadow-2xl">
          <h1 className="text-5xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {sections[currentSection].title}
          </h1>
          <p className="text-xl text-center text-foreground leading-relaxed">
            {sections[currentSection].content}
          </p>
        </header>

        {/* Indicador de progreso */}
        <div className="flex justify-center gap-2 mb-8" role="tablist" aria-label="Progreso del tutorial">
          {sections.map((_, index) => (
            <div
              key={index}
              role="tab"
              aria-selected={currentSection === index}
              aria-label={`Sección ${index + 1} de ${sections.length}`}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSection === index 
                  ? 'bg-primary w-8' 
                  : currentSection > index 
                    ? 'bg-primary/50' 
                    : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <nav className="space-y-4" role="navigation" aria-label="Opciones de bienvenida">
          {displayedOptions.map((option, index) => (
            <NavigableButton
              key={option.label}
              ref={setItemRef(index)}
              focused={focusedIndex === index}
              onClick={option.action}
            >
              {option.label}
            </NavigableButton>
          ))}
        </nav>

        <aside className="mt-8 p-4 border-2 border-border bg-muted rounded-lg text-sm text-muted-foreground" aria-label="Guía de controles">
          <h2 className="font-semibold mb-3 text-foreground">Controles de Teclado:</h2>
          <ul className="space-y-2">
            <li><kbd className="px-2 py-1 bg-background rounded border">↑↓</kbd> Navegar opciones</li>
            <li><kbd className="px-2 py-1 bg-background rounded border">Enter</kbd> Seleccionar</li>
            <li><kbd className="px-2 py-1 bg-background rounded border">Espacio</kbd> Repetir narración</li>
          </ul>
        </aside>
      </div>
    </main>
  );
};

export default Welcome;
