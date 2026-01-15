import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, BrainCircuit, ArrowLeft } from "lucide-react";
import PageLayout from "@/components/ui/PageLayout";
import HeroSection from "@/components/ui/HeroSection";
import MenuButton from "@/components/ui/MenuButton";
import KeyboardHelper from "@/components/ui/KeyboardHelper";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

const LevelSelect = () => {
  const navigate = useNavigate();
  const [narration, setNarration] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const savedSpeed = localStorage.getItem('narratorSpeed');
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
  }, []);

  // Get completed levels from localStorage
  const getCompletedLevels = () => {
    const completed: string[] = [];
    for (let i = 1; i <= 3; i++) {
      const progress = localStorage.getItem(`snailmath_progress_level_${i}`);
      if (progress) {
        completed.push(i.toString());
      }
    }
    return completed;
  };

  const completedLevels = getCompletedLevels();

  const levels = [
    { 
      id: "1",
      label: "Introducción a Ecuaciones", 
      description: "Conceptos básicos y tu primera ecuación",
      route: "/learn/level/1",
      narration: "Nivel 1: Introducción. Aprende los conceptos básicos de ecuaciones.",
      icon: <GraduationCap className="w-6 h-6" />
    },
    { 
      id: "2",
      label: "Operaciones Básicas", 
      description: "Suma, resta, multiplicación y división",
      route: "/learn/level/2",
      narration: "Nivel 2: Operaciones Básicas. Practica con las cuatro operaciones.",
      icon: <BookOpen className="w-6 h-6" />
    },
    { 
      id: "3",
      label: "Variables en Ambos Lados", 
      description: "Ecuaciones más avanzadas",
      route: "/learn/level/3",
      narration: "Nivel 3: Variables en Ambos Lados. Resuelve ecuaciones complejas.",
      icon: <BrainCircuit className="w-6 h-6" />
    },
    { 
      id: "back",
      label: "Volver al Menú", 
      description: "",
      route: "/menu",
      narration: "Volver al Menú Principal.",
      icon: <ArrowLeft className="w-6 h-6" />
    },
  ];

  const { focusedIndex, setItemRef } = useKeyboardNav({
    itemCount: levels.length,
    onSelect: (index) => {
      navigate(levels[index].route);
    },
  });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setNarration("Selección de Nivel. " + levels[0].narration);
      return;
    }
    setNarration(levels[focusedIndex].narration);
  }, [focusedIndex]);

  const keyboardControls = [
    { keys: ["↑", "↓"], action: "Navegar niveles" },
    { keys: ["Enter"], action: "Seleccionar nivel" },
  ];

  const getLevelStatus = (levelId: string) => {
    if (levelId === "back") return "default";
    if (completedLevels.includes(levelId)) return "completed" as const;
    return "default" as const;
  };

  return (
    <PageLayout
      narration={narration}
      speed={speed}
      onSpeakingChange={setIsSpeaking}
      isSpeaking={isSpeaking}
    >
      <div className="pt-8 sm:pt-16">
        <HeroSection
          title="Elige Tu Nivel"
          subtitle="Selecciona el nivel de dificultad para comenzar tu aprendizaje"
          size="medium"
        />

        <nav className="space-y-3" role="navigation" aria-label="Selección de nivel">
          {levels.map((level, index) => (
            <MenuButton
              key={level.id}
              ref={setItemRef(index)}
              focused={focusedIndex === index}
              onClick={() => navigate(level.route)}
              icon={level.icon}
              description={level.description}
              status={getLevelStatus(level.id)}
              variant={level.id === "back" ? "secondary" : "default"}
            >
              {level.label}
            </MenuButton>
          ))}
        </nav>

        <KeyboardHelper controls={keyboardControls} />
      </div>
    </PageLayout>
  );
};

export default LevelSelect;
