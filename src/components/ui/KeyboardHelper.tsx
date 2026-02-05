import { Keyboard } from "lucide-react";

export interface KeyControl {
  keys: string[];
  action: string;
}

interface KeyboardHelperProps {
  controls: KeyControl[];
  compact?: boolean;
}

const KeyboardHelper = ({ controls, compact = false }: KeyboardHelperProps) => {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground" role="region" aria-label="Atajos de teclado">
        {controls.map((control, index) => (
          <span key={index} className="flex items-center gap-1.5 whitespace-nowrap">
            {control.keys.map((key, keyIndex) => (
              <span key={keyIndex} className="flex items-center">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  {key}
                </kbd>
                {keyIndex < control.keys.length - 1 && <span className="mx-1">o</span>}
              </span>
            ))}
            <span>{control.action}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <aside className="controls-helper mt-8 rounded-lg border bg-card p-4 shadow-sm" aria-label="Guía de controles de teclado">
      <div className="flex items-center justify-between mb-3">
        <h2 tabIndex={0} className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-primary" aria-hidden="true" />
          Controles de Teclado
        </h2>
      </div>
      <ul className="space-y-2" role="list">
        {controls.map((control, index) => (
          <li key={index} className="flex items-center justify-between text-sm group hover:bg-muted/50 p-1.5 rounded transition-colors">
            <span tabIndex={0} className="text-muted-foreground">{control.action}</span>
            <span className="flex items-center gap-1">
              {control.keys.map((key, keyIndex) => (
                <span key={keyIndex} className="flex items-center">
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 min-w-[20px] justify-center">
                    {key}
                  </kbd>
                  {keyIndex < control.keys.length - 1 && <span className="mx-1 text-muted-foreground text-xs">o</span>}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default KeyboardHelper;