import { useEffect, useState, useCallback, useMemo } from "react";
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
  
  const storageKey = `snailmath_progress_level_${level || "1"}`;

  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem(storageKey);
    return savedPage ? parseInt(savedPage, 10) : 0;
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

  const pages = levelContent[level || "1"] || levelContent["1"];
  
  // OPCIONES FINALES: Botones reales de navegación
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
      action: () => navigate("/")
    },
  ], [navigate, storageKey]);

  // OPCIONES DEL ÍNDICE
  const indexOptions = useMemo(() => [
    ...pages.map((p, i) => ({ 
      label: `${i + 1}. ${p.title}`, 
      narration: `Ir a página ${i + 1}: ${p.title}.`,
      action: () => { setCurrentPage(i); setShowIndex(false); setShowEndOptions(false); }
    })),
    { 
      label: "Salir de la Lección", 
      narration: "Salir de la lección y volver al menú de niveles.",
      action: () => navigate("/learn") 
    },
    { 
      label: "Cerrar Índice", 
      narration: "Cerrar menú de índice y volver a la lección.",
      action: () => setShowIndex(false) 
    }
  ], [pages, navigate]);

  const isIndexActive = showIndex;
  const isEndMenuActive = showEndOptions && !showIndex;
  const isReadingMode = !showIndex && !showEndOptions;

  const activeOptionsCount = isIndexActive 
    ? indexOptions.length 
    : (isEndMenuActive ? endOptions.length : 0);

  const { focusedIndex, setItemRef } = useKeyboardNav({
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
      }
    } : undefined,
    onPrev: isReadingMode ? () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        setNarration("Estás en la primera página.");
        setTimeout(() => {
          if (!isSpeaking) setNarration(pages[currentPage].narration);
        }, 1500);
      }
    } : undefined,
    enabled: true,
  });

  const getCurrentText = useCallback(() => {
    if (showIndex) {
      if (focusedIndex === 0 && narration.includes("Índice de navegación")) return narration;
      return indexOptions[focusedIndex]?.narration || "";
    }
    if (showEndOptions) {
      // Si estamos en el mensaje inicial de fin de lección, devolver ese texto
      if (focusedIndex === 0 && narration.includes("Lección completada")) return narration;
      return endOptions[focusedIndex]?.narration || "";
    }
    return pages[currentPage].narration;
  }, [showIndex, showEndOptions, focusedIndex, narration, indexOptions, endOptions, pages, currentPage]);

  const repeatNarration = () => {
    setNarration("");
    setTimeout(() => setNarration(getCurrentText()), 100);
  };

  // Listeners de teclado (Espacio y Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        repeatNarration();
      } else if (e.code === "Escape") {
        e.preventDefault();
        setShowIndex(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [getCurrentText]);

  // CONTROL PRINCIPAL DE NARRACIÓN
  useEffect(() => {
    if (showIndex) {
      if (narration === "" || !narration.includes("Índice")) {
        if (focusedIndex === 0 && !narration.includes("Ir a página")) {
           setNarration("Índice de navegación abierto. Usa las flechas para elegir a dónde saltar o selecciona Salir.");
        } else {
           setNarration(indexOptions[focusedIndex]?.narration);
        }
      } else {
        setNarration(indexOptions[focusedIndex]?.narration);
      }
    } else if (showEndOptions) {
      // Lógica del mensaje automático al terminar
      if (focusedIndex === 0 && narration === "") {
        setNarration("Lección completada. Has terminado la explicación. Elige una opción abajo. Botón Practicar.");
      } else {
        setNarration(endOptions[focusedIndex].narration);
      }
    } else {
      setNarration(pages[currentPage].narration);
    }
  }, [currentPage, showEndOptions, showIndex, focusedIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-8">
      <Narration text={narration} speed={speed} onSpeakingChange={setIsSpeaking} />
      {!showEndOptions && !showIndex && <Snelly isSpeaking={isSpeaking} />}
      
      {/* Botón flotante del menú */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={() => setShowIndex(!showIndex)}
          className="bg-card border-2 border-primary px-4 py-2 rounded-full font-bold shadow-lg hover:bg-accent/10 text-sm"
          aria-label="Abrir Índice y Menú de Salida"
        >
          {showIndex ? "Cerrar Menú (Esc)" : "Menú / Salir (Esc)"}
        </button>
      </div>

      {/* Modal del Índice */}
      {showIndex && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 flex items-center justify-center p-8">
          <div className="max-w-xl w-full">
            <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Índice de la Lección
            </h2>
            <nav className="space-y-3">
              {indexOptions.map((option, index) => (
                <NavigableButton
                  key={option.label}
                  ref={setItemRef(index)}
                  focused={focusedIndex === index}
                  onClick={option.action}
                  className={option.label.includes("Salir") ? "border-red-400 text-red-600 hover:bg-red-50" : ""}
                >
                  {option.label}
                </NavigableButton>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <div className={`max-w-4xl mx-auto pt-24 transition-opacity ${showIndex ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        {!showEndOptions ? (
          <>
            <div className="border-4 border-primary bg-gradient-to-br from-card to-accent/20 rounded-2xl overflow-hidden mb-8 shadow-2xl">
              <div className="p-12 min-h-[500px] flex flex-col">
                <div className="text-sm text-muted-foreground mb-4 font-medium flex justify-between">
                  <span>Página {currentPage + 1} de {pages.length}</span>
                  <span className="text-primary">Presiona ESC para el menú</span>
                </div>
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {pages[currentPage].title}
                </h2>
                <div className="text-xl leading-relaxed flex-1">
                  {pages[currentPage].content}
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
            </div>

            <div className="p-4 border-2 border-border bg-muted rounded text-sm text-muted-foreground">
              <p className="font-medium mb-2">Controles:</p>
              <ul className="flex flex-wrap gap-4">
                <li>↔ Navegar</li>
                <li>Espacio: Repetir</li>
                <li><strong>ESC: Menú / Salir</strong></li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Pantalla Final: Diseño éxito */}
            <div className="border-4 border-green-500 bg-card p-8 rounded-lg mb-8 shadow-xl">
              <h2 className="text-4xl font-bold text-center mb-4 text-green-600 uppercase">
                ¡Lección Completada!
              </h2>
              <p className="text-center text-xl text-muted-foreground">
                ¡Has hecho un gran trabajo! Elige qué hacer ahora:
              </p>
            </div>

            <nav className="space-y-4">
              {endOptions.map((option, index) => (
                <NavigableButton
                  key={option.label}
                  ref={setItemRef(index)}
                  focused={focusedIndex === index}
                  onClick={option.action}
                  className={index === 0 ? "border-green-500 bg-green-50 hover:bg-green-100" : ""}
                >
                  {option.label}
                </NavigableButton>
              ))}
            </nav>
          </>
        )}
      </div>
    </div>
  );
};

export default LearnContent;