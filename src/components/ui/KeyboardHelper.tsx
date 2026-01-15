interface KeyControl {
  keys: string[];
  action: string;
}

interface KeyboardHelperProps {
  controls: KeyControl[];
  compact?: boolean;
}

/**
 * KeyboardHelper - Contextual keyboard controls guide
 * Implements Nielsen's Heuristic #10: Help and documentation
 */
const KeyboardHelper = ({ controls, compact = false }: KeyboardHelperProps) => {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        {controls.map((control, index) => (
          <span key={index} className="flex items-center gap-1.5">
            {control.keys.map((key, keyIndex) => (
              <span key={keyIndex}>
                <kbd>{key}</kbd>
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
    <aside 
      className="controls-helper mt-8"
      aria-label="Guía de controles de teclado"
    >
      <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <span className="w-5 h-5 flex items-center justify-center bg-primary/10 rounded text-primary text-xs">⌨</span>
        Controles de Teclado
      </h2>
      <ul className="space-y-2">
        {controls.map((control, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1">
              {control.keys.map((key, keyIndex) => (
                <span key={keyIndex} className="flex items-center">
                  <kbd>{key}</kbd>
                  {keyIndex < control.keys.length - 1 && (
                    <span className="mx-1 text-muted-foreground">o</span>
                  )}
                </span>
              ))}
            </span>
            <span className="text-muted-foreground">{control.action}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default KeyboardHelper;
