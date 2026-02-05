import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, X, BookOpen, Play, Layers, Home } from "lucide-react";
import PageLayout from "@/components/ui/PageLayout";
import ProgressIndicator from "@/components/ui/ProgressIndicator";
import MenuButton from "@/components/ui/MenuButton";
import Modal from "@/components/ui/Modal";
import KeyboardHelper from "@/components/ui/KeyboardHelper";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

interface Page {
  title: string;
  content: string;
}

const levelContent: Record<string, Page[]> = {
  "1": [
    { title: "¿Qué es una Ecuación?", content: "Una ecuación es una declaración matemática que muestra que dos expresiones son iguales. Utiliza el signo igual (=) para conectar ambos lados. Piensa en ella como una balanza: lo que hagas de un lado, debes hacerlo del otro para mantenerla equilibrada." },
    { title: "Nuestra Ecuación de Ejemplo", content: "La ecuación que usaremos es: 2x + 5 = 11. Nuestro objetivo es encontrar el valor de x. Para hacer esto, necesitamos aislar x en un lado de la ecuación." },
    { title: "Paso 1: Restar 5", content: "Primero, restamos 5 de ambos lados: 2x + 5 - 5 = 11 - 5. Esto se simplifica a: 2x = 6." },
    { title: "Paso 2: Dividir por 2", content: "Ahora dividimos ambos lados por 2: 2x ÷ 2 = 6 ÷ 2. Esto nos da: x = 3." },
    { title: "¡Solución!", content: "La solución es x = 3. Puedes verificar: 2(3) + 5 = 11 ✓" }
  ],
  "2": [
    { title: "Operaciones Básicas", content: "Las cuatro operaciones básicas son: suma, resta, multiplicación y división. Cada una tiene una operación inversa." },
    { title: "Problema de Ejemplo", content: "Resolvamos: 3x - 7 = 8" },
    { title: "Solución", content: "Sumamos 7: 3x = 15. Dividimos por 3: x = 5." }
  ],
  "3": [
    { title: "Variables en Ambos Lados", content: "Ejemplo: 2x + 3 = x + 7. Debemos llevar todas las variables a un lado." },
    { title: "Estrategia", content: "Restamos x de ambos lados: x + 3 = 7. Restamos 3: x = 4." },
    { title: "Respuesta Final", content: "La solución es x = 4." }
  ]
};

