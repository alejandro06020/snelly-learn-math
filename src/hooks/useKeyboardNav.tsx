import { useEffect, useRef, useState } from "react";

interface UseKeyboardNavProps {
  itemCount: number;
  onSelect: (index: number) => void;
  onBack?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  enabled?: boolean;
}

export const useKeyboardNav = ({
  itemCount,
  onSelect,
  onBack,
  onNext,
  onPrev,
  enabled = true,
}: UseKeyboardNavProps) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % itemCount);
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + itemCount) % itemCount);
          break;
        case "Tab":
          if (e.shiftKey) {
            e.preventDefault();
            setFocusedIndex((prev) => (prev - 1 + itemCount) % itemCount);
          } else {
            e.preventDefault();
            setFocusedIndex((prev) => (prev + 1) % itemCount);
          }
          break;
        case "Enter":
          e.preventDefault();
          onSelect(focusedIndex);
          break;
        case "Escape":
          if (onBack) {
            e.preventDefault();
            onBack();
          }
          break;
        case "ArrowRight":
          if (onNext) {
            e.preventDefault();
            onNext();
          }
          break;
        case "ArrowLeft":
          if (onPrev) {
            e.preventDefault();
            onPrev();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, focusedIndex, itemCount, onSelect, onBack, onNext, onPrev]);

  useEffect(() => {
    if (itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  const setItemRef = (index: number) => (el: HTMLButtonElement | null) => {
    itemRefs.current[index] = el;
  };

  return { focusedIndex, setItemRef, setFocusedIndex };
};
