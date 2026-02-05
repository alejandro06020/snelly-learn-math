import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, BrainCircuit, ArrowLeft } from "lucide-react";
import PageLayout from "@/components/ui/PageLayout";
import HeroSection from "@/components/ui/HeroSection";
import MenuButton from "@/components/ui/MenuButton";
import KeyboardHelper from "@/components/ui/KeyboardHelper";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

const LevelSelect = () => {
  const navigate = useNavigate();

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
      icon: <GraduationCap className="w-6 h-6" />
    },
    { 
      id: "2",
      label: "Operaciones Básicas", 
      description: "Suma, resta, multiplicación y división",
      route: "/learn/level/2",
      icon: <BookOpen className="w-6 h-6" />
    },
    { 
      id: "3",
      label: "Variables en Ambos Lados", 
      description: "Ecuaciones más avanzadas",
      route: "/learn/level/3",
      icon: <BrainCircuit className="w-6 h-6" />
    },
    { 
      id: "back",
      label: "Volver al Menú", 
      description: "",
      route: "/menu",
      icon: <ArrowLeft className="w-6 h-6" />
    },
  ];

  const { focusedIndex, setItemRef, getTabIndex, handleItemFocus } = useKeyboardNav({
    itemCount: levels.length,
    onSelect: (index) => {
      navigate(levels[index].route);
    },
    tabBehavior: "natural",
    orientation: "vertical",
  });

  const keyboardControls = [
    { keys: ["↑", "↓"], action: "Navegar niveles" },
    { keys: ["Tab"], action: "Siguiente elemento" },
    { keys: ["Enter"], action: "Seleccionar nivel" },
    { keys: ["Esc"], action: "Menú" },
  ];

  const getLevelStatus = (levelId: string) => {
    if (levelId === "back") return "default";
    if (completedLevels.includes(levelId)) return "completed" as const;
    return "default" as const;
  };

  return (
    <PageLayout>
      <div className="pt-8 sm:pt-16">
        <HeroSection
          autoFocus
          title="Elige Tu Nivel"
          subtitle="Selecciona el nivel de dificultad para comenzar tu aprendizaje"
          size="medium"
        />

        <nav 
          className="space-y-3" 
          role="menu" 
          aria-label="Selección de nivel"
          aria-orientation="vertical"
        >
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
              role="menuitem"
              tabIndex={getTabIndex(index)}
              aria-label={`${level.label}. ${level.description}`}
              onItemFocus={() => handleItemFocus(index)}
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
