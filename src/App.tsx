import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoodEntryPage from './pages/MoodEntryPage';
import JournalPage from './pages/JournalPage';
import MoodJarPage from './pages/MoodJarPage';
import DashboardPage from './pages/DashboardPage';
import ResourcesHub from './pages/ResourcesHub';
import AdminDashboard from './pages/AdminDashboard';
import ClinicianDashboard from './pages/ClinicianDashboard';
import RecentMoodJars from './pages/RecentMoodJars';
import EmotionalAirbnb from './pages/EmotionalAirbnb';
import EmotionalHacking from './pages/EmotionalHacking';
import PowerOfHi from './components/emotional-hacking/PowerOfHi';
import MirrorMirror from './components/emotional-hacking/MirrorMirror';
import ForkInTheRoad from './components/emotional-hacking/ForkInTheRoad';
import DigitalDetox from './components/emotional-hacking/DigitalDetox';
import FlipTheScript from './components/self-confidence/FlipTheScript';
import ConfidenceTree from './components/self-confidence/ConfidenceTree';
import BatteryBoost from './pages/BatteryBoost';
import GroundingTechnique from './components/emotional-hacking/GroundingTechnique';
import BoxBreathing from './components/emotional-hacking/BoxBreathing';
import SelfAwarenessVideos from "./pages/SelfAwarenessVideos";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mood-entry" element={<MoodEntryPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/mood-jar" element={<MoodJarPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/resources" element={<ResourcesHub />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/clinician-dashboard" element={<ClinicianDashboard />} />
          <Route path="/recent-mood-jars" element={<RecentMoodJars />} />
          <Route path="/emotional-airbnb" element={<EmotionalAirbnb />} />
          <Route path="/emotional-hacking" element={<EmotionalHacking />} />
          <Route path="/emotional-hacking/power-of-hi" element={<PowerOfHi />} />
          <Route path="/emotional-hacking/mirror-mirror" element={<MirrorMirror />} />
          <Route path="/emotional-hacking/fork-in-the-road" element={<ForkInTheRoad />} />
          <Route path="/emotional-hacking/digital-detox" element={<DigitalDetox />} />
          <Route path="/self-confidence/flip-the-script" element={<FlipTheScript />} />
          <Route path="/self-confidence/confidence-tree" element={<ConfidenceTree />} />
          <Route path="/self-confidence/battery-boost" element={<BatteryBoost />} />
          <Route path="/emotional-hacking/grounding-technique" element={<GroundingTechnique />} />
          <Route path="/emotional-hacking/box-breathing" element={<BoxBreathing />} />
          <Route path="/self-awareness-videos" element={<SelfAwarenessVideos />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
