import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainMenu from "./pages/MainMenu";
import LevelSelect from "./pages/LevelSelect";
import LearnContent from "./pages/LearnContent";
import Exercise from "./pages/Exercise";
import ExerciseComplete from "./pages/ExerciseComplete";
import Options from "./pages/Options";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/learn" element={<LevelSelect />} />
          <Route path="/learn/level/:level" element={<LearnContent />} />
          <Route path="/exercises" element={<Exercise />} />
          <Route path="/exercise-complete" element={<ExerciseComplete />} />
          <Route path="/options" element={<Options />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
