import CreateTeam from "../components/CreateTeam";
import CreatePlayer from "../components/CreatePlayer";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div>
      <div className="p-4">
        <h1 className="text-lg font-bold mb-4">Admin Dashboard</h1>
        <CreatePlayer />
        <CreateTeam />
        <div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2  transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
