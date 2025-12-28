import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/route/ProtectedRoute";
import PlayerDetail from "./pages/PlayerDetail";
import TeamDetail from "./pages/TeamDetail";
import OfficialInfo from "./pages/OfficialInfo";
import TournamentInfo from "./pages/TournamentInfo";
import MatchInfo from "./pages/MatchInfo";
import TournamentStages from "./pages/TournamentStages";
import Matches from "./pages/Matches";
import MatchScore from "./pages/MatchScore";
import Footer from "./components/ui/Footer";
import Header from "./components/ui/Header";
import Register from "./pages/Register";
import VenuePage from "./pages/VenuePage";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/matches/:id" element={<MatchScore />} />
        <Route path="/stages/tournaments/:id" element={<TournamentStages />} />
        <Route path="/tournaments/:id" element={<TournamentInfo />} />
        <Route path="/match-info/:id" element={<MatchInfo />} />
        <Route path="/officials/:id" element={<OfficialInfo />} />
        <Route path="/players/:id" element={<PlayerDetail />} />
        <Route path="/teams/:id" element={<TeamDetail />} />
        <Route path="/venues/:id" element={<VenuePage />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
