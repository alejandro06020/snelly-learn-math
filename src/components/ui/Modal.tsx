import { ReactNode, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  variant?: "default" | "warning" | "success";
  showCloseButton?: boolean;
}

/**
 * Modal - Accessible dialog component
 * Implements:
 * - Heuristic #3: User control and freedom (close button, escape key)
 * - Heuristic #9: Help users recognize errors (warning variant)
 * - WCAG 2.4.3: Focus trap dentro del modal
 */
const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  variant = "default",
  showCloseButton = true,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap: mantener el foco dentro del modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && onClose) {
      onClose();
      return;
    }

    if (e.key !== "Tab" || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (open) {
      // Guardar el elemento enfocado antes de abrir
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
      
      // Enfocar el primer elemento focusable del modal
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      
      // Restaurar el foco al elemento anterior
      previousActiveElement.current?.focus();
    }
    
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const variantStyles = {
    default: "border-primary/20",
    warning: "border-destructive/50",
    success: "border-success/50",
  };

  const titleStyles = {
    default: "text-gradient",
    warning: "text-destructive",
    success: "text-success",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-lg bg-card rounded-2xl border-2 ${variantStyles[variant]} shadow-2xl animate-scale-in`}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="modal-title"
              tabIndex={0}
              className={`text-2xl font-bold ${titleStyles[variant]}`}
            >
              {title}
            </h2>
            {showCloseButton && onClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {description && (
            <p
              id="modal-description"
              tabIndex={0}
              className="text-muted-foreground mt-2"
            >
              {description}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
