import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Narration from "@/components/Narration";
import Snelly from "@/components/Snelly";
import NavigableButton from "@/components/NavigableButton";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { equationToVerbal } from "@/lib/utils";

interface ExerciseStep {
  equation: string;
  actions: {
    label: string;
    correct: boolean;
    resultEquation?: string;
  }[];
}

const exerciseSteps: ExerciseStep[] = [
  {
    equation: "3x - 7 = 8",
    actions: [
      { label: "Sumar 7 a ambos lados", correct: true, resultEquation: "3x = 15" },
      { label: "Restar 3x de ambos lados", correct: false },
      { label: "Dividir por 8 en ambos lados", correct: false },
      { label: "Multiplicar por 3 en ambos lados", correct: false },
    ]
  },
  {
    equation: "3x = 15",
    actions: [
      { label: "Multiplicar por 3 en ambos lados", correct: false },
      { label: "Dividir ambos lados por 3", correct: true, resultEquation: "x = 5" },
      { label: "Sumar 15 a ambos lados", correct: false },
      { label: "Restar 3 de ambos lados", correct: false },
    ]
  }
];

const Exercise = () => {
  const navigate = useNavigate();
  const [narration, setNarration] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState(0);
  const [wrongActions, setWrongActions] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const savedSpeed = localStorage.getItem('narratorSpeed');
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
  }, []);

  const step = exerciseSteps[currentStep];
  const isLastStep = currentStep === exerciseSteps.length - 1;

  const { focusedIndex, setItemRef } = useKeyboardNav({
    itemCount: step.actions.length,
    onSelect: (index) => {
      const action = step.actions[index];
      
      if (action.correct) {
        console.log("🔔 Sonido de campana - ¡Correcto!");
        
        if (isLastStep) {
          setCompleted(true);
        } else {
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);
          setTimeout(() => {
            setNarration(`¡Correcto! La nueva ecuación es ${equationToVerbal(exerciseSteps[nextStep].equation)}`);
          }, 500);
        }
      } else {
        console.log("🦆 Sonido de pato - ¡Incorrecto!");
        setErrors(errors + 1);
        setWrongActions([...wrongActions, action.label]);
        setNarration(`Acción incorrecta. La ecuación es ${equationToVerbal(step.equation)}. Por favor, intenta de nuevo.`);
        
        setTimeout(() => {
          setNarration(step.actions[focusedIndex].label);
        }, 3000);
      }
    },
    enabled: !completed,
  });

  useEffect(() => {
    if (!completed) {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        setNarration(`¡Hora de ejercicios! La ecuación a resolver es ${equationToVerbal(step.equation)}. Elige el siguiente paso. Acción A: ${step.actions[0].label}`);
        return;
      }
      if (!narration.includes("incorrecta") && !narration.includes("Correcto")) {
        setNarration(step.actions[focusedIndex].label);
      }
    }
  }, [focusedIndex, currentStep, completed]);

  useEffect(() => {
    if (completed) {
      navigate("/exercise-complete", { state: { errors, wrongActions } });
    }
  }, [completed, navigate, errors, wrongActions]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-8">
      <Narration text={narration} speed={speed} onSpeakingChange={setIsSpeaking} />
      <Snelly isSpeaking={isSpeaking} />
      
      <div className="max-w-3xl mx-auto pt-24">
        <header className="border-4 border-primary bg-gradient-to-br from-card to-accent/20 p-12 rounded-2xl mb-8 text-center shadow-2xl">
          <div className="text-sm text-accent font-bold mb-4 uppercase tracking-wider" aria-label={`Paso ${currentStep + 1} de ${exerciseSteps.length}`}>
            Paso {currentStep + 1} de {exerciseSteps.length}
          </div>
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {step.equation}
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Elige el siguiente paso correcto
          </p>
        </header>

        <section className="mb-8 p-4 border-2 border-border bg-card rounded-lg" aria-label="Contador de errores">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Errores Actuales:</span>
            <span className="text-3xl font-bold" aria-live="polite">{errors}</span>
          </div>
        </section>

        <nav className="space-y-4" role="navigation" aria-label="Opciones de acción">
          {step.actions.map((action, index) => (
            <NavigableButton
              key={index}
              ref={setItemRef(index)}
              focused={focusedIndex === index}
              onClick={() => {
                if (action.correct) {
                  console.log("🔔 Sonido de campana - ¡Correcto!");
                  
                  if (isLastStep) {
                    setCompleted(true);
                  } else {
                    const nextStep = currentStep + 1;
                    setCurrentStep(nextStep);
                    setTimeout(() => {
                      setNarration(`¡Correcto! La nueva ecuación es ${equationToVerbal(exerciseSteps[nextStep].equation)}`);
                    }, 500);
                  }
                } else {
                  console.log("🦆 Sonido de pato - ¡Incorrecto!");
                  setErrors(errors + 1);
                  setWrongActions([...wrongActions, action.label]);
                  setNarration(`Acción incorrecta. La ecuación es ${equationToVerbal(step.equation)}. Por favor, intenta de nuevo.`);
                  
                  setTimeout(() => {
                    setNarration(step.actions[focusedIndex].label);
                  }, 3000);
                }
              }}
            >
              Acción {String.fromCharCode(65 + index)}: {action.label}
            </NavigableButton>
          ))}
        </nav>

        <aside className="mt-8 p-4 border-2 border-border bg-muted rounded-lg text-sm text-muted-foreground" aria-label="Controles">
          <h2 className="font-semibold mb-3 text-foreground">Controles de Teclado:</h2>
          <ul className="space-y-2">
            <li><kbd className="px-2 py-1 bg-background rounded border">↑↓</kbd> o <kbd className="px-2 py-1 bg-background rounded border">Tab</kbd> Navegar acciones</li>
            <li><kbd className="px-2 py-1 bg-background rounded border">Enter</kbd> Seleccionar acción</li>
          </ul>
          <p className="mt-3 text-xs">
            🔔 Sonido de campana = Correcto | 🦆 Sonido de pato = Incorrecto
          </p>
        </aside>
      </div>
    </main>
  );
};

export default Exercise;
