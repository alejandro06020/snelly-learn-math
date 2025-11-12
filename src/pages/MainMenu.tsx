import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Narration from "@/components/Narration";
import Snelly from "@/components/Snelly";
import NavigableButton from "@/components/NavigableButton";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

const MainMenu = () => {
  const navigate = useNavigate();
  const [narration, setNarration] = useState("");

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
        if (window.confirm("Are you sure you want to exit?")) {
          window.close();
        }
      } else {
        navigate(menuOptions[index].route);
      }
    },
  });

  useEffect(() => {
    if (focusedIndex === 0 && narration === "") {
      setNarration("Nombre de la Aplicación. Botón Aprender.");
    } else {
      setNarration(menuOptions[focusedIndex].narration);
    }
  }, [focusedIndex]);

  return (
    <div className="min-h-screen bg-background p-8">
      <Narration text={narration} />
      <Snelly />
      
      <div className="max-w-2xl mx-auto pt-24">
        <div className="border-8 border-foreground bg-card p-12 rounded-lg mb-12">
          <h1 className="text-6xl font-bold text-center mb-2 uppercase tracking-wider">
            Nombre de la Aplicación
          </h1>
          <p className="text-center text-2xl text-muted-foreground">
            [Marcador de Posición]
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
