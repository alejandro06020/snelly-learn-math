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
    <div className="min-h-screen bg-background p-8">
      <Narration text={narration} />
      <Snelly />
      
      <div className="max-w-2xl mx-auto pt-24">
        <div className="border-8 border-success p-12 rounded-lg mb-8 bg-card text-center">
          <div className="text-7xl mb-6">✓</div>
          <h1 className="text-5xl font-bold mb-6 uppercase tracking-wider">
            ¡Ecuación Resuelta!
          </h1>
          <div className="border-4 border-foreground rounded-lg p-6 bg-secondary">
            <div className="text-4xl font-bold mb-2">x = 5</div>
            <div className="text-xl text-muted-foreground">Resultado Final</div>
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
