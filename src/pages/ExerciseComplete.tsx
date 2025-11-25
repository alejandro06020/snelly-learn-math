import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Narration from "@/components/Narration";
import Snelly from "@/components/Snelly";
import NavigableButton from "@/components/NavigableButton";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

const ExerciseComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errors = location.state?.errors || 0;
  const [narration, setNarration] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  useEffect(() => {
    const savedSpeed = localStorage.getItem('narratorSpeed');
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
  }, []);

  const options = [
    { label: "Intentar de Nuevo", route: "/exercises", narration: "Botón Intentar de Nuevo." },
    { label: "Nuevo Ejercicio", route: "/exercises", narration: "Botón Nuevo Ejercicio." },
    { label: "Menú Principal", route: "/", narration: "Botón Menú Principal." },
  ];

  const { focusedIndex, setItemRef } = useKeyboardNav({
    itemCount: options.length,
    onSelect: (index) => {
      navigate(options[index].route);
    },
  });

  useEffect(() => {
    if (focusedIndex === 0 && narration === "") {
      setNarration(`Ecuación finalizada. Errores cometidos: ${errors}. Por favor, elige una opción. Botón Intentar de Nuevo.`);
    } else {
      setNarration(options[focusedIndex].narration);
    }
  }, [focusedIndex, errors]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-8">
      <Narration text={narration} speed={speed} onSpeakingChange={setIsSpeaking} />
      <Snelly isSpeaking={isSpeaking} />
      
      <div className="max-w-2xl mx-auto pt-24">
        <div className="border-4 border-success bg-gradient-to-br from-card to-success/10 p-12 rounded-2xl mb-8 text-center shadow-2xl">
          <div className="text-8xl mb-6">✓</div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-success to-accent bg-clip-text text-transparent">
            ¡Ecuación Resuelta!
          </h1>
          <div className="border-4 border-primary rounded-xl p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="text-5xl font-bold mb-2 text-primary">x = 5</div>
            <div className="text-xl text-muted-foreground font-medium">Resultado Final</div>
          </div>
        </div>

        <div className="border-4 border-border bg-card p-8 rounded-lg mb-8">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-medium">Errores Cometidos:</span>
            <span className={`text-5xl font-bold ${errors === 0 ? 'text-success' : ''}`}>
              {errors}
            </span>
          </div>
          {errors === 0 && (
            <p className="text-center mt-4 text-lg text-success font-medium">
              ¡Perfecto! ¡Sin errores!
            </p>
          )}
        </div>

        <nav className="space-y-4" role="navigation" aria-label="Completion options">
          {options.map((option, index) => (
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

        <div className="mt-8 p-4 border-2 border-border bg-muted rounded text-sm text-muted-foreground">
          <p className="font-medium mb-2">Controles de Teclado:</p>
          <ul className="space-y-1">
            <li>↑↓ Flechas o Tab - Navegar opciones</li>
            <li>Enter - Seleccionar opción</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExerciseComplete;
