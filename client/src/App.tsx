import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AudioProvider } from "@/contexts/AudioContext";
import { AnimatedRoute, getRandomTransition } from "@/components/PageTransition";
import { useState, useEffect } from "react";
import Home from "@/pages/Home";
import ManagePresentations from "@/pages/ManagePresentations";
import ManageSlides from "@/pages/ManageSlides";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const [currentTransition, setCurrentTransition] = useState(() => getRandomTransition());
  
  // Chọn hiệu ứng ngẫu nhiên mỗi khi route thay đổi
  useEffect(() => {
    setCurrentTransition(getRandomTransition());
  }, [location]);

  return (
    <AnimatedRoute routeKey={location} transitionType={currentTransition as any}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/manage" component={ManagePresentations} />
        <Route path="/manage/:id" component={ManageSlides} />
        <Route component={NotFound} />
      </Switch>
    </AnimatedRoute>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AudioProvider>
          <Toaster />
          <Router />
        </AudioProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
