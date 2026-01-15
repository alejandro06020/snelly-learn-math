import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Narration from "@/components/Narration";
import Snelly from "@/components/Snelly";
import NavigableButton from "@/components/NavigableButton";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { equationToVerbal } from "@/lib/utils";

interface Page {
  title: string;
  content: string;
  narration: string;
}

const levelContent: Record<string, Page[]> = {
  "1": [
    {
      title: "¿Qué es una Ecuación?",
      content: "Una ecuación es una declaración matemática que muestra que dos expresiones son iguales. Utiliza el signo igual (=) para conectar ambos lados. Piensa en ella como una balanza: lo que hagas de un lado, debes hacerlo del otro para mantenerla equilibrada.",
      narration: "Página uno: ¿Qué es una Ecuación? Una ecuación es una declaración matemática que muestra que dos expresiones son iguales. Utiliza el signo igual para conectar ambos lados. Piensa en ella como una balanza: lo que hagas de un lado, debes hacerlo del otro para mantenerla equilibrada."
    },
    {
      title: "Nuestra Ecuación de Ejemplo",
      content: "La ecuación que usaremos es: 2x + 5 = 11. Nuestro objetivo es encontrar el valor de x. Para hacer esto, necesitamos aislar x en un lado de la ecuación.",
      narration: `Página dos: Título: Nuestra Ecuación de Ejemplo. La ecuación que usaremos es ${equationToVerbal("2x + 5 = 11")}... Nuestro objetivo es encontrar el valor de x. Para hacer esto, necesitamos aislar x en un lado de la ecuación.`
    },
    {
      title: "Paso 1: Restar 5",
      content: "Primero, restamos 5 de ambos lados: 2x + 5 - 5 = 11 - 5. Esto se simplifica a: 2x = 6. Recuerda, debemos hacer la misma operación en ambos lados para mantener el equilibrio.",
      narration: `Página tres: Paso 1: Restar 5. Primero, restamos 5 de ambos lados: ${equationToVerbal("2x + 5 - 5 = 11 - 5")}... Esto se simplifica a: ${equationToVerbal("2x = 6")}... Recuerda, debemos hacer la misma operación en ambos lados para mantener el equilibrio.`
    },
    {
      title: "Paso 2: Dividir por 2",
      content: "Ahora dividimos ambos lados por 2: 2x ÷ 2 = 6 ÷ 2. Esto nos da: x = 3. ¡Hemos aislado con éxito x y encontrado su valor!",
      narration: `Página cuatro: Paso 2: Dividir por 2. Ahora dividimos ambos lados por 2: ${equationToVerbal("2x ÷ 2 = 6 ÷ 2")}... Esto nos da: ${equationToVerbal("x = 3")}... ¡Hemos aislado con éxito x y encontrado su valor!`
    },
    {
      title: "Solución",
      content: "La solución es x = 3. Puedes verificar esto sustituyendo 3 de nuevo en la ecuación original: 2(3) + 5 = 11, lo que equivale a 6 + 5 = 11. ✓",
      narration: `Página final: Solución. La solución es ${equationToVerbal("x = 3")}... Puedes verificar esto sustituyendo 3 de nuevo en la ecuación original: 2 por 3 más 5 es igual a 11, lo que equivale a ${equationToVerbal("6 + 5 = 11")}... ¡Correcto!`
    }
  ],
  "2": [
    {
      title: "Operaciones Básicas",
      content: "En este nivel, aprenderás sobre las cuatro operaciones básicas utilizadas para resolver ecuaciones: suma, resta, multiplicación y división. Cada operación tiene una operación inversa que la deshace.",
      narration: "Página uno: Operaciones Básicas. En este nivel, aprenderás sobre las cuatro operaciones básicas utilizadas para resolver ecuaciones: suma, resta, multiplicación y división. Cada operación tiene una operación inversa que la deshace."
    },
    {
      title: "Problema de Ejemplo",
      content: "Resolvamos: 3x - 7 = 8. Necesitamos aislar x utilizando operaciones inversas.",
      narration: `Página dos: Problema de Ejemplo. Resolvamos: ${equationToVerbal("3x - 7 = 8")}... Necesitamos aislar x utilizando operaciones inversas.`
    },
    {
      title: "Solución",
      content: "Sumamos 7 a ambos lados: 3x = 15. Luego dividimos ambos lados por 3: x = 5. La solución es x = 5.",
      narration: `Página final: Solución. Sumamos 7 a ambos lados: ${equationToVerbal("3x = 15")}... Luego dividimos ambos lados por 3: ${equationToVerbal("x = 5")}... La solución es ${equationToVerbal("x = 5")}.`
    }
  ],
  "3": [
    {
      title: "Variables en Ambos Lados",
      content: "A veces las ecuaciones tienen variables en ambos lados. Por ejemplo: 2x + 3 = x + 7. Para resolverlas, necesitamos llevar todas las variables a un lado.",
      narration: `Página uno: Variables en Ambos Lados. A veces las ecuaciones tienen variables en ambos lados. Por ejemplo: ${equationToVerbal("2x + 3 = x + 7")}... Para resolverlas, necesitamos llevar todas las variables a un lado.`
    },
    {
      title: "Estrategia de Solución",
      content: "Restamos x de ambos lados: x + 3 = 7. Luego restamos 3 de ambos lados: x = 4.",
      narration: `Página dos: Estrategia de Solución. Restamos x de ambos lados: ${equationToVerbal("x + 3 = 7")}... Luego restamos 3 de ambos lados: ${equationToVerbal("x = 4")}.`
    },
    {
      title: "Respuesta Final",
      content: "La solución es x = 4. Siempre verifica sustituyendo de nuevo en la ecuación original.",
      narration: `Página final: Respuesta Final. La solución es ${equationToVerbal("x = 4")}... Siempre verifica sustituyendo de nuevo en la ecuación original.`
    }
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
    // Ensure currentPage is within bounds
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
    if (!showEndOptions) {
      localStorage.setItem(storageKey, currentPage.toString());
    }
  }, [currentPage, showEndOptions, storageKey]);

  // pages is now defined earlier, before useState
  
  const endOptions = useMemo(() => [
    { 
      label: "Practicar (Ir a Ejercicios)", 
      narration: "Botón Practicar. Ve a los ejercicios para poner a prueba lo aprendido.",
      action: () => navigate("/exercises")
    },
    { 
      label: "Repetir Explicación", 
      narration: "Botón Repetir Explicación.",
      action: () => {
        setCurrentPage(0);
        setShowEndOptions(false);
        localStorage.setItem(storageKey, "0");
      }
    },
    { 
      label: "Elegir Otro Nivel", 
      narration: "Botón Elegir Otro Nivel.",
      action: () => navigate("/learn")
    },
    { 
      label: "Menú Principal", 
      narration: "Botón Menú Principal.",
      action: () => navigate("/menu")
    },
  ], [navigate, storageKey]);

  const indexOptions = useMemo(() => [
    ...pages.map((p, i) => ({ 
      label: `${i + 1}. ${p.title}`, 
      narration: `Ir a página ${i + 1}: ${p.title}.`,
      action: () => { 
        setCurrentPage(i); 
        setShowIndex(false); 
        setShowEndOptions(false); 
      }
    })),
    { 
      label: "Salir de la Lección", 
      narration: "Salir de la lección y volver al menú de niveles.",
      action: () => navigate("/learn") 
    },
    { 
      label: "Cerrar Índice", 
      narration: "Cerrar menú de índice y volver a la lección.",
      action: () => {
        setShowIndex(false);
        // Volver a narrar la página actual después de cerrar
        setTimeout(() => {
          const safeIndex = Math.min(currentPage, pages.length - 1);
          setNarration(pages[safeIndex]?.narration || "");
        }, 100);
      }
    }
  ], [pages, navigate, currentPage]);

  const isIndexActive = showIndex;
  const isEndMenuActive = showEndOptions && !showIndex;
  const isReadingMode = !showIndex && !showEndOptions;

  const activeOptionsCount = isIndexActive 
    ? indexOptions.length 
    : (isEndMenuActive ? endOptions.length : 0);

  const { focusedIndex, setItemRef, setFocusedIndex } = useKeyboardNav({
    itemCount: activeOptionsCount,
    onSelect: (index) => {
      if (isIndexActive) {
        indexOptions[index].action();
      } else if (isEndMenuActive) {
        endOptions[index].action();
      }
    },
    onNext: isReadingMode ? () => {
      if (currentPage < pages.length - 1) {
        setCurrentPage(currentPage + 1);
      } else {
        setShowEndOptions(true);
        setFocusedIndex(0);
      }
    } : undefined,
    onPrev: isReadingMode ? () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        setNarration("Estás en la primera página.");
        setTimeout(() => {
          setNarration(pages[currentPage].narration);
        }, 1500);
      }
    } : undefined,
    enabled: true,
  });

  const repeatNarration = useCallback(() => {
    if (showIndex) {
      setNarration("");
      setTimeout(() => setNarration(indexOptions[focusedIndex]?.narration || ""), 100);
    } else if (showEndOptions) {
      setNarration("");
      setTimeout(() => setNarration(endOptions[focusedIndex]?.narration || ""), 100);
    } else {
      setNarration("");
      const safeIndex = Math.min(currentPage, pages.length - 1);
      setTimeout(() => setNarration(pages[safeIndex]?.narration || ""), 100);
    }
  }, [showIndex, showEndOptions, focusedIndex, indexOptions, endOptions, pages, currentPage]);

  // Listeners de teclado (Espacio y Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        repeatNarration();
      } else if (e.code === "Escape") {
        e.preventDefault();
        if (showIndex) {
          setShowIndex(false);
          const safeIndex = Math.min(currentPage, pages.length - 1);
          setTimeout(() => setNarration(pages[safeIndex]?.narration || ""), 100);
        } else {
          setShowIndex(true);
          setFocusedIndex(0);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [repeatNarration, showIndex, pages, currentPage, setFocusedIndex]);

  // CONTROL PRINCIPAL DE NARRACIÓN
  useEffect(() => {
    if (showIndex) {
      if (isInitialMount.current || focusedIndex === 0) {
        setNarration("Índice de navegación abierto. " + indexOptions[focusedIndex]?.narration);
        isInitialMount.current = false;
      } else {
        setNarration(indexOptions[focusedIndex]?.narration || "");
      }
    } else if (showEndOptions) {
      if (focusedIndex === 0) {
        setNarration("Lección completada. Has terminado la explicación. Elige una opción. " + endOptions[focusedIndex].narration);
      } else {
        setNarration(endOptions[focusedIndex].narration);
      }
    } else {
      const safeIndex = Math.min(currentPage, pages.length - 1);
      setNarration(pages[safeIndex]?.narration || "");
    }
  }, [currentPage, showEndOptions, showIndex, focusedIndex, pages, indexOptions, endOptions]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-8">
      <Narration text={narration} speed={speed} onSpeakingChange={setIsSpeaking} />
      {!showEndOptions && !showIndex && <Snelly isSpeaking={isSpeaking} />}
      
      {/* Botón flotante del menú */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={() => {
            if (showIndex) {
              setShowIndex(false);
              const safeIndex = Math.min(currentPage, pages.length - 1);
              setTimeout(() => setNarration(pages[safeIndex]?.narration || ""), 100);
            } else {
              setShowIndex(true);
              setFocusedIndex(0);
            }
          }}
          className="bg-card border-2 border-primary px-4 py-2 rounded-full font-bold shadow-lg hover:bg-accent/10 text-sm focus:outline-none focus:ring-4 focus:ring-focus-ring"
          aria-label={showIndex ? "Cerrar índice" : "Abrir índice y menú"}
          aria-expanded={showIndex}
        >
          {showIndex ? "Cerrar Menú (Esc)" : "Menú / Salir (Esc)"}
        </button>
      </div>

      {/* Modal del Índice */}
      {showIndex && (
        <div 
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 flex items-center justify-center p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="index-title"
        >
          <div className="max-w-xl w-full">
            <h2 
              id="index-title"
              className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              Índice de la Lección
            </h2>
            <nav className="space-y-3" role="navigation" aria-label="Índice de páginas">
              {indexOptions.map((option, index) => (
                <NavigableButton
                  key={option.label}
                  ref={setItemRef(index)}
                  focused={focusedIndex === index}
                  onClick={option.action}
                  className={option.label.includes("Salir") ? "border-destructive/50 hover:bg-destructive/5" : ""}
                >
                  {option.label}
                </NavigableButton>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <article className={`max-w-4xl mx-auto pt-24 transition-opacity ${showIndex ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        {!showEndOptions ? (
          <>
            <section className="border-4 border-primary bg-gradient-to-br from-card to-accent/20 rounded-2xl overflow-hidden mb-8 shadow-2xl">
              <div className="p-12 min-h-[500px] flex flex-col">
                <div className="text-sm text-muted-foreground mb-4 font-medium flex justify-between">
                  <span aria-label={`Página ${currentPage + 1} de ${pages.length}`}>
                    Página {currentPage + 1} de {pages.length}
                  </span>
                  <span className="text-primary">Presiona ESC para el menú</span>
                </div>
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {pages[currentPage]?.title || "Cargando..."}
                </h2>
                <div className="text-xl leading-relaxed flex-1">
                  {pages[currentPage]?.content || ""}
                </div>
                <div className="flex justify-between items-center mt-8 pt-4 border-t-2 border-border">
                  <div className="text-muted-foreground text-sm">
                    {currentPage > 0 ? "← Página Anterior" : " "}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {currentPage < pages.length - 1 ? "Página Siguiente →" : "Fin de la Explicación"}
                  </div>
                </div>
              </div>
            </section>

            <aside className="p-4 border-2 border-border bg-muted rounded-lg text-sm text-muted-foreground" aria-label="Controles">
              <h3 className="font-semibold mb-2 text-foreground">Controles:</h3>
              <ul className="flex flex-wrap gap-4">
                <li><kbd className="px-2 py-1 bg-background rounded border">← →</kbd> Navegar</li>
                <li><kbd className="px-2 py-1 bg-background rounded border">Espacio</kbd> Repetir</li>
                <li><kbd className="px-2 py-1 bg-background rounded border">ESC</kbd> Menú</li>
              </ul>
            </aside>
          </>
        ) : (
          <>
            <section className="border-4 border-green-500 bg-card p-8 rounded-2xl mb-8 shadow-xl">
              <h2 className="text-4xl font-bold text-center mb-4 text-green-600">
                ¡Lección Completada!
              </h2>
              <p className="text-center text-xl text-muted-foreground">
                ¡Has hecho un gran trabajo! Elige qué hacer ahora:
              </p>
            </section>

            <nav className="space-y-4" role="navigation" aria-label="Opciones de finalización">
              {endOptions.map((option, index) => (
                <NavigableButton
                  key={option.label}
                  ref={setItemRef(index)}
                  focused={focusedIndex === index}
                  onClick={option.action}
                  className={index === 0 ? "border-green-500/50 bg-green-50/10 hover:bg-green-500/10" : ""}
                >
                  {option.label}
                </NavigableButton>
              ))}
            </nav>
          </>
        )}
      </article>
    </main>
  );
};

export default LearnContent;
