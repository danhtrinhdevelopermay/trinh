import { Switch, Route, useLocation } from "wouter";
import { queryClient, setAuthFailureHandler } from "./lib/queryClient";
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
import LoginForm from "@/components/LoginForm";

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Register authentication failure handler
    setAuthFailureHandler(() => {
      setIsAuthenticated(false);
      // Clear any query cache to prevent stale data
      queryClient.clear();
    });

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <LoginForm onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Show main app if authenticated
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
