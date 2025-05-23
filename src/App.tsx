import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import SelfAwarenessVideos from "./pages/SelfAwarenessVideos";
import DigitalDetox from "./pages/DigitalDetox"; // Added import for DigitalDetox page


// Import self-confidence activities (these will be created later)
import FlipTheScriptActivity from "./pages/self-confidence/FlipTheScriptActivity";
import ConfidenceTreeActivity from "./pages/self-confidence/ConfidenceTreeActivity";
import BatteryBoostActivity from "./pages/self-confidence/BatteryBoostActivity";

// Import new dashboard pages
import ClinicianDashboard from "./pages/ClinicianDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./components/UserProfile";
import SharedResponses from "./pages/SharedResponses";
import StudentSharedResponses from "./pages/StudentSharedResponses";
import CheckupsPage from "./pages/CheckupsPage";

// Update document title to correct app name
document.title = "M(in)dvincible";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Student-only route component - ensures only students can access certain pages like mood entry
const StudentRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // If user is not a student (user_type 2), redirect to appropriate dashboard
      if (user.user_type === 0) { // Admin
        navigate('/admin-dashboard');
      } else if (user.user_type === 1) { // Clinician
        navigate('/clinician-dashboard');
      }
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Only allow students (user_type 2) to access
  if (user.user_type !== 2) {
    return null;
  }
  
  return <>{children}</>;
};

// Clinician route component - ensures only clinicians can access certain pages
const ClinicianRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [isClinician, setIsClinician] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkClinicianStatus = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data?.user_type === 1) { // 1 = Clinician
          setIsClinician(true);
        } else {
          navigate('/home');
        }
      } catch (error) {
        console.error('Error checking clinician status:', error);
        navigate('/home');
      } finally {
        setCheckingRole(false);
      }
    };
    
    if (!loading) {
      checkClinicianStatus();
    }
  }, [user, loading, navigate]);
  
  if (loading || checkingRole) {
    return <div>Loading...</div>;
  }
  
  if (!isClinician) {
    return null;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  useEffect(() => {
    // Initialize Supabase integrations
    initSupabase();
  }, []);

  // Fixed the return statement - it was missing before
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/clinician-dashboard" element={
          <ProtectedRoute>
            <ClinicianDashboard />
          </ProtectedRoute>
        } />
        <Route path="/checkups" element={
          <ClinicianRoute>
            <CheckupsPage />
          </ClinicianRoute>
        } />
        <Route path="/shared-responses" element={
          <ClinicianRoute>
            <SharedResponses />
          </ClinicianRoute>
        } />
        <Route path="/shared-responses/:studentId" element={
          <ClinicianRoute>
            <StudentSharedResponses />
          </ClinicianRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/mood-entry" element={
          <StudentRoute>
            <MoodEntry />
          </StudentRoute>
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
        
        {/* Add Digital Detox route */}
        <Route path="/emotional-hacking/digital-detox" element={
          <ProtectedRoute>
            <DigitalDetox />
          </ProtectedRoute>
        } />
        
        <Route path="/self-awareness-videos" element={
          <ProtectedRoute>
            <SelfAwarenessVideos />
          </ProtectedRoute>
        } />
        
        <Route path="/resources" element={
          <ProtectedRoute>
            <ResourcesHub />
          </ProtectedRoute>
        } />
        
        {/* Add Self Confidence activity routes */}
        <Route path="/self-confidence/flip-the-script" element={
          <ProtectedRoute>
            <FlipTheScriptActivity />
          </ProtectedRoute>
        } />
        
        <Route path="/self-confidence/confidence-tree" element={
          <ProtectedRoute>
            <ConfidenceTreeActivity />
          </ProtectedRoute>
        } />
        
        <Route path="/self-confidence/battery-boost" element={
          <ProtectedRoute>
            <BatteryBoostActivity />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
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
