import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, X, BookOpen, Play, Layers, Home } from "lucide-react";
import PageLayout from "@/components/ui/PageLayout";
import ProgressIndicator from "@/components/ui/ProgressIndicator";
import MenuButton from "@/components/ui/MenuButton";
import Modal from "@/components/ui/Modal";
import KeyboardHelper from "@/components/ui/KeyboardHelper";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { equationToVerbal } from "@/lib/utils";

interface Page {
  title: string;
  content: string;
  narration: string;
}

const levelContent: Record<string, Page[]> = {
  "1": [
    { title: "¿Qué es una Ecuación?", content: "Una ecuación es una declaración matemática que muestra que dos expresiones son iguales. Utiliza el signo igual (=) para conectar ambos lados. Piensa en ella como una balanza: lo que hagas de un lado, debes hacerlo del otro para mantenerla equilibrada.", narration: "Página uno: ¿Qué es una Ecuación? Una ecuación es una declaración matemática que muestra que dos expresiones son iguales. Utiliza el signo igual para conectar ambos lados. Piensa en ella como una balanza: lo que hagas de un lado, debes hacerlo del otro para mantenerla equilibrada." },
    { title: "Nuestra Ecuación de Ejemplo", content: "La ecuación que usaremos es: 2x + 5 = 11. Nuestro objetivo es encontrar el valor de x. Para hacer esto, necesitamos aislar x en un lado de la ecuación.", narration: `Página dos: Nuestra Ecuación de Ejemplo. La ecuación es ${equationToVerbal("2x + 5 = 11")}. Nuestro objetivo es encontrar el valor de x. Para hacer esto, necesitamos aislar x en un lado de la ecuación` },
    { title: "Paso 1: Restar 5", content: "Primero, restamos 5 de ambos lados: 2x + 5 - 5 = 11 - 5. Esto se simplifica a: 2x = 6.", narration: `Página tres: Paso 1. Restamos 5 de ambos lados. El resultado es ${equationToVerbal("2x = 6")}.` },
    { title: "Paso 2: Dividir por 2", content: "Ahora dividimos ambos lados por 2: 2x ÷ 2 = 6 ÷ 2. Esto nos da: x = 3.", narration: `Página cuatro: Paso 2. Ahora dividimos ambos lados por 2: ${equationToVerbal("2x ÷ 2 = 6 ÷ 2.")} Esto nos da: ${equationToVerbal("x = 3")}.` },
    { title: "¡Solución!", content: "La solución es x = 3. Puedes verificar: 2(3) + 5 = 11 ✓", narration: `Página final: La solución es x igual a 3. ¡Correcto!` }
  ],
  "2": [
    { title: "Operaciones Básicas", content: "Las cuatro operaciones básicas son: suma, resta, multiplicación y división. Cada una tiene una operación inversa.", narration: "Página uno: Operaciones Básicas. Suma, resta, multiplicación y división." },
    { title: "Problema de Ejemplo", content: "Resolvamos: 3x - 7 = 8", narration: `Página dos: Resolvamos ${equationToVerbal("3x - 7 = 8")}.` },
    { title: "Solución", content: "Sumamos 7: 3x = 15. Dividimos por 3: x = 5.", narration: `Página final: La solución es ${equationToVerbal("x = 5")}.` }
  ],
  "3": [
    { title: "Variables en Ambos Lados", content: "Ejemplo: 2x + 3 = x + 7. Debemos llevar todas las variables a un lado.", narration: `Página uno: Variables en Ambos Lados. Ejemplo: ${equationToVerbal("2x + 3 = x + 7")}.` },
    { title: "Estrategia", content: "Restamos x de ambos lados: x + 3 = 7. Restamos 3: x = 4.", narration: `Página dos: Restamos x y luego 3. Resultado: ${equationToVerbal("x = 4")}.` },
    { title: "Respuesta Final", content: "La solución es x = 4.", narration: `Página final: La solución es ${equationToVerbal("x = 4")}.` }
  ]
};

