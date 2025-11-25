import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Narration from "@/components/Narration";
import Snelly from "@/components/Snelly";
import NavigableButton from "@/components/NavigableButton";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

const MainMenu = () => {
  const navigate = useNavigate();
  const [narration, setNarration] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  useEffect(() => {
    const savedSpeed = localStorage.getItem('narratorSpeed');
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
  }, []);

  const menuOptions = [
    { label: "Aprender", route: "/learn", narration: "Botón Aprender." },
    { label: "Ejercicios", route: "/exercises", narration: "Botón Ejercicios." },
    { label: "Opciones", route: "/options", narration: "Botón Opciones." },
    { label: "Salir de la Aplicación", route: "/exit", narration: "Botón Salir de la Aplicación." },
  ];

  const { focusedIndex, setItemRef } = useKeyboardNav({
    itemCount: menuOptions.length,
    onSelect: (index) => {
      if (index === 3) {
        if (window.confirm("¿Está seguro de que desea salir?")) {
          window.close();
        }
      } else {
        navigate(menuOptions[index].route);
      }
    },
  });

  useEffect(() => {
    if (focusedIndex === 0 && narration === "") {
      setNarration("SnailMath. Botón Aprender.");
    } else {
      setNarration(menuOptions[focusedIndex].narration);
    }
  }, [focusedIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-8">
      <Narration text={narration} speed={speed} onSpeakingChange={setIsSpeaking} />
      <Snelly isSpeaking={isSpeaking} />
      
      <div className="max-w-2xl mx-auto pt-24">
        <div className="border-4 border-primary bg-gradient-to-br from-card to-accent/20 p-12 rounded-2xl mb-12 shadow-2xl">
          <h1 className="text-7xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SnailMath
          </h1>
          <p className="text-center text-xl text-muted-foreground font-medium">
            Aprende ecuaciones de forma accesible
          </p>
        </div>

        <nav className="space-y-4" role="navigation" aria-label="Main menu">
          {menuOptions.map((option, index) => (
            <NavigableButton
              key={option.label}
              ref={setItemRef(index)}
              focused={focusedIndex === index}
              onClick={() => {
                if (index === 3) {
                  if (window.confirm("¿Está seguro de que desea salir?")) {
                    window.close();
                  }
                } else {
                  navigate(option.route);
                }
              }}
            >
              {option.label}
            </NavigableButton>
          ))}
        </nav>

        <div className="mt-8 p-4 border-2 border-border bg-muted rounded text-sm text-muted-foreground">
          <p className="font-medium mb-2">Controles de Teclado:</p>
          <ul className="space-y-1">
            <li>↑↓ Flechas o Tab - Navegar opciones</li>
            <li>Enter - Seleccionar opción</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
