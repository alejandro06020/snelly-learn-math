import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Dumbbell, Settings } from "lucide-react";
import PageLayout from "@/components/ui/PageLayout";
import HeroSection from "@/components/ui/HeroSection";
import MenuButton from "@/components/ui/MenuButton";
import KeyboardHelper from "@/components/ui/KeyboardHelper";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

const MainMenu = () => {
  const navigate = useNavigate();
  const [narration, setNarration] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const savedSpeed = localStorage.getItem('narratorSpeed');
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
  }, []);

  const menuOptions = [
    { 
      label: "Aprender", 
      description: "Lecciones paso a paso sobre ecuaciones",
      route: "/learn", 
      narration: "Botón Aprender. Accede a las lecciones de ecuaciones.",
      icon: <BookOpen className="w-6 h-6" />
    },
    { 
      label: "Ejercicios", 
      description: "Practica resolviendo problemas",
      route: "/exercises", 
      narration: "Botón Ejercicios. Practica resolviendo ecuaciones.",
      icon: <Dumbbell className="w-6 h-6" />
    },
    { 
      label: "Opciones", 
      description: "Ajusta la velocidad y accesibilidad",
      route: "/options", 
      narration: "Botón Opciones. Configura la accesibilidad.",
      icon: <Settings className="w-6 h-6" />
    },
  ];

  const { focusedIndex, setItemRef } = useKeyboardNav({
    itemCount: menuOptions.length,
    onSelect: (index) => {
      navigate(menuOptions[index].route);
    },
  });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setNarration("Menú Principal de SnailMath. " + menuOptions[0].narration);
      return;
    }
    setNarration(menuOptions[focusedIndex].narration);
  }, [focusedIndex]);

  const keyboardControls = [
    { keys: ["↑", "↓"], action: "Navegar opciones" },
    { keys: ["Enter"], action: "Seleccionar" },
  ];

  return (
    <PageLayout
      narration={narration}
      speed={speed}
      onSpeakingChange={setIsSpeaking}
      isSpeaking={isSpeaking}
    >
      <div className="pt-8 sm:pt-16">
        <HeroSection
          title="SnailMath"
          subtitle="Aprende ecuaciones matemáticas de forma interactiva y accesible"
          size="large"
        />

        <nav className="space-y-3" role="navigation" aria-label="Menú principal">
          {menuOptions.map((option, index) => (
            <MenuButton
              key={option.label}
              ref={setItemRef(index)}
              focused={focusedIndex === index}
              onClick={() => navigate(option.route)}
              icon={option.icon}
              description={option.description}
            >
              {option.label}
            </MenuButton>
          ))}
        </nav>

        <KeyboardHelper controls={keyboardControls} />
      </div>
    </PageLayout>
  );
};

export default MainMenu;
