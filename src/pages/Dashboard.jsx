import { useState } from "react";
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
import { useAuth } from "../context/AuthContext";
import UpdatePlayer from "../components/update/UpdatePlayer";
import UpdateTeam from "../components/update/UpdateTeam";
import UpdateOfficial from "../components/update/UpdateOfficial";
import UpdateVenue from "../components/update/UpdateVenue";
import UpdateFormat from "../components/update/UpdateFormat";

const Dashboard = () => {
  const { logout } = useAuth();
  const [openMain, setOpenMain] = useState("add");
  const [openSub, setOpenSub] = useState(null);

  const toggleMain = (section) => {
    setOpenMain(openMain === section ? null : section);
    setOpenSub(null);
  };

  const toggleSub = (id) => {
    setOpenSub(openSub === id ? null : id);
  };

  const addSections = [
    { id: "player", title: "Add New Player", component: <CreatePlayer /> },
    { id: "team", title: "Add New Team", component: <CreateTeam /> },
    {
      id: "official",
      title: "Add New Official",
      component: <CreateOfficial />,
    },
    { id: "venue", title: "Add New Venue", component: <CreateVenue /> },
    { id: "format", title: "Add New Format", component: <CreateFormat /> },
  ];

  const deleteSections = [
    {
      id: "deletePlayer",
      title: "Delete a Player",
      component: <DeletePlayers />,
    },
    { id: "deleteTeam", title: "Delete a Team", component: <DeleteTeam /> },
    {
      id: "deleteOfficial",
      title: "Delete an Official",
      component: <DeleteOfficial />,
    },
    { id: "deleteVenue", title: "Delete a Venue", component: <DeleteVenue /> },
    {
      id: "deleteFormat",
      title: "Delete a Format",
      component: <DeleteFormat />,
    },
  ];

  const updateSections = [
    {
      id: "updatePlayer",
      title: "Update a Player",
      component: <UpdatePlayer />,
    },
    { id: "updateTeam", title: "Update a Team", component: <UpdateTeam /> },
    {
      id: "updateOfficial",
      title: "Update an Official",
      component: <UpdateOfficial />,
    },
    { id: "updateVenue", title: "Update a Venue", component: <UpdateVenue /> },
    {
      id: "updateFormat",
      title: "Update a Format",
      component: <UpdateFormat />,
    },
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
