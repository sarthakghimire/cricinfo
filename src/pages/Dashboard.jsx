import CreateTeam from "../components/CreateTeam";
import CreatePlayer from "../components/CreatePlayer";

const Dashboard = () => {
  return (
    <div>
      <div className="p-4">
        <h1 className="text-lg font-bold mb-4">Admin Dashboard</h1>
        <CreatePlayer />
        <CreateTeam />
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Dashboard;
