
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import UserDetail from "./pages/UserDetail";
import Benefits from "./pages/Benefits";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import WhatsAppButton from "./components/WhatsAppButton";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import ScrollToTop from "./components/ScrollToTop";
import UserDebts from "./pages/UserDebts";

const queryClient = new QueryClient();

const App = () => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <ScrollToTop />
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/user/:userId" element={<UserDetail />} />
                <Route path="/admin/user/:id/debts" element={<UserDebts />} />
                <Route path="/beneficios" element={<Benefits />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="/privacidade" element={<Privacy />} />
                <Route path="/termos" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <WhatsAppButton />
              <PWAInstallPrompt />
            </div>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
);


export default App;