const LearnContent = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const storageKey = `snailmath_progress_level_${level || "1"}`;
  const pages = levelContent[level || "1"] || levelContent["1"];
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem(storageKey);
    const parsed = savedPage ? parseInt(savedPage, 10) : 0;
    return Math.min(Math.max(0, parsed), pages.length - 1);
  });

  const [showEndOptions, setShowEndOptions] = useState(false);
  const [showIndex, setShowIndex] = useState(false);

  useEffect(() => {
    if (!showEndOptions) localStorage.setItem(storageKey, currentPage.toString());
  }, [currentPage, showEndOptions, storageKey]);

  useEffect(() => {
    // Focus en el título al cambiar de página
    if (titleRef.current && !showEndOptions && !showIndex) {
      titleRef.current.focus();
    }
  }, [currentPage, showEndOptions, showIndex]);

  const endOptions = useMemo(() => [
    { label: "Practicar", description: "Ir a ejercicios", action: () => navigate("/exercises"), icon: <Play className="w-5 h-5" /> },
    { label: "Repetir", description: "Volver al inicio", action: () => { setCurrentPage(0); setShowEndOptions(false); localStorage.setItem(storageKey, "0"); }, icon: <BookOpen className="w-5 h-5" /> },
    { label: "Otro Nivel", description: "Elegir nivel", action: () => navigate("/learn"), icon: <Layers className="w-5 h-5" /> },
    { label: "Menú", description: "Menú principal", action: () => navigate("/menu"), icon: <Home className="w-5 h-5" /> },
  ], [navigate, storageKey]);

  const indexOptions = useMemo(() => [
    ...pages.map((p, i) => ({ 
      label: `${i + 1}. ${p.title}`, 
      action: () => { setCurrentPage(i); setShowIndex(false); setShowEndOptions(false); },
      isCurrent: i === currentPage
    })),
    { label: "Salir", action: () => navigate("/learn"), isCurrent: false },
    { label: "Cerrar", action: () => { setShowIndex(false); }, isCurrent: false }
  ], [pages, navigate, currentPage]);

  const isIndexActive = showIndex;
  const isEndMenuActive = showEndOptions && !showIndex;
  const isReadingMode = !showIndex && !showEndOptions;
  const activeOptionsCount = isIndexActive ? indexOptions.length : (isEndMenuActive ? endOptions.length : 0);

  const { focusedIndex, setItemRef, setFocusedIndex, getTabIndex, handleItemFocus } = useKeyboardNav({
    itemCount: activeOptionsCount,
    onSelect: (index) => { if (isIndexActive) indexOptions[index].action(); else if (isEndMenuActive) endOptions[index].action(); },
    onNext: isReadingMode ? () => { if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1); else { setShowEndOptions(true); setFocusedIndex(0); } } : undefined,
    onPrev: isReadingMode ? () => { if (currentPage > 0) setCurrentPage(currentPage - 1); } : undefined,
    enabled: true,
    tabBehavior: isReadingMode ? "natural" : "natural",
    orientation: "vertical",
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") { e.preventDefault(); if (showIndex) { setShowIndex(false); } else { setShowIndex(true); setFocusedIndex(0); } }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showIndex, setFocusedIndex]);

  const keyboardControls = isReadingMode 
    ? [{ keys: ["←", "→"], action: "Cambiar página" }, { keys: ["Tab"], action: "Siguiente elemento" }, { keys: ["Esc"], action: "Menú" }]
    : [{ keys: ["↑", "↓"], action: "Navegar" }, { keys: ["Tab"], action: "Siguiente elemento" }, { keys: ["Enter"], action: "Seleccionar" }, { keys: ["Esc"], action: "Cerrar" }];

  return (
    <PageLayout showSnelly={!showEndOptions && !showIndex}>
      {/* Menu button */}
      <button onClick={() => setShowIndex(!showIndex)} className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-card border-2 border-border rounded-full shadow-lg hover:border-primary transition-colors" aria-label={showIndex ? "Cerrar menú" : "Abrir menú"}>
        {showIndex ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        <span className="text-sm font-medium hidden sm:inline">{showIndex ? "Cerrar" : "Menú"}</span>
      </button>

      {/* Index Modal */}
      <Modal open={showIndex} onClose={() => setShowIndex(false)} title="Índice de la Lección" showCloseButton={false}>
        <nav className="space-y-2" role="menu" aria-label="Índice de páginas" aria-orientation="vertical">
          {indexOptions.map((option, index) => (
            <button 
              key={index} 
              ref={setItemRef(index)} 
              onClick={option.action} 
              role="menuitem"
              tabIndex={getTabIndex(index)}
              aria-label={option.isCurrent ? `${option.label} (página actual)` : option.label}
              aria-current={option.isCurrent ? "page" : undefined}
              onFocus={() => handleItemFocus(index)}
              className={`w-full p-3 text-left rounded-lg border-2 transition-all ${option.isCurrent ? 'bg-primary/5' : ''} ${focusedIndex === index ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
            >
              {option.label}
              {option.isCurrent && <span className="ml-2 text-xs text-primary">(actual)</span>}
            </button>
          ))}
        </nav>
      </Modal>

      <div className="pt-16 sm:pt-20">
        {!showEndOptions ? (
          <>
            <ProgressIndicator current={currentPage} total={pages.length} />
            <article className="hero-card mb-6">
              <h1 ref={titleRef} tabIndex={0} className="text-2xl sm:text-3xl font-bold text-gradient mb-4">{pages[currentPage]?.title || "Cargando..."}</h1>
              <p tabIndex={0} className="text-lg text-foreground leading-relaxed">{pages[currentPage]?.content || ""}</p>
            </article>
            <KeyboardHelper controls={keyboardControls} compact />
          </>
        ) : (
          <>
            <div className="hero-card text-center mb-8 border-success/30">
              <span className="text-4xl mb-4 block" role="img" aria-label="Celebración">🎉</span>
              <h1 tabIndex={0} className="text-3xl font-bold text-success mb-2">¡Lección Completada!</h1>
              <p tabIndex={0} className="text-muted-foreground">Excelente trabajo. ¿Qué te gustaría hacer ahora?</p>
            </div>
            <nav className="space-y-3" role="menu" aria-label="Opciones de finalización" aria-orientation="vertical">
              {endOptions.map((option, index) => (
                <MenuButton 
                  key={option.label} 
                  ref={setItemRef(index)} 
                  focused={focusedIndex === index} 
                  onClick={option.action} 
                  icon={option.icon} 
                  description={option.description} 
                  variant={index === 0 ? "primary" : "default"}
                  role="menuitem"
                  tabIndex={getTabIndex(index)}
                  aria-label={`${option.label}. ${option.description}`}
                  onItemFocus={() => handleItemFocus(index)}
                >
                  {option.label}
                </MenuButton>
              ))}
            </nav>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default LearnContent;
