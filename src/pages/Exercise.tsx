import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Narration from "@/components/Narration";
import Snelly from "@/components/Snelly";
import NavigableButton from "@/components/NavigableButton";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

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
  const [completed, setCompleted] = useState(false);

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
          setCurrentStep(currentStep + 1);
        }
      } else {
        // Play duck quack sound (simulated)
        console.log("🦆 Sonido de pato - ¡Incorrecto!");
        setErrors(errors + 1);
        setNarration("Acción incorrecta. Por favor, intenta de nuevo.");
        
        // Reset narration after a moment
        setTimeout(() => {
          setNarration(step.actions[focusedIndex].label);
        }, 2000);
      }
    },
    enabled: !completed,
  });

  useEffect(() => {
    if (!completed) {
      if (focusedIndex === 0 && currentStep === 0 && narration === "") {
        setNarration(`¡Hora de ejercicios! La ecuación a resolver es ${step.equation}. Elige el siguiente paso. Acción A: ${step.actions[0].label}`);
      } else if (!narration.includes("incorrecta")) {
        setNarration(step.actions[focusedIndex].label);
      }
    }
  }, [focusedIndex, currentStep, completed]);

  useEffect(() => {
    if (completed) {
      navigate("/exercise-complete", { state: { errors } });
    }
  }, [completed, navigate, errors]);

  return (
    <div className="min-h-screen bg-background p-8">
      <Narration text={narration} />
      <Snelly />
      
      <div className="max-w-3xl mx-auto pt-24">
        <div className="border-8 border-foreground bg-card p-12 rounded-lg mb-8 text-center">
          <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">
            Paso {currentStep + 1} de {exerciseSteps.length}
          </div>
          <div className="text-6xl font-bold mb-4">
            {step.equation}
          </div>
          <p className="text-xl text-muted-foreground">
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
                    setCurrentStep(currentStep + 1);
                  }
                } else {
                  console.log("🦆 Sonido de pato - ¡Incorrecto!");
                  setErrors(errors + 1);
                  setNarration("Acción incorrecta. Por favor, intenta de nuevo.");
                  
                  setTimeout(() => {
                    setNarration(step.actions[focusedIndex].label);
                  }, 2000);
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
