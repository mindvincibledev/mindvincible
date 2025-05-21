
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoodEntry from './pages/MoodEntry';
import Journal from './pages/Journal';
import MoodJar from './pages/MoodJar';
import Dashboard from './pages/Dashboard';
import ResourcesHub from './pages/ResourcesHub';
import AdminDashboard from './pages/AdminDashboard';
import ClinicianDashboard from './pages/ClinicianDashboard';
import RecentMoodJars from './pages/RecentMoodJars';
import EmotionalAirbnb from './pages/EmotionalAirbnb';
import EmotionalHacking from './pages/EmotionalHacking';
import PowerOfHiActivity from './pages/PowerOfHiActivity';
import MirrorMirrorActivity from './pages/MirrorMirrorActivity';
import ForkInTheRoadActivity from './pages/ForkInTheRoadActivity';
import DigitalDetox from './components/emotional-hacking/DigitalDetox';
import FlipTheScriptActivity from './pages/self-confidence/FlipTheScriptActivity';
import ConfidenceTreeActivity from './pages/self-confidence/ConfidenceTreeActivity';
import BatteryBoostActivity from './pages/self-confidence/BatteryBoostActivity';
import GroundingTechniqueActivity from './pages/GroundingTechniqueActivity';
import BoxBreathingActivity from './pages/BoxBreathingActivity';
import SelfAwarenessVideos from "./pages/SelfAwarenessVideos";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mood-entry" element={<MoodEntry />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/mood-jar" element={<MoodJar />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resources" element={<ResourcesHub />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/clinician-dashboard" element={<ClinicianDashboard />} />
          <Route path="/recent-mood-jars" element={<RecentMoodJars />} />
          <Route path="/emotional-airbnb" element={<EmotionalAirbnb />} />
          <Route path="/emotional-hacking" element={<EmotionalHacking />} />
          <Route path="/emotional-hacking/power-of-hi" element={<PowerOfHiActivity />} />
          <Route path="/emotional-hacking/mirror-mirror" element={<MirrorMirrorActivity />} />
          <Route path="/emotional-hacking/fork-in-the-road" element={<ForkInTheRoadActivity />} />
          <Route path="/emotional-hacking/digital-detox" element={<DigitalDetox />} />
          <Route path="/self-confidence/flip-the-script" element={<FlipTheScriptActivity />} />
          <Route path="/self-confidence/confidence-tree" element={<ConfidenceTreeActivity />} />
          <Route path="/self-confidence/battery-boost" element={<BatteryBoostActivity />} />
          <Route path="/emotional-hacking/grounding-technique" element={<GroundingTechniqueActivity />} />
          <Route path="/emotional-hacking/box-breathing" element={<BoxBreathingActivity />} />
          <Route path="/self-awareness-videos" element={<SelfAwarenessVideos />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
