import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Narration from "@/components/Narration";
import Snelly from "@/components/Snelly";
import NavigableButton from "@/components/NavigableButton";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { equationToVerbal } from "@/lib/utils";

const ExerciseComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errors = location.state?.errors || 0;
  const wrongActions: string[] = location.state?.wrongActions || [];
  const [narration, setNarration] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const savedSpeed = localStorage.getItem('narratorSpeed');
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
  }, []);

  const options = [
    { label: "Volver a resolver el ejercicio", route: "/exercises", narration: "Botón Volver a resolver el ejercicio." },
    { label: "Nuevo Ejercicio", route: "/exercises", narration: "Botón Nuevo Ejercicio." },
    { label: "Menú Principal", route: "/menu", narration: "Botón Menú Principal." },
  ];

  const { focusedIndex, setItemRef } = useKeyboardNav({
    itemCount: options.length,
    onSelect: (index) => {
      navigate(options[index].route);
    },
  });

  useEffect(() => {
    const resultadoVerbal = equationToVerbal("x = 5");
    const erroresText = errors === 0 ? "sin errores" : errors === 1 ? "un error" : `${errors} errores`;
    
    let wrongActionsText = "";
    if (wrongActions.length > 0) {
      wrongActionsText = ` Las acciones incorrectas fueron: ${wrongActions.join(", ")}.`;
    }
    
    setNarration(`¡Ecuación finalizada! Resultado: ${resultadoVerbal}. Errores cometidos: ${erroresText}.${wrongActionsText} Por favor, elige una opción.`);
  }, [errors, wrongActions]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setNarration(options[focusedIndex].narration);
  }, [focusedIndex]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-8">
      <Narration text={narration} speed={speed} onSpeakingChange={setIsSpeaking} />
      <Snelly isSpeaking={isSpeaking} />
      
      <div className="max-w-2xl mx-auto pt-24">
        <header className="border-4 border-green-500 bg-gradient-to-br from-card to-green-500/10 p-12 rounded-2xl mb-8 text-center shadow-2xl">
          <div className="text-8xl mb-6" aria-hidden="true">✓</div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-500 to-accent bg-clip-text text-transparent">
            ¡Ecuación Resuelta!
          </h1>
          <div className="border-4 border-primary rounded-xl p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="text-5xl font-bold mb-2 text-primary">x = 5</div>
            <div className="text-xl text-muted-foreground font-medium">Resultado Final</div>
          </div>
        </header>

        <section className="border-4 border-border bg-card p-8 rounded-lg mb-8" aria-label="Resumen de errores">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-medium">Errores Cometidos:</span>
            <span className={`text-5xl font-bold ${errors === 0 ? 'text-green-500' : 'text-destructive'}`}>
              {errors}
            </span>
          </div>
          {errors === 0 && (
            <p className="text-center mt-4 text-lg text-green-500 font-medium">
              ¡Perfecto! ¡Sin errores!
            </p>
          )}
          {wrongActions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <h2 className="text-lg font-medium mb-2">Acciones incorrectas:</h2>
              <ul className="list-disc list-inside text-muted-foreground">
                {wrongActions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <nav className="space-y-4" role="navigation" aria-label="Opciones de finalización">
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

        <aside className="mt-8 p-4 border-2 border-border bg-muted rounded-lg text-sm text-muted-foreground" aria-label="Controles">
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

export default ExerciseComplete;
