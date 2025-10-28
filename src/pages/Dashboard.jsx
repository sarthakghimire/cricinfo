import Header from "../components/Header";
import CreateTeam from "../components/CreateTeam";
import CreatePlayer from "../components/CreatePlayer";

const Dashboard = () => {
  return (
    <div>
      <Header />
      <div className="p-4">
        <h1 className="text-lg font-bold mb-4">Admin Dashboard</h1>
        <CreatePlayer />
        <CreateTeam />
      </div>
    </div>
  );
};

export default Dashboard;
