import Header from "../components/Header";
import CreateTeam from "../components/CreateTeam";
import CreatePlayer from "../components/CreatePlayer";
import Footer from "../components/Footer";

const Dashboard = () => {
  return (
    <div>
      <Header />
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
