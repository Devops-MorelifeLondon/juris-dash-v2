
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cases from "./pages/Cases";
import Services from "./pages/Services";
import Compliance from "./pages/Compliance";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import ParalegalDashboard from "./pages/MyParalegals";
import ProfilePage from "./pages/Profile";
import AuthPage from "./pages/AuthPage";
import { SectionTrain } from "./pages/Training";
import { Toaster, toast } from "sonner";
import TaskManagementPage from "./pages/TaskManagementPage";
import SingleTaskPage from "./pages/SingleTaskManagement";
import ForgotPasswordPage from "./pages/ForgetPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import AttorneyChat from "./pages/Chat";






const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
<Toaster  position="top-right" />
 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<AttorneyChat />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/tasks" element={<TaskManagementPage />} />
          <Route path="/task/:taskId" element={<SingleTaskPage />} />
          <Route path="/training" element={<SectionTrain />} />
          <Route path="/services" element={<Services />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/myparalegals" element={<ParalegalDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password/:token" element={<ResetPasswordPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
