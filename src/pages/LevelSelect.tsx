import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Narration from "@/components/Narration";
import Snelly from "@/components/Snelly";
import NavigableButton from "@/components/NavigableButton";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";

const LevelSelect = () => {
  const navigate = useNavigate();
  const [narration, setNarration] = useState("");

  const levels = [
    { 
      label: "Level 1: Introduction", 
      route: "/learn/level/1",
      narration: "Level 1: Introduction. button."
    },
    { 
      label: "Level 2: Basic Operations", 
      route: "/learn/level/2",
      narration: "Level 2: Basic Operations. button."
    },
    { 
      label: "Level 3: Variables on Both Sides", 
      route: "/learn/level/3",
      narration: "Level 3: Variables on Both Sides. button."
    },
    { 
      label: "Back to Main Menu", 
      route: "/",
      narration: "Back to Main Menu. button."
    },
  ];

  const { focusedIndex, setItemRef } = useKeyboardNav({
    itemCount: levels.length,
    onSelect: (index) => {
      navigate(levels[index].route);
    },
  });

  useEffect(() => {
    if (focusedIndex === 0 && narration === "") {
      setNarration("Choose Your Level. Level 1: Introduction. button.");
    } else {
      setNarration(levels[focusedIndex].narration);
    }
  }, [focusedIndex]);

  return (
    <div className="min-h-screen bg-background p-8">
      <Narration text={narration} />
      <Snelly />
      
      <div className="max-w-2xl mx-auto pt-24">
        <div className="border-4 border-foreground bg-card p-8 rounded-lg mb-8">
          <h1 className="text-4xl font-bold text-center uppercase tracking-wider">
            Choose Your Level
          </h1>
        </div>

        <nav className="space-y-4" role="navigation" aria-label="Level selection">
          {levels.map((level, index) => (
            <NavigableButton
              key={level.label}
              ref={setItemRef(index)}
              focused={focusedIndex === index}
              onClick={() => navigate(level.route)}
            >
              {level.label}
            </NavigableButton>
          ))}
        </nav>

        <div className="mt-8 p-4 border-2 border-border bg-muted rounded text-sm text-muted-foreground">
          <p className="font-medium mb-2">Keyboard Controls:</p>
          <ul className="space-y-1">
            <li>↑↓ Arrow Keys or Tab - Navigate options</li>
            <li>Enter - Select level</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;
