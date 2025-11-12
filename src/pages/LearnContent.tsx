import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Narration from "@/components/Narration";
import NavigableButton from "@/components/NavigableButton";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

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
      narration: "Página dos: Nuestra Ecuación de Ejemplo. La ecuación que usaremos es 2x + 5 = 11. Nuestro objetivo es encontrar el valor de x. Para hacer esto, necesitamos aislar x en un lado de la ecuación."
    },
    {
      title: "Paso 1: Restar 5",
      content: "Primero, restamos 5 de ambos lados: 2x + 5 - 5 = 11 - 5. Esto se simplifica a: 2x = 6. Recuerda, debemos hacer la misma operación en ambos lados para mantener el equilibrio.",
      narration: "Página tres: Paso 1: Restar 5. Primero, restamos 5 de ambos lados: 2x + 5 - 5 = 11 - 5. Esto se simplifica a: 2x = 6. Recuerda, debemos hacer la misma operación en ambos lados para mantener el equilibrio."
    },
    {
      title: "Paso 2: Dividir por 2",
      content: "Ahora dividimos ambos lados por 2: 2x ÷ 2 = 6 ÷ 2. Esto nos da: x = 3. ¡Hemos aislado con éxito x y encontrado su valor!",
      narration: "Página cuatro: Paso 2: Dividir por 2. Ahora dividimos ambos lados por 2: 2x ÷ 2 = 6 ÷ 2. Esto nos da: x = 3. ¡Hemos aislado con éxito x y encontrado su valor!"
    },
    {
      title: "Solución",
      content: "La solución es x = 3. Puedes verificar esto sustituyendo 3 de nuevo en la ecuación original: 2(3) + 5 = 11, lo que equivale a 6 + 5 = 11. ✓",
      narration: "Página final: Solución. La solución es x = 3. Puedes verificar esto sustituyendo 3 de nuevo en la ecuación original: 2 por 3 más 5 es igual a 11, lo que equivale a 6 más 5 es igual a 11. ¡Correcto!"
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
      narration: "Página dos: Problema de Ejemplo. Resolvamos: 3x - 7 = 8. Necesitamos aislar x utilizando operaciones inversas."
    },
    {
      title: "Solución",
      content: "Sumamos 7 a ambos lados: 3x = 15. Luego dividimos ambos lados por 3: x = 5. La solución es x = 5.",
      narration: "Página final: Solución. Sumamos 7 a ambos lados: 3x = 15. Luego dividimos ambos lados por 3: x = 5. La solución es x = 5."
    }
  ],
  "3": [
    {
      title: "Variables en Ambos Lados",
      content: "A veces las ecuaciones tienen variables en ambos lados. Por ejemplo: 2x + 3 = x + 7. Para resolverlas, necesitamos llevar todas las variables a un lado.",
      narration: "Página uno: Variables en Ambos Lados. A veces las ecuaciones tienen variables en ambos lados. Por ejemplo: 2x + 3 = x + 7. Para resolverlas, necesitamos llevar todas las variables a un lado."
    },
    {
      title: "Estrategia de Solución",
      content: "Restamos x de ambos lados: x + 3 = 7. Luego restamos 3 de ambos lados: x = 4.",
      narration: "Página dos: Estrategia de Solución. Restamos x de ambos lados: x + 3 = 7. Luego restamos 3 de ambos lados: x = 4."
    },
    {
      title: "Respuesta Final",
      content: "La solución es x = 4. Siempre verifica sustituyendo de nuevo en la ecuación original.",
      narration: "Página final: Respuesta Final. La solución es x = 4. Siempre verifica sustituyendo de nuevo en la ecuación original."
    }
  ]
};

const LearnContent = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [narration, setNarration] = useState("");
  const [showEndOptions, setShowEndOptions] = useState(false);

  const pages = levelContent[level || "1"] || levelContent["1"];
  const isLastPage = currentPage === pages.length - 1;

  const endOptions = [
    { label: "Repetir Explicación", narration: "Botón Repetir Explicación." },
    { label: "Elegir Otro Nivel", narration: "Botón Elegir Otro Nivel." },
    { label: "Menú Principal", narration: "Botón Menú Principal." },
  ];

  const { focusedIndex, setItemRef } = useKeyboardNav({
    itemCount: endOptions.length,
    onSelect: (index) => {
      if (index === 0) {
        setCurrentPage(0);
        setShowEndOptions(false);
      } else if (index === 1) {
        navigate("/learn");
      } else {
        navigate("/");
      }
    },
    onNext: !showEndOptions ? () => {
      if (currentPage < pages.length - 1) {
        setCurrentPage(currentPage + 1);
      } else {
        setShowEndOptions(true);
      }
    } : undefined,
    onPrev: !showEndOptions ? () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    } : undefined,
    enabled: true,
  });

  useEffect(() => {
    if (showEndOptions) {
      if (focusedIndex === 0 && narration === "") {
        setNarration("Explicación finalizada. Elige una opción abajo. Botón Repetir Explicación.");
      } else {
        setNarration(endOptions[focusedIndex].narration);
      }
    } else {
      setNarration(pages[currentPage].narration);
    }
  }, [currentPage, showEndOptions, focusedIndex]);

  return (
    <div className="min-h-screen bg-background p-8">
      <Narration text={narration} />
      
      <div className="max-w-4xl mx-auto pt-24">
        {!showEndOptions ? (
          <>
            <div className="border-8 border-foreground bg-card rounded-lg overflow-hidden mb-8">
              {/* Book-like page */}
              <div className="p-12 min-h-[500px] flex flex-col">
                <div className="text-sm text-muted-foreground mb-4">
                  Página {currentPage + 1} de {pages.length}
                </div>
                <h2 className="text-3xl font-bold mb-6 uppercase tracking-wide">
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
              <p className="font-medium mb-2">Controles de Teclado:</p>
              <ul className="space-y-1">
                <li>→ Flecha Derecha - Página siguiente</li>
                <li>← Flecha Izquierda - Página anterior{currentPage === 0 ? " (no disponible en la primera página)" : ""}</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="border-4 border-foreground bg-card p-8 rounded-lg mb-8">
              <h2 className="text-3xl font-bold text-center mb-4 uppercase">
                Explicación Completa
              </h2>
              <p className="text-center text-xl text-muted-foreground">
                Elige una opción abajo
              </p>
            </div>

            <nav className="space-y-4">
              {endOptions.map((option, index) => (
                <NavigableButton
                  key={option.label}
                  ref={setItemRef(index)}
                  focused={focusedIndex === index}
                  onClick={() => {
                    if (index === 0) {
                      setCurrentPage(0);
                      setShowEndOptions(false);
                    } else if (index === 1) {
                      navigate("/learn");
                    } else {
                      navigate("/");
                    }
                  }}
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
