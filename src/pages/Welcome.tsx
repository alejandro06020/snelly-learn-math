import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Home, Keyboard, Volume2 } from "lucide-react";
import PageLayout from "@/components/ui/PageLayout";
import MenuButton from "@/components/ui/MenuButton";
import ProgressIndicator from "@/components/ui/ProgressIndicator";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

const Welcome = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const isInitialMount = useRef(true);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const sections = [
    {
      title: "¡Bienvenido a SnailMath!",
      content: "Una aplicación interactiva para aprender ecuaciones matemáticas. Diseñada para ser accesible y fácil de usar para todos.",
      icon: <span className="text-4xl">🐌</span>
    },
    {
      title: "Navegación Sencilla",
      content: "Usa las flechas del teclado (↑↓) para moverte entre opciones. Presiona Enter para seleccionar. Todo está diseñado para ser intuitivo.",
      icon: <Keyboard className="w-10 h-10" />
    },
    {
      title: "Compatible con Lectores de Pantalla",
      content: "Esta aplicación está optimizada para funcionar con lectores de pantalla. Navega usando tu lector favorito.",
      icon: <Volume2 className="w-10 h-10" />
    }
  ];

  const menuOptions = currentSection === sections.length - 1
    ? [
        { 
          label: "¡Comenzar!", 
          action: () => navigate("/menu"), 
          icon: <ArrowRight className="w-6 h-6" />
        }
      ]
    : [
        { 
          label: "Siguiente", 
          action: () => setCurrentSection(prev => prev + 1),
          icon: <ArrowRight className="w-6 h-6" />
        },
        { 
          label: "Saltar al Menú", 
          action: () => navigate("/menu"), 
          icon: <Home className="w-6 h-6" />
        },
      ];

  const { focusedIndex, setItemRef, setFocusedIndex, getTabIndex, handleItemFocus } = useKeyboardNav({
    itemCount: menuOptions.length,
    onSelect: (index) => {
      menuOptions[index].action();
    },
    tabBehavior: "natural",
    orientation: "vertical",
  });

  useEffect(() => {
    setFocusedIndex(0);
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
    // Focus en el título al cambiar de sección
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [currentSection]);

  return (
    <PageLayout
      snellySize="large"
    >
      <div className="pt-8 sm:pt-12">
        {/* Progress indicator */}
        <ProgressIndicator 
          current={currentSection} 
          total={sections.length}
          labels={["Bienvenida", "Navegación", "Ayuda"]}
        />

        {/* Content card */}
        <div className="hero-card text-center mb-8">
          <div className="flex justify-center mb-6 text-primary" aria-hidden="true">
            {sections[currentSection].icon}
          </div>
          
          <h1 ref={titleRef} tabIndex={0} className="text-3xl sm:text-4xl font-bold text-gradient mb-4">
            {sections[currentSection].title}
          </h1>
          
          <p tabIndex={0} className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            {sections[currentSection].content}
          </p>
        </div>

        {/* Action buttons */}
        <nav 
          className="space-y-3" 
          role="menu" 
          aria-label="Opciones de bienvenida"
          aria-orientation="vertical"
        >
          {menuOptions.map((option, index) => (
            <MenuButton
              key={option.label}
              ref={setItemRef(index)}
              focused={focusedIndex === index}
              onClick={option.action}
              icon={option.icon}
              variant={index === 0 ? "primary" : "secondary"}
              role="menuitem"
              tabIndex={getTabIndex(index)}
              aria-label={option.label}
              onItemFocus={() => handleItemFocus(index)}
            >
              {option.label}
            </MenuButton>
          ))}
        </nav>

        {/* Quick tip */}
        <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/20 text-center">
          <p tabIndex={0} className="text-sm text-muted-foreground">
            <span className="font-medium text-primary">Tip:</span> Usa tu lector de pantalla para navegar
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Welcome;
