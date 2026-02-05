import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";
import PageLayout from "@/components/ui/PageLayout";
import HeroSection from "@/components/ui/HeroSection";
import KeyboardHelper from "@/components/ui/KeyboardHelper";
import MenuButton from "@/components/ui/MenuButton";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

const Options = () => {
  const navigate = useNavigate();

  const menuOptions = [
    { 
      label: "Volver al Menú", 
      description: "Regresar al menú principal",
      action: () => navigate("/menu"),
      icon: <ArrowLeft className="w-6 h-6" />
    },
  ];

  const { focusedIndex, setItemRef, getTabIndex } = useKeyboardNav({
    itemCount: menuOptions.length,
    onSelect: (index) => {
      menuOptions[index].action();
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
          title="Opciones"
          subtitle="Configuración de accesibilidad"
          size="small"
          autoFocus
        />

        {/* Accessibility info */}
        <section className="hero-card mb-6" aria-labelledby="accessibility-heading">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h2 id="accessibility-heading" tabIndex={0} className="text-lg font-semibold text-foreground mb-2">
                Accesibilidad
              </h2>
              <p tabIndex={0} className="text-muted-foreground">
                Esta aplicación está diseñada para ser compatible con lectores de pantalla. 
                Usa tu lector de pantalla favorito para navegar por la aplicación.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground" role="list">
                <li tabIndex={0}>• Usa las flechas ↑↓ para navegar entre opciones</li>
                <li tabIndex={0}>• Presiona Enter para seleccionar</li>
                <li tabIndex={0}>• Usa Tab para moverte entre secciones</li>
                <li tabIndex={0}>• Presiona Escape para volver o cerrar menús</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Menu options */}
        <nav 
          className="space-y-3" 
          role="menu" 
          aria-label="Opciones"
          aria-orientation="vertical"
        >
          {menuOptions.map((option, index) => (
            <MenuButton
              key={option.label}
              ref={setItemRef(index)}
              focused={focusedIndex === index}
              onClick={option.action}
              icon={option.icon}
              description={option.description}
              variant="secondary"
              role="menuitem"
              tabIndex={getTabIndex(index)}
              aria-label={`${option.label}. ${option.description}`}
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

export default Options;