const LearnContent = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const isInitialMount = useRef(true);
  const storageKey = `snailmath_progress_level_${level || "1"}`;
  const pages = levelContent[level || "1"] || levelContent["1"];
  
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem(storageKey);
    const parsed = savedPage ? parseInt(savedPage, 10) : 0;
    return Math.min(Math.max(0, parsed), pages.length - 1);
  });

  const [narration, setNarration] = useState("");
  const [showEndOptions, setShowEndOptions] = useState(false);
  const [showIndex, setShowIndex] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  useEffect(() => {
    const savedSpeed = localStorage.getItem('narratorSpeed');
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
  }, []);

  useEffect(() => {
    if (!showEndOptions) localStorage.setItem(storageKey, currentPage.toString());
  }, [currentPage, showEndOptions, storageKey]);

  const endOptions = useMemo(() => [
    { label: "Practicar", description: "Ir a ejercicios", narration: "Botón Practicar.", action: () => navigate("/exercises"), icon: <Play className="w-5 h-5" /> },
    { label: "Repetir", description: "Volver al inicio", narration: "Botón Repetir.", action: () => { setCurrentPage(0); setShowEndOptions(false); localStorage.setItem(storageKey, "0"); }, icon: <BookOpen className="w-5 h-5" /> },
    { label: "Otro Nivel", description: "Elegir nivel", narration: "Botón Otro Nivel.", action: () => navigate("/learn"), icon: <Layers className="w-5 h-5" /> },
    { label: "Menú", description: "Menú principal", narration: "Botón Menú.", action: () => navigate("/menu"), icon: <Home className="w-5 h-5" /> },
  ], [navigate, storageKey]);

  const indexOptions = useMemo(() => [
    ...pages.map((p, i) => ({ label: `${i + 1}. ${p.title}`, narration: `Ir a página ${i + 1}.`, action: () => { setCurrentPage(i); setShowIndex(false); setShowEndOptions(false); } })),
    { label: "Salir", narration: "Salir de la lección.", action: () => navigate("/learn") },
    { label: "Cerrar", narration: "Cerrar menú.", action: () => { setShowIndex(false); setTimeout(() => setNarration(pages[Math.min(currentPage, pages.length - 1)]?.narration || ""), 100); } }
  ], [pages, navigate, currentPage]);

  const isIndexActive = showIndex;
  const isEndMenuActive = showEndOptions && !showIndex;
  const isReadingMode = !showIndex && !showEndOptions;
  const activeOptionsCount = isIndexActive ? indexOptions.length : (isEndMenuActive ? endOptions.length : 0);

  const { focusedIndex, setItemRef, setFocusedIndex } = useKeyboardNav({
    itemCount: activeOptionsCount,
    onSelect: (index) => { if (isIndexActive) indexOptions[index].action(); else if (isEndMenuActive) endOptions[index].action(); },
    onNext: isReadingMode ? () => { if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1); else { setShowEndOptions(true); setFocusedIndex(0); } } : undefined,
    onPrev: isReadingMode ? () => { if (currentPage > 0) setCurrentPage(currentPage - 1); } : undefined,
    enabled: true,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); setNarration(""); setTimeout(() => setNarration(pages[Math.min(currentPage, pages.length - 1)]?.narration || ""), 50); }
      else if (e.code === "Escape") { e.preventDefault(); if (showIndex) { setShowIndex(false); } else { setShowIndex(true); setFocusedIndex(0); } }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showIndex, pages, currentPage, setFocusedIndex]);

  useEffect(() => {
    if (showIndex) setNarration(indexOptions[focusedIndex]?.narration || "");
    else if (showEndOptions) setNarration(focusedIndex === 0 ? "Lección completada. " + endOptions[focusedIndex].narration : endOptions[focusedIndex].narration);
    else setNarration(pages[Math.min(currentPage, pages.length - 1)]?.narration || "");
  }, [currentPage, showEndOptions, showIndex, focusedIndex, pages, indexOptions, endOptions]);

  const keyboardControls = isReadingMode 
    ? [{ keys: ["←", "→"], action: "Cambiar página" }, { keys: ["Espacio"], action: "Repetir" }, { keys: ["Esc"], action: "Menú" }]
    : [{ keys: ["↑", "↓"], action: "Navegar" }, { keys: ["Enter"], action: "Seleccionar" }];

  return (
    <PageLayout narration={narration} speed={speed} onSpeakingChange={setIsSpeaking} isSpeaking={isSpeaking} showSnelly={!showEndOptions && !showIndex}>
      {/* Menu button */}
      <button onClick={() => setShowIndex(!showIndex)} className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-card border-2 border-border rounded-full shadow-lg hover:border-primary transition-colors" aria-label={showIndex ? "Cerrar menú" : "Abrir menú"}>
        {showIndex ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        <span className="text-sm font-medium hidden sm:inline">{showIndex ? "Cerrar" : "Menú"}</span>
      </button>

      {/* Index Modal */}
      <Modal open={showIndex} onClose={() => setShowIndex(false)} title="Índice de la Lección" showCloseButton={false}>
        <nav className="space-y-2">
          {indexOptions.map((option, index) => (
            <button key={index} ref={setItemRef(index)} onClick={option.action} className={`w-full p-3 text-left rounded-lg border-2 transition-all ${focusedIndex === index ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
              {option.label}
            </button>
          ))}
        </nav>
      </Modal>

      <div className="pt-16 sm:pt-20">
        {!showEndOptions ? (
          <>
            <ProgressIndicator current={currentPage} total={pages.length} />
            <article className="hero-card mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-4">{pages[currentPage]?.title || "Cargando..."}</h1>
              <p className="text-lg text-foreground leading-relaxed">{pages[currentPage]?.content || ""}</p>
            </article>
            <KeyboardHelper controls={keyboardControls} compact />
          </>
        ) : (
          <>
            <div className="hero-card text-center mb-8 border-success/30">
              <span className="text-4xl mb-4 block">🎉</span>
              <h1 className="text-3xl font-bold text-success mb-2">¡Lección Completada!</h1>
              <p className="text-muted-foreground">Excelente trabajo. ¿Qué te gustaría hacer ahora?</p>
            </div>
            <nav className="space-y-3">
              {endOptions.map((option, index) => (
                <MenuButton key={option.label} ref={setItemRef(index)} focused={focusedIndex === index} onClick={option.action} icon={option.icon} description={option.description} variant={index === 0 ? "primary" : "default"}>
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
