import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import PageLayout from "@/components/ui/PageLayout";
import MenuButton from "@/components/ui/MenuButton";
// Importamos la función auxiliar
import KeyboardHelper, { getKeyboardInstructions } from "@/components/ui/KeyboardHelper"; 
import StatCard from "@/components/ui/StatCard";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { equationToVerbal } from "@/lib/utils";

// ... (Resto de interfaces y constantes exerciseSteps se mantienen igual) ...
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
  // ... (otros estados) ...
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState(0);
  const [wrongActions, setWrongActions] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const isInitialMount = useRef(true);

  // Definimos los controles de teclado
  const keyboardControls = [
    { keys: ["↑", "↓"], action: "Navegar opciones" },
    { keys: ["Enter"], action: "Seleccionar respuesta" },
  ];

  useEffect(() => {
    const savedSpeed = localStorage.getItem('narratorSpeed');
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
  }, []);

  const step = exerciseSteps[currentStep];
  const isLastStep = currentStep === exerciseSteps.length - 1;

  // ... (handleAction y useKeyboardNav se mantienen igual) ...
  const handleAction = (index: number) => {
    const action = step.actions[index];
    
    if (action.correct) {
      setFeedback("correct");
      setTimeout(() => setFeedback(null), 1000);
      
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
      setFeedback("incorrect");
      setTimeout(() => setFeedback(null), 1000);
      setErrors(errors + 1);
      setWrongActions([...wrongActions, action.label]);
      setNarration(`Incorrecto. Intenta de nuevo. La ecuación es ${equationToVerbal(step.equation)}.`);
    }
  };

  const { focusedIndex, setItemRef } = useKeyboardNav({
    itemCount: step.actions.length,
    onSelect: handleAction,
    enabled: !completed,
  });

  // Efecto modificado para leer instrucciones primero
  useEffect(() => {
    if (!completed) {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        
        // Generamos las instrucciones legibles
        const controlsNarration = getKeyboardInstructions(keyboardControls);
        
        // Las concatenamos al inicio de la narración del ejercicio
        setNarration(`${controlsNarration}. Ejercicio. Resuelve la ecuación ${equationToVerbal(step.equation)}. Primera opción: ${step.actions[0].label}`);
        return;
      }
      if (!feedback) {
        setNarration(step.actions[focusedIndex].label);
      }
    }
  }, [focusedIndex, currentStep, completed, feedback]); 

  useEffect(() => {
    if (completed) {
      navigate("/exercise-complete", { state: { errors, wrongActions } });
    }
  }, [completed, navigate, errors, wrongActions]);

  // Visual feedback overlay
  const feedbackStyles = {
    correct: "ring-4 ring-success/50 bg-success/5",
    incorrect: "ring-4 ring-error/50 bg-error/5 animate-shake",
  };

  return (
    <PageLayout
      narration={narration}
      speed={speed}
      onSpeakingChange={setIsSpeaking}
      isSpeaking={isSpeaking}
    >
      <div className="pt-8 sm:pt-12">
        {/* ... (Resto del JSX se mantiene igual) ... */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
              Paso {currentStep + 1} de {exerciseSteps.length}
            </span>
          </div>
          <StatCard 
            label="Errores" 
            value={errors} 
            variant={errors > 0 ? "error" : "default"}
            icon={<AlertTriangle className="w-5 h-5" />}
          />
        </div>

        {/* Equation Display */}
        <div className={`hero-card text-center mb-8 transition-all duration-300 ${feedback ? feedbackStyles[feedback] : ''}`}>
          <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            Resuelve la ecuación
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gradient font-display">
            {step.equation}
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            Elige el siguiente paso correcto
          </p>
        </div>

        {/* Answer Options */}
        <nav className="space-y-3" role="navigation" aria-label="Opciones de respuesta">
          {step.actions.map((action, index) => (
            <MenuButton
              key={index}
              ref={setItemRef(index)}
              focused={focusedIndex === index}
              onClick={() => handleAction(index)}
            >
              <span className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{action.label}</span>
              </span>
            </MenuButton>
          ))}
        </nav>

        <KeyboardHelper controls={keyboardControls} />
      </div>
    </PageLayout>
  );
};

export default Exercise;