import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { SettingsProvider } from './contexts/SettingsContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Measurements from './pages/Measurements';
import Workouts from './pages/Workouts';
import AICoach from './pages/AICoach';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <SettingsProvider>
        <UserProvider>
          <div className="min-h-screen bg-gradient-dark">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/measurements" element={<Measurements />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/ai-coach" element={<AICoach />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </UserProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;
