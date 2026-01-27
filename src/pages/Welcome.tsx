import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Home, Keyboard, Volume2, RotateCcw } from "lucide-react";
import PageLayout from "@/components/ui/PageLayout";
import HeroSection from "@/components/ui/HeroSection";
import MenuButton from "@/components/ui/MenuButton";
import ProgressIndicator from "@/components/ui/ProgressIndicator";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

const Welcome = () => {
  const navigate = useNavigate();
  const [narration, setNarration] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [currentSection, setCurrentSection] = useState(0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const savedSpeed = localStorage.getItem('narratorSpeed');
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
  }, []);

  const sections = [
    {
      title: "¡Bienvenido a SnailMath!",
      content: "Una aplicación interactiva para aprender ecuaciones matemáticas. Diseñada para ser accesible y fácil de usar para todos.",
      narration: "¡Bienvenido a SnailMath! Una aplicación interactiva para aprender ecuaciones matemáticas. Diseñada para ser accesible y fácil de usar para todos.",
      icon: <span className="text-4xl">🐌</span>
    },
    {
      title: "Navegación Sencilla",
      content: "Usa las flechas del teclado (↑↓) para moverte entre opciones. Presiona Enter para seleccionar. Todo está diseñado para ser intuitivo.",
      narration: "Navegación Sencilla. Usa las flechas arriba y abajo para moverte entre opciones. Presiona Enter para seleccionar.",
      icon: <Keyboard className="w-10 h-10" />
    },
    {
      title: "Ayuda por Voz",
      content: "Presiona Espacio en cualquier momento para escuchar instrucciones. Usa Escape para abrir menús o retroceder.",
      narration: "Ayuda por Voz. Presiona Espacio para escuchar instrucciones. Usa Escape para abrir menús o retroceder.",
      icon: <Volume2 className="w-10 h-10" />
    }
  ];

  const menuOptions = currentSection === sections.length - 1
    ? [
        { 
          label: "¡Comenzar!", 
          action: () => navigate("/menu"), 
          narration: "Botón Comenzar. Ir al menú principal.",
          icon: <ArrowRight className="w-6 h-6" />
        }
      ]
    : [
        { 
          label: "Siguiente", 
          action: () => setCurrentSection(prev => prev + 1),
          narration: "Botón Siguiente.",
          icon: <ArrowRight className="w-6 h-6" />
        },
        { 
          label: "Saltar al Menú", 
          action: () => navigate("/menu"), 
          narration: "Saltar tutorial e ir al Menú Principal.",
          icon: <Home className="w-6 h-6" />
        },
      ];

  const { focusedIndex, setItemRef, setFocusedIndex } = useKeyboardNav({
    itemCount: menuOptions.length,
    onSelect: (index) => {
      menuOptions[index].action();
    },
  });

  useEffect(() => {
    setFocusedIndex(0);
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
    setNarration(sections[currentSection].narration);
  }, [currentSection]);

  useEffect(() => {
    // Only update narration for button focus after initial section narration
    if (!isInitialMount.current && focusedIndex >= 0) {
      const timer = setTimeout(() => {
        setNarration(menuOptions[focusedIndex].narration);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [focusedIndex]);

  return (
    <PageLayout
      narration={narration}
      speed={speed}
      onSpeakingChange={setIsSpeaking}
      isSpeaking={isSpeaking}
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
          
          <h1 tabIndex={0} className="text-3xl sm:text-4xl font-bold text-gradient mb-4">
            {sections[currentSection].title}
          </h1>
          
          <p tabIndex={0} className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            {sections[currentSection].content}
          </p>
        </div>

        {/* Action buttons */}
        <nav className="space-y-3" role="navigation" aria-label="Opciones de bienvenida">
          {menuOptions.map((option, index) => (
            <MenuButton
              key={option.label}
              ref={setItemRef(index)}
              focused={focusedIndex === index}
              onClick={option.action}
              icon={option.icon}
              variant={index === 0 ? "primary" : "secondary"}
            >
              {option.label}
            </MenuButton>
          ))}
        </nav>

        {/* Quick tip */}
        <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/20 text-center">
          <p tabIndex={0} className="text-sm text-muted-foreground">
            <span className="font-medium text-primary">Tip:</span> Presiona <kbd>Espacio</kbd> para repetir cualquier instrucción
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Welcome;
