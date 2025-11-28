import { useEffect, useState } from "react";
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
        // Play bell sound (simulated)
        console.log("🔔 Sonido de campana - ¡Correcto!");
        
        if (isLastStep) {
          setCompleted(true);
        } else {
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);
          // Narrate the new equation
          setTimeout(() => {
            setNarration(`¡Correcto! La nueva ecuación es ${equationToVerbal(exerciseSteps[nextStep].equation)}`);
          }, 500);
        }
      } else {
        // Play duck quack sound (simulated)
        console.log("🦆 Sonido de pato - ¡Incorrecto!");
        setErrors(errors + 1);
        setWrongActions([...wrongActions, action.label]);
        setNarration(`Acción incorrecta. La ecuación es ${equationToVerbal(step.equation)}. Por favor, intenta de nuevo.`);
        
        // Reset narration after a moment
        setTimeout(() => {
          setNarration(step.actions[focusedIndex].label);
        }, 3000);
      }
    },
    enabled: !completed,
  });

  useEffect(() => {
    if (!completed) {
      if (focusedIndex === 0 && currentStep === 0 && narration === "") {
        setNarration(`¡Hora de ejercicios! La ecuación a resolver es ${equationToVerbal(step.equation)}. Elige el siguiente paso. Acción A: ${step.actions[0].label}`);
      } else if (!narration.includes("incorrecta")) {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-8">
      <Narration text={narration} speed={speed} onSpeakingChange={setIsSpeaking} />
      <Snelly isSpeaking={isSpeaking} />
      
      <div className="max-w-3xl mx-auto pt-24">
        <div className="border-4 border-primary bg-gradient-to-br from-card to-accent/20 p-12 rounded-2xl mb-8 text-center shadow-2xl">
          <div className="text-sm text-accent font-bold mb-4 uppercase tracking-wider">
            Paso {currentStep + 1} de {exerciseSteps.length}
          </div>
          <div className="text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {step.equation}
          </div>
          <p className="text-xl text-muted-foreground font-medium">
            Elige el siguiente paso correcto
          </p>
        </div>

        <div className="mb-8 p-4 border-2 border-border bg-card rounded">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Errores Actuales:</span>
            <span className="text-3xl font-bold">{errors}</span>
          </div>
        </div>

        <nav className="space-y-4" role="navigation" aria-label="Exercise actions">
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
                    // Narrate the new equation
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

        <div className="mt-8 p-4 border-2 border-border bg-muted rounded text-sm text-muted-foreground">
          <p className="font-medium mb-2">Controles de Teclado:</p>
          <ul className="space-y-1">
            <li>↑↓ Flechas o Tab - Navegar acciones</li>
            <li>Enter - Seleccionar acción</li>
          </ul>
          <p className="mt-3 text-xs">
            🔔 Sonido de campana = Correcto | 🦆 Sonido de pato = Incorrecto
          </p>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
