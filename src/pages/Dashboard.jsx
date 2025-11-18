import { useState } from "react";
import CreateTeam from "../components/CreateTeam";
import CreatePlayer from "../components/CreatePlayer";
import CreateOfficial from "../components/CreateOfficial";
import CreateVenue from "../components/CreateVenue";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useAuth();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    { id: "player", title: "Add New Player", component: <CreatePlayer /> },
    { id: "team", title: "Add New Team", component: <CreateTeam /> },
    {
      id: "official",
      title: "Add New Official",
      component: <CreateOfficial />,
    },
    { id: "venue", title: "Add New Venue", component: <CreateVenue /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition shadow-md"
          >
            Log Out
          </button>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {section.title}
                </h2>
                <span className="text-2xl text-gray-600">
                  {openSection === section.id ? "−" : "+"}
                </span>
              </button>

              {/* Collapsible Content */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  openSection === section.id
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 border-t border-gray-200">
                  {section.component}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
