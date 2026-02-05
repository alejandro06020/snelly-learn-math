import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RotateCcw, RefreshCw, Home } from "lucide-react";
import PageLayout from "@/components/ui/PageLayout";
import MenuButton from "@/components/ui/MenuButton";
import KeyboardHelper from "@/components/ui/KeyboardHelper";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

const ExerciseComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errors = location.state?.errors || 0;
  const wrongActions: string[] = location.state?.wrongActions || [];
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Delay para asegurar que el focus se aplique después del useKeyboardNav
    const timer = setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.focus();
      }
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const options = [
    { label: "Volver a resolver el ejercicio", route: "/exercises", icon: <RotateCcw className="w-5 h-5" /> },
    { label: "Nuevo Ejercicio", route: "/exercises", icon: <RefreshCw className="w-5 h-5" /> },
    { label: "Menú Principal", route: "/menu", icon: <Home className="w-5 h-5" /> },
  ];

  const { focusedIndex, setItemRef, getTabIndex, handleItemFocus } = useKeyboardNav({
    itemCount: options.length,
    onSelect: (index) => {
      navigate(options[index].route);
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
        <header className="hero-card border-success/30 text-center mb-8">
          <div className="text-6xl mb-4" role="img" aria-label="Marca de verificación">✓</div>
          <h1 ref={titleRef} tabIndex={0} className="text-4xl sm:text-5xl font-bold text-success mb-4">
            ¡Ecuación Resuelta!
          </h1>
          <div className="border-2 border-primary/30 rounded-xl p-6 bg-primary/5">
            <div tabIndex={0} className="text-4xl sm:text-5xl font-bold text-primary mb-2" aria-label="Resultado: x igual a 5">x = 5</div>
            <div tabIndex={0} className="text-lg text-muted-foreground">Resultado Final</div>
          </div>
        </header>

        <section className="hero-card mb-8" aria-label="Resumen de errores">
          <div className="flex justify-between items-center">
            <span tabIndex={0} className="text-xl font-medium">Errores Cometidos:</span>
            <span tabIndex={0} className={`text-4xl font-bold ${errors === 0 ? 'text-success' : 'text-destructive'}`} aria-label={`${errors} errores`}>
              {errors}
            </span>
          </div>
          {errors === 0 && (
            <p tabIndex={0} className="text-center mt-4 text-lg text-success font-medium">
              ¡Perfecto! ¡Sin errores!
            </p>
          )}
          {wrongActions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <h2 tabIndex={0} className="text-lg font-medium mb-2">Acciones incorrectas:</h2>
              <ul className="list-disc list-inside text-muted-foreground">
                {wrongActions.map((action, idx) => (
                  <li tabIndex={0} key={idx}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <nav 
          className="space-y-3" 
          role="menu" 
          aria-label="Opciones de finalización"
          aria-orientation="vertical"
        >
          {options.map((option, index) => (
            <MenuButton
              key={option.label}
              ref={setItemRef(index)}
              focused={focusedIndex === index}
              onClick={() => navigate(option.route)}
              icon={option.icon}
              role="menuitem"
              tabIndex={getTabIndex(index)}
              aria-label={option.label}
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


export default ExerciseComplete;