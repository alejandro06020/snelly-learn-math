import { useEffect, useRef, useState, useCallback } from "react";

interface UseKeyboardNavProps {
  itemCount: number;
  onSelect: (index: number) => void;
  onBack?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  enabled?: boolean;
  /** 
   * CAMBIO #1: Nueva opción para controlar el comportamiento de Tab
   * - "trap": Tab navega dentro del grupo (comportamiento anterior)
   * - "natural": Tab permite salir del grupo (recomendado para accesibilidad)
   */
  tabBehavior?: "trap" | "natural";
  /**
   * CAMBIO #2: Orientación del grupo para lectores de pantalla
   * - "vertical": Flechas ↑↓ navegan (menús verticales)
   * - "horizontal": Flechas ←→ navegan (tabs, toolbars)
   */
  orientation?: "vertical" | "horizontal";
}

export const useKeyboardNav = ({
  itemCount,
  onSelect,
  onBack,
  onNext,
  onPrev,
  enabled = true,
  tabBehavior = "natural", // CAMBIO #3: Por defecto permite Tab nativo
  orientation = "vertical",
}: UseKeyboardNavProps) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // CAMBIO #4: Helper para navegar al siguiente/anterior elemento
  const navigateNext = useCallback(() => {
    setFocusedIndex((prev) => (prev + 1) % itemCount);
  }, [itemCount]);

  const navigatePrev = useCallback(() => {
    setFocusedIndex((prev) => (prev - 1 + itemCount) % itemCount);
  }, [itemCount]);

  // Handler para sincronizar focusedIndex cuando un botón recibe foco (por Tab u otro medio)
  const handleItemFocus = useCallback((index: number) => {
    setFocusedIndex(index);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // CAMBIO #5: Ignorar eventos si el foco está en inputs/textareas
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          // CAMBIO #6: Solo navegar si orientación es vertical
          if (orientation === "vertical") {
            e.preventDefault();
            navigateNext();
          }
          break;
        case "ArrowUp":
          if (orientation === "vertical") {
            e.preventDefault();
            navigatePrev();
          }
          break;
        case "ArrowRight":
          // CAMBIO #7: Soporte para orientación horizontal
          if (orientation === "horizontal") {
            e.preventDefault();
            navigateNext();
          } else if (onNext) {
            e.preventDefault();
            onNext();
          }
          break;
        case "ArrowLeft":
          if (orientation === "horizontal") {
            e.preventDefault();
            navigatePrev();
          } else if (onPrev) {
            e.preventDefault();
            onPrev();
          }
          break;
        case "Tab":
          // CAMBIO #8: Tab ahora respeta el comportamiento configurado
          if (tabBehavior === "trap") {
            // Comportamiento anterior: Tab navega dentro del grupo
            if (e.shiftKey) {
              e.preventDefault();
              navigatePrev();
            } else {
              e.preventDefault();
              navigateNext();
            }
          }
          // Si tabBehavior === "natural", NO hacemos preventDefault()
          // Esto permite que Tab salga del grupo de botones normalmente
          break;
        case "Enter":
        case " ": // CAMBIO #9: Espacio también activa (estándar ARIA)
          // Solo activar si el foco está en uno de los elementos del menú
          const isMenuItemFocused = itemRefs.current.some(
            (ref) => ref && ref === document.activeElement
          );
          if (isMenuItemFocused) {
            e.preventDefault();
            onSelect(focusedIndex);
          }
          break;
        case "Escape":
          if (onBack) {
            e.preventDefault();
            onBack();
          }
          break;
        case "Home": // CAMBIO #10: Home va al primer elemento (estándar ARIA)
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case "End": // CAMBIO #11: End va al último elemento (estándar ARIA)
          e.preventDefault();
          setFocusedIndex(itemCount - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, focusedIndex, itemCount, onSelect, onBack, onNext, onPrev, tabBehavior, orientation, navigateNext, navigatePrev]);

  useEffect(() => {
    if (itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  const setItemRef = (index: number) => (el: HTMLButtonElement | null) => {
    itemRefs.current[index] = el;
  };

  // Todos los elementos tienen tabIndex=0 para permitir navegación con Tab
  // El estilo visual de "focused" se controla por separado
  const getTabIndex = useCallback((_index: number): 0 => {
    return 0;
  }, []);

  // CAMBIO #13: Props ARIA para el contenedor del grupo
  const getContainerProps = useCallback(() => ({
    role: "menu" as const,
    "aria-orientation": orientation,
  }), [orientation]);

  // CAMBIO #14: Props ARIA para cada elemento del grupo
  const getItemProps = useCallback((index: number) => ({
    role: "menuitem" as const,
    tabIndex: getTabIndex(index),
    "aria-current": index === focusedIndex ? ("true" as const) : undefined,
  }), [focusedIndex, getTabIndex]);

  return { 
    focusedIndex, 
    setItemRef, 
    setFocusedIndex,
    // Nuevas utilidades exportadas
    getTabIndex,
    getContainerProps,
    getItemProps,
    navigateNext,
    navigatePrev,
    handleItemFocus, // Para sincronizar focusedIndex cuando un botón recibe foco
  };
};
