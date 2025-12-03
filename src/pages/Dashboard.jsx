import { useState } from "react";
import { useLogout } from "../hooks/auth/useLogout";
import CreateTeam from "../components/create/CreateTeam";
import CreatePlayer from "../components/create/CreatePlayer";
import CreateOfficial from "../components/create/CreateOfficial";
import CreateVenue from "../components/create/CreateVenue";
import CreateFormat from "../components/create/CreateFormat";
import DeleteVenue from "../components/delete/DeleteVenue";
import DeletePlayers from "../components/delete/DeletePlayers";
import DeleteTeam from "../components/delete/DeleteTeam";
import DeleteOfficial from "../components/delete/DeleteOfficial";
import DeleteFormat from "../components/delete/DeleteFormat";
import UpdatePlayer from "../components/update/UpdatePlayer";
import UpdateTeam from "../components/update/UpdateTeam";
import UpdateOfficial from "../components/update/UpdateOfficial";
import UpdateVenue from "../components/update/UpdateVenue";
import UpdateMatchType from "../components/update/UpdateMatchType";
import CreateStage from "../components/create/CreateStage";
import DeleteStage from "../components/delete/DeleteStage";
import UpdateStage from "../components/update/UpdateStage";
import CreateTournament from "../components/create/CreateTournament";
import DeleteTournament from "../components/delete/DeleteTournament";
import UpdateTournament from "../components/update/UpdateTournament";

