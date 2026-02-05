import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Focus, Menu, X, Home, RotateCcw, BookOpen } from "lucide-react";
import PageLayout from "@/components/ui/PageLayout";
import MenuButton from "@/components/ui/MenuButton";
import KeyboardHelper from "@/components/ui/KeyboardHelper"; 
import StatCard from "@/components/ui/StatCard";
import Modal from "@/components/ui/Modal";
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
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState(0);
  const [wrongActions, setWrongActions] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const titleRef = useRef<HTMLParagraphElement>(null);

  // Función para hacer la ecuación accesible para lectores de pantalla
  const getAccessibleEquation = (equation: string): string => {
    return equation
      .replace(/x/g, " equis ")
      .replace(/-/g, " menos ")
      .replace(/\+/g, " más ")
      .replace(/=/g, " igual a ")
      .replace(/\*/g, " por ")
      .replace(/\//g, " dividido ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const menuOptions = useMemo(() => [
    { 
      label: "Volver al ejercicio", 
      action: () => { setShowMenu(false); setTimeout(() => titleRef.current?.focus(), 100); },
      icon: <Focus className="w-5 h-5" />
    },
    { 
      label: "Reiniciar ejercicio", 
      action: () => { setCurrentStep(0); setErrors(0); setWrongActions([]); setShowMenu(false); },
      icon: <RotateCcw className="w-5 h-5" />
    },
    { 
      label: "Ir a lecciones", 
      action: () => navigate("/learn"),
      icon: <BookOpen className="w-5 h-5" />
    },
    { 
      label: "Menú principal", 
      action: () => navigate("/menu"),
      icon: <Home className="w-5 h-5" />
    },
  ], [navigate]);

  const keyboardControls = showMenu
    ? [{ keys: ["↑", "↓"], action: "Navegar" }, { keys: ["Tab"], action: "Siguiente elemento" }, { keys: ["Enter"], action: "Seleccionar" }, { keys: ["Esc"], action: "Cerrar" }]
    : [{ keys: ["↑", "↓"], action: "Navegar opciones" }, { keys: ["Tab"], action: "Siguiente elemento" }, { keys: ["Enter"], action: "Seleccionar respuesta" }, { keys: ["Esc"], action: "Menú" }];

  const step = exerciseSteps[currentStep];
  const isLastStep = currentStep === exerciseSteps.length - 1;

  const handleAction = (index: number) => {
    const action = step.actions[index];
    
    if (action.correct) {
      setFeedback("correct");
      setTimeout(() => setFeedback(null), 1000);
      
      if (isLastStep) {
        setCompleted(true);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setFeedback("incorrect");
      setTimeout(() => setFeedback(null), 1000);
      setErrors(errors + 1);
      setWrongActions([...wrongActions, action.label]);
    }
  };

  const { focusedIndex, setItemRef, getTabIndex, handleItemFocus, setFocusedIndex } = useKeyboardNav({
    itemCount: showMenu ? menuOptions.length : step.actions.length,
    onSelect: showMenu 
      ? (index) => menuOptions[index].action()
      : handleAction,
    enabled: !completed,
    tabBehavior: "natural",
    orientation: "vertical",
  });

  // Manejar tecla Escape para abrir/cerrar menú
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        e.preventDefault();
        if (showMenu) {
          setShowMenu(false);
          setTimeout(() => titleRef.current?.focus(), 100);
        } else {
          setShowMenu(true);
          setFocusedIndex(0);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showMenu, setFocusedIndex]);

  useEffect(() => {
    if (completed) {
      navigate("/exercise-complete", { state: { errors, wrongActions } });
    }
  }, [completed, navigate, errors, wrongActions]);

  useEffect(() => {
    // Focus en el título al cambiar de paso
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [currentStep]);

  // Visual feedback overlay
  const feedbackStyles = {
    correct: "ring-4 ring-success/50 bg-success/5",
    incorrect: "ring-4 ring-error/50 bg-error/5 animate-shake",
  };

  return (
    <PageLayout showSnelly={!showMenu}>
      {/* Botón de menú */}
      <button 
        onClick={() => { setShowMenu(!showMenu); if (!showMenu) setFocusedIndex(0); }} 
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-card border-2 border-border rounded-full shadow-lg hover:border-primary transition-colors" 
        aria-label={showMenu ? "Cerrar menú" : "Abrir menú"}
      >
        {showMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        <span className="text-sm font-medium hidden sm:inline">{showMenu ? "Cerrar" : "Menú"}</span>
      </button>

      {/* Modal de menú */}
      <Modal open={showMenu} onClose={() => setShowMenu(false)} title="Menú del Ejercicio" showCloseButton={false}>
        <nav className="space-y-2" role="menu" aria-label="Opciones del menú" aria-orientation="vertical">
          {menuOptions.map((option, index) => (
            <button 
              key={index} 
              ref={setItemRef(index)} 
              onClick={option.action} 
              role="menuitem"
              tabIndex={getTabIndex(index)}
              aria-label={option.label}
              onFocus={() => handleItemFocus(index)}
              className={`w-full p-3 text-left rounded-lg border-2 transition-all flex items-center gap-3 ${focusedIndex === index ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
            >
              <span className="text-primary">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </nav>
      </Modal>

      <div className="pt-8 sm:pt-12">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span tabIndex={0} className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium" aria-label={`Paso ${currentStep + 1} de ${exerciseSteps.length}`}>
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

        {/* Anuncio de feedback para lectores de pantalla */}
        <div 
          role="status" 
          aria-live="assertive" 
          aria-atomic="true"
          className="sr-only"
        >
          {feedback === "correct" && "¡Correcto! Pasando al siguiente paso."}
          {feedback === "incorrect" && "Incorrecto. Intenta de nuevo."}
        </div>

        {/* Equation Display */}
        <div className={`hero-card text-center mb-8 transition-all duration-300 ${feedback ? feedbackStyles[feedback] : ''}`}>
          <p ref={titleRef} tabIndex={0} className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            Resuelve la ecuación
          </p>
          <h1 tabIndex={0} className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gradient font-display" aria-label={`Ecuación: ${getAccessibleEquation(step.equation)}`}>
            {step.equation}
          </h1>
          <p tabIndex={0} className="text-lg text-muted-foreground mt-4">
            Elige el siguiente paso correcto
          </p>
        </div>

        {/* Answer Options */}
        <nav 
          className="space-y-3" 
          role="menu" 
          aria-label="Opciones de respuesta"
          aria-orientation="vertical"
        >
          {step.actions.map((action, index) => (
            <MenuButton
              key={index}
              ref={setItemRef(index)}
              focused={focusedIndex === index}
              onClick={() => handleAction(index)}
              role="menuitem"
              tabIndex={getTabIndex(index)}
              aria-label={`Opción ${String.fromCharCode(65 + index)}: ${action.label}`}
              onItemFocus={() => handleItemFocus(index)}
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

        {/* Botón para volver a leer el ejercicio */}
        <button
          onClick={() => titleRef.current?.focus()}
          className="mt-6 w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/30 transition-colors"
          aria-label="Volver a leer el ejercicio desde el inicio"
        >
          <Focus className="w-4 h-4" aria-hidden="true" />
          Volver al ejercicio
        </button>

        <KeyboardHelper controls={keyboardControls} />
      </div>
    </PageLayout>
  );
};

export default Exercise;