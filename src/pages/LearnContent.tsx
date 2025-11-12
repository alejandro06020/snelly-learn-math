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
      title: "What is an Equation?",
      content: "An equation is a mathematical statement that shows two expressions are equal. It uses the equals sign (=) to connect both sides. Think of it as a balance scale - whatever you do to one side, you must do to the other to keep it balanced.",
      narration: "Page one: What is an Equation? An equation is a mathematical statement that shows two expressions are equal. It uses the equals sign to connect both sides. Think of it as a balance scale - whatever you do to one side, you must do to the other to keep it balanced."
    },
    {
      title: "Our Example Equation",
      content: "The equation we will use is: 2x + 5 = 11. Our goal is to find the value of x. To do this, we need to isolate x on one side of the equation.",
      narration: "Page two: Our Example Equation. The equation we will use is 2x + 5 = 11. Our goal is to find the value of x. To do this, we need to isolate x on one side of the equation."
    },
    {
      title: "Step 1: Subtract 5",
      content: "First, we subtract 5 from both sides: 2x + 5 - 5 = 11 - 5. This simplifies to: 2x = 6. Remember, we must do the same operation to both sides to maintain balance.",
      narration: "Page three: Step 1: Subtract 5. First, we subtract 5 from both sides: 2x + 5 - 5 = 11 - 5. This simplifies to: 2x = 6. Remember, we must do the same operation to both sides to maintain balance."
    },
    {
      title: "Step 2: Divide by 2",
      content: "Now we divide both sides by 2: 2x ÷ 2 = 6 ÷ 2. This gives us: x = 3. We have successfully isolated x and found its value!",
      narration: "Page four: Step 2: Divide by 2. Now we divide both sides by 2: 2x ÷ 2 = 6 ÷ 2. This gives us: x = 3. We have successfully isolated x and found its value!"
    },
    {
      title: "Solution",
      content: "The solution is x = 3. You can verify this by substituting 3 back into the original equation: 2(3) + 5 = 11, which equals 6 + 5 = 11. ✓",
      narration: "Final page: Solution. The solution is x = 3. You can verify this by substituting 3 back into the original equation: 2 times 3 plus 5 equals 11, which equals 6 plus 5 equals 11. Correct!"
    }
  ],
  "2": [
    {
      title: "Basic Operations",
      content: "In this level, you'll learn about the four basic operations used to solve equations: addition, subtraction, multiplication, and division. Each operation has an inverse operation that undoes it.",
      narration: "Page one: Basic Operations. In this level, you'll learn about the four basic operations used to solve equations: addition, subtraction, multiplication, and division. Each operation has an inverse operation that undoes it."
    },
    {
      title: "Example Problem",
      content: "Let's solve: 3x - 7 = 8. We need to isolate x by using inverse operations.",
      narration: "Page two: Example Problem. Let's solve: 3x - 7 = 8. We need to isolate x by using inverse operations."
    },
    {
      title: "Solution",
      content: "Add 7 to both sides: 3x = 15. Then divide both sides by 3: x = 5. The solution is x = 5.",
      narration: "Final page: Solution. Add 7 to both sides: 3x = 15. Then divide both sides by 3: x = 5. The solution is x = 5."
    }
  ],
  "3": [
    {
      title: "Variables on Both Sides",
      content: "Sometimes equations have variables on both sides. For example: 2x + 3 = x + 7. To solve these, we need to get all variables on one side.",
      narration: "Page one: Variables on Both Sides. Sometimes equations have variables on both sides. For example: 2x + 3 = x + 7. To solve these, we need to get all variables on one side."
    },
    {
      title: "Solution Strategy",
      content: "Subtract x from both sides: x + 3 = 7. Then subtract 3 from both sides: x = 4.",
      narration: "Page two: Solution Strategy. Subtract x from both sides: x + 3 = 7. Then subtract 3 from both sides: x = 4."
    },
    {
      title: "Final Answer",
      content: "The solution is x = 4. Always verify by substituting back into the original equation.",
      narration: "Final page: Final Answer. The solution is x = 4. Always verify by substituting back into the original equation."
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
    { label: "Repeat Explanation", narration: "Repeat Explanation button." },
    { label: "Choose Another Level", narration: "Choose Another Level button." },
    { label: "Main Menu", narration: "Main Menu button." },
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
        setNarration("Explanation finished. Choose an option below. Repeat Explanation button.");
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
                  Page {currentPage + 1} of {pages.length}
                </div>
                <h2 className="text-3xl font-bold mb-6 uppercase tracking-wide">
                  {pages[currentPage].title}
                </h2>
                <div className="text-xl leading-relaxed flex-1">
                  {pages[currentPage].content}
                </div>
                <div className="flex justify-between items-center mt-8 pt-4 border-t-2 border-border">
                  <div className="text-muted-foreground text-sm">
                    {currentPage > 0 ? "← Previous Page" : " "}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {currentPage < pages.length - 1 ? "Next Page →" : "End of Explanation"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-2 border-border bg-muted rounded text-sm text-muted-foreground">
              <p className="font-medium mb-2">Keyboard Controls:</p>
              <ul className="space-y-1">
                <li>→ Right Arrow - Next page</li>
                <li>← Left Arrow - Previous page{currentPage === 0 ? " (not available on first page)" : ""}</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="border-4 border-foreground bg-card p-8 rounded-lg mb-8">
              <h2 className="text-3xl font-bold text-center mb-4 uppercase">
                Explanation Complete
              </h2>
              <p className="text-center text-xl text-muted-foreground">
                Choose an option below
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
