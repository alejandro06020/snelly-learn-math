import { ReactNode, useEffect } from "react";
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
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
