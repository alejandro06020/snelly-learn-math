import { useNavigate } from "react-router-dom";
import { BookOpen, Dumbbell, Info } from "lucide-react";
import PageLayout from "@/components/ui/PageLayout";
import HeroSection from "@/components/ui/HeroSection";
import MenuButton from "@/components/ui/MenuButton";
import KeyboardHelper from "@/components/ui/KeyboardHelper";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

const MainMenu = () => {
  const navigate = useNavigate();

  const menuOptions = [
    { 
      label: "Aprender", 
      description: "Lecciones paso a paso sobre ecuaciones",
      route: "/learn", 
      icon: <BookOpen className="w-6 h-6" />
    },
    { 
      label: "Ejercicios", 
      description: "Practica resolviendo problemas",
      route: "/exercises", 
      icon: <Dumbbell className="w-6 h-6" />
    },
    { 
      label: "Instrucciones", 
      description: "Volver a ver la bienvenida",
      route: "/", 
      icon: <Info className="w-6 h-6" />
    },
  ];

  const { focusedIndex, setItemRef, getTabIndex, handleItemFocus } = useKeyboardNav({
    itemCount: menuOptions.length,
    onSelect: (index) => {
      navigate(menuOptions[index].route);
    },
    tabBehavior: "natural",
    orientation: "vertical",
  });

  const keyboardControls = [
    { keys: ["↑", "↓"], action: "Navegar opciones" },
    { keys: ["Tab"], action: "Siguiente elemento" },
    { keys: ["Enter"], action: "Seleccionar" },
    { keys: ["Esc"], action: "Menú" },
  ];

  return (
    <PageLayout>
      <div className="pt-8 sm:pt-16">
        <HeroSection
          title="SnailMath"
          subtitle="Aprende ecuaciones matemáticas de forma interactiva y accesible"
          size="large"
          autoFocus
        />

        <nav 
          className="space-y-3" 
          role="menu" 
          aria-label="Menú principal"
          aria-orientation="vertical"
        >
          {menuOptions.map((option, index) => (
            <MenuButton
              key={option.label}
              ref={setItemRef(index)}
              focused={focusedIndex === index}
              onClick={() => navigate(option.route)}
              icon={option.icon}
              description={option.description}
              role="menuitem"
              tabIndex={getTabIndex(index)}
              aria-label={`${option.label}. ${option.description}`}
              onItemFocus={() => handleItemFocus(index)}
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