const Dashboard = () => {
  const logoutMutation = useLogout();

  const [openMain, setOpenMain] = useState("add");
  const [openSub, setOpenSub] = useState(null);

  const toggleMain = (section) => {
    setOpenMain(openMain === section ? null : section);
    setOpenSub(null);
  };

  const toggleSub = (id) => {
    setOpenSub(openSub === id ? null : id);
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        console.log("Logged out successfully");
      },
      onError: (error) => {
        console.warn("Logout error", error);
      },
    });
  };

  const addSections = [
    { id: "format", title: "Add New Format", component: <CreateFormat /> },
    {
      id: "official",
      title: "Add New Official",
      component: <CreateOfficial />,
    },
    { id: "player", title: "Add New Player", component: <CreatePlayer /> },
    { id: "stage", title: "Add New Stage", component: <CreateStage /> },
    { id: "team", title: "Add New Team", component: <CreateTeam /> },
    {
      id: "tournament",
      title: "Add New Tournament",
      component: <CreateTournament />,
    },
    { id: "venue", title: "Add New Venue", component: <CreateVenue /> },
  ];

  const deleteSections = [
    {
      id: "deleteFormat",
      title: "Delete a Format",
      component: <DeleteFormat />,
    },
    {
      id: "deleteOfficial",
      title: "Delete an Official",
      component: <DeleteOfficial />,
    },
    {
      id: "deletePlayer",
      title: "Delete a Player",
      component: <DeletePlayers />,
    },
    { id: "deleteStage", title: "Delete a Stage", component: <DeleteStage /> },
    { id: "deleteTeam", title: "Delete a Team", component: <DeleteTeam /> },
    {
      id: "deleteTournament",
      title: "Delete a Tournament",
      component: <DeleteTournament />,
    },
    { id: "deleteVenue", title: "Delete a Venue", component: <DeleteVenue /> },
  ];

  const updateSections = [
    {
      id: "updateMatchType",
      title: "Update a Format",
      component: <UpdateMatchType />,
    },
    {
      id: "updateOfficial",
      title: "Update an Official",
      component: <UpdateOfficial />,
    },
    {
      id: "updatePlayer",
      title: "Update a Player",
      component: <UpdatePlayer />,
    },
    { id: "updateStage", title: "Update a Stage", component: <UpdateStage /> },
    { id: "updateTeam", title: "Update a Team", component: <UpdateTeam /> },
    {
      id: "updateTournament",
      title: "Update a Tournament",
      component: <UpdateTournament />,
    },
    { id: "updateVenue", title: "Update a Venue", component: <UpdateVenue /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-300  text-white font-bold px-6 py-3 rounded-lg transition shadow-md"
          >
            Log Out
          </button>
        </div>

        <div className="space-y-6">
          {/* ADD SECTION */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() => toggleMain("add")}
              className="w-full px-6 py-5 text-left flex justify-between items-center bg-linear-to-r from-green-400 to-green-500 text-white hover:from-green-700 hover:to-green-800 transition cursor-pointer"
            >
              <h2 className="text-2xl font-bold">Add Resources</h2>
              <span className="text-3xl">{openMain === "add" ? "−" : "+"}</span>
            </button>

            <div
              className={`transition-all duration-500 overflow-hidden ${
                openMain === "add" ? "h-auto opacity-100" : "h-0 opacity-0"
              }`}
            >
              <div className="p-4 space-y-3">
                {addSections.map((section) => (
                  <div
                    key={section.id}
                    className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                  >
                    <button
                      onClick={() => toggleSub(section.id)}
                      className="w-full px-5 py-3 text-left flex justify-between items-center hover:bg-gray-100 transition font-medium"
                    >
                      <span className="text-gray-800">{section.title}</span>
                      <span className="text-xl text-gray-600">
                        {openSub === section.id ? "−" : "+"}
                      </span>
                    </button>
                    <div
                      className={`transition-all duration-400 overflow-hidden ${
                        openSub === section.id
                          ? "h-auto opacity-100"
                          : "h-0 opacity-0"
                      }`}
                    >
                      <div className="p-6 bg-white border-t border-gray-200">
                        {section.component}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* UPDATE SECTION */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() => toggleMain("update")}
              className="w-full px-6 py-5 text-left flex justify-between items-center bg-linear-to-r from-yellow-400 to-amber-500 text-white hover:from-yellow-700 hover:to-yellow-800 transition cursor-pointer"
            >
              <h2 className="text-2xl font-bold">Update Resources</h2>
              <span className="text-3xl">
                {openMain === "update" ? "−" : "+"}
              </span>
            </button>

            <div
              className={`transition-all duration-500 overflow-hidden ${
                openMain === "update" ? "h-auto opacity-100" : "h-0 opacity-0"
              }`}
            >
              <div className="p-4 space-y-3">
                {updateSections.map((section) => (
                  <div
                    key={section.id}
                    className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                  >
                    <button
                      onClick={() => toggleSub(section.id)}
                      className="w-full px-5 py-3 text-left flex justify-between items-center hover:bg-gray-100 transition font-medium"
                    >
                      <span className="text-gray-800">{section.title}</span>
                      <span className="text-xl text-gray-600">
                        {openSub === section.id ? "−" : "+"}
                      </span>
                    </button>
                    <div
                      className={`transition-all duration-400 overflow-hidden ${
                        openSub === section.id
                          ? "h-auto opacity-100"
                          : "h-0 opacity-0"
                      }`}
                    >
                      <div className="p-6 bg-white border-t border-gray-200">
                        {section.component}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DELETE SECTION */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() => toggleMain("delete")}
              className="w-full px-6 py-5 text-left flex justify-between items-center bg-linear-to-r from-red-400 to-red-500 text-white hover:from-red-700 hover:to-red-800 transition cursor-pointer"
            >
              <h2 className="text-2xl font-bold">Delete Resources</h2>
              <span className="text-3xl">
                {openMain === "delete" ? "−" : "+"}
              </span>
            </button>

            <div
              className={`transition-all duration-500 overflow-hidden ${
                openMain === "delete" ? "h-auto opacity-100" : "h-0 opacity-0"
              }`}
            >
              <div className="p-4 space-y-3">
                {deleteSections.map((section) => (
                  <div
                    key={section.id}
                    className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                  >
                    <button
                      onClick={() => toggleSub(section.id)}
                      className="w-full px-5 py-3 text-left flex justify-between items-center hover:bg-gray-100 transition font-medium"
                    >
                      <span className="text-gray-800">{section.title}</span>
                      <span className="text-xl text-gray-600">
                        {openSub === section.id ? "−" : "+"}
                      </span>
                    </button>
                    <div
                      className={`transition-all duration-400 overflow-hidden ${
                        openSub === section.id
                          ? "h-auto opacity-100"
                          : "h-0 opacity-0"
                      }`}
                    >
                      <div className="p-6 bg-white border-t border-gray-200">
                        {section.component}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
