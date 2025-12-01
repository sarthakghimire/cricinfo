import axios from "./axiosConfig";
// ================================================================
// AUTH ENDPOINTS
// ================================================================
export const registerUser = async (data) => {
  try {
    const response = await axios.post("/auth/register", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed"
    );
  }
};
export const logoutUser = async () => {
  try {
    await axios.post("/auth/logout");
  } catch (error) {
    console.warn("Logout API failed:", error.message);
  }
};
// ================================================================
// TEAMS
// ================================================================
export const createTeam = async (data) => {
  try {
    const response = await axios.post("/teams", data);
    return response.data;
  } catch (error) {
    console.error("CreateTeam Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateTeam = async (teamId, updates) => {
  try {
    if (!teamId) throw new Error("Team ID is required");

    const response = await axios.patch(`/teams/${teamId}`, updates, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Update Team Error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteTeam = async (id) => {
  const response = await axios.delete(`/teams/${id}`);
  return response.data;
  alert("Team deleted");
};

// ================================================================
// PLAYERS
// ================================================================
export const createPlayer = async (data) => {
  try {
    const response = await axios.post("/players", data);
    return response.data;
  } catch (error) {
    console.error("CreatePlayer Error:", error.response?.data || error.message);
    throw error;
  }
};

export const deletePlayer = async (id) => {
  const response = await axios.delete(`/players/${id}`);
  return response.data;
  alert("Player deleted");
};

export const updatePlayer = async (id, data) => {
  const response = await axios.patch(`/players/${id}`, data);
  return response.data;
};

// ================================================================
// OFFICIALS / UMPIRES
// ================================================================
export const createOfficial = async (data) => {
  try {
    const response = await axios.post("/officials", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create official" };
  }
};

export const deleteOfficial = async (id) => {
  const response = await axios.delete(`/officials/${id}`);
  return response.data;
  alert("Official deleted");
};

// ================================================================
// VENUES
// ================================================================
export const createVenue = async (data) => {
  const response = await axios.post("/venues", data);
  return response.data;
};

export const deleteVenue = async (id) => {
  const response = await axios.delete(`/venues/${id}`);
  return response.data;
  alert("Venue deleted");
};

// ================================================================
// MATCH FORMATS / TYPES
// ================================================================
export const addFormat = async (data) => {
  const response = await axios.post("/match-types", data);
};

export const deleteFormat = async (id) => {
  const response = await axios.delete(`/match-types/${id}`);
  return response.data;
  alert("Format deleted");
};

// ================================================================
// LIVE SCORING / DELIVERIES
// ================================================================
