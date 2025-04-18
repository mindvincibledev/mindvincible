
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MoodEntry from "./pages/MoodEntry";
import MoodJar from "./pages/MoodJar";
import RecentMoodJars from "./pages/RecentMoodJars";
import Journal from "./pages/Journal";
import JournalEntry from "./pages/JournalEntry";
import JournalDetail from "./pages/JournalDetail";
import EmotionalHacking from "./pages/EmotionalHacking";
import EmotionalHackingActivity from "./pages/EmotionalHackingActivity";
import BoxBreathingActivity from "./pages/BoxBreathingActivity"; 
import GroundingTechniqueActivity from "./pages/GroundingTechniqueActivity";
import EmotionalAirbnb from "./pages/EmotionalAirbnb";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { initSupabase } from "./integrations/supabase/initSupabase";
import MoodReminderNotification from "./components/MoodReminderNotification";

// Import activities
import PowerOfHiActivity from "./pages/PowerOfHiActivity";
import MirrorMirrorActivity from "./pages/MirrorMirrorActivity";
import ForkInTheRoadActivity from "./pages/ForkInTheRoadActivity";
import ResourcesHub from "./pages/ResourcesHub";
import AdminDashboard from "./pages/AdminDashboard";
import ClinicianDashboard from "./pages/ClinicianDashboard";

// Update document title to correct app name
document.title = "M(in)dvincible";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC68B3]"></div>
        <p className="mt-4 text-lg">Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  useEffect(() => {
    // Initialize Supabase integrations
    initSupabase();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Role-based dashboard routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/clinician-dashboard" element={
          <ProtectedRoute>
            <ClinicianDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/mood-entry" element={
          <ProtectedRoute>
            <MoodEntry />
          </ProtectedRoute>
        } />
        <Route path="/mood-jar" element={
          <ProtectedRoute>
            <MoodJar />
          </ProtectedRoute>
        } />
        <Route path="/recent-mood-jars" element={
          <ProtectedRoute>
            <RecentMoodJars />
          </ProtectedRoute>
        } />
        <Route path="/journal" element={
          <ProtectedRoute>
            <Journal />
          </ProtectedRoute>
        } />
        <Route path="/journal/new" element={
          <ProtectedRoute>
            <JournalEntry />
          </ProtectedRoute>
        } />
        <Route path="/journal/:id" element={
          <ProtectedRoute>
            <JournalDetail />
          </ProtectedRoute>
        } />
        {/* Add Emotional Hacking routes */}
        <Route path="/emotional-hacking" element={
          <ProtectedRoute>
            <EmotionalHacking />
          </ProtectedRoute>
        } />
        <Route path="/emotional-hacking/:activityId" element={
          <ProtectedRoute>
            <EmotionalHackingActivity />
          </ProtectedRoute>
        } />
        {/* Add dedicated activity routes */}
        <Route path="/emotional-hacking/box-breathing" element={
          <ProtectedRoute>
            <BoxBreathingActivity />
          </ProtectedRoute>
        } />
        <Route path="/emotional-hacking/grounding-technique" element={
          <ProtectedRoute>
            <GroundingTechniqueActivity />
          </ProtectedRoute>
        } />
        {/* Add Mirror Mirror activity route */}
        <Route path="/emotional-hacking/mirror-mirror" element={
          <ProtectedRoute>
            <MirrorMirrorActivity />
          </ProtectedRoute>
        } />
        {/* Emotional Airbnb route */}
        <Route path="/emotional-airbnb" element={
          <ProtectedRoute>
            <EmotionalAirbnb />
          </ProtectedRoute>
        } />
        
        {/* Add Power of Hi route */}
        <Route path="/emotional-hacking/power-of-hi" element={
          <ProtectedRoute>
            <PowerOfHiActivity />
          </ProtectedRoute>
        } />
        
        <Route path="/emotional-hacking/fork-in-the-road" element={
          <ProtectedRoute>
            <ForkInTheRoadActivity />
          </ProtectedRoute>
        } />
        
        <Route path="/resources" element={
          <ProtectedRoute>
            <ResourcesHub />
          </ProtectedRoute>
        } />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Add the mood reminder notification that will appear on all pages */}
      <MoodReminderNotification />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
