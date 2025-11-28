import axios from "./axiosConfig";

// ================================================================
// AUTH ENDPOINTS
// ================================================================
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed"
    );
  }
};

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

export const getMe = async () => {
  try {
    const response = await axios.get("/auth/me");
    return response.data.user;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch user";
    throw new Error(message);
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
// TOURNAMENTS
// ================================================================
export const getTournaments = async () => {
  try {
    const response = await axios.get("/tournaments");
    return response.data;
  } catch (error) {
    console.error(
      "GetTournaments Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getTournamentById = async (id) => {
  try {
    const response = await axios.get(`/tournaments/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "GetTournamentById Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createTournament = async (data) => {
  try {
    const response = await axios.post("/tournaments", data);
    return response.data;
  } catch (error) {
    console.error(
      "CreateTournament Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateTournament = async ({ id, data }) => {
  try {
    const response = await axios.patch(`/tournaments/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(
      "UpdateTournament Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteTournament = async (id) => {
  try {
    const response = await axios.delete(`/tournaments/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "DeleteTournament Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ================================================================
// MATCHES
// ================================================================
export const getMatches = async () => {
  try {
    const response = await axios.get("/matches");
    return response.data;
  } catch (error) {
    console.error("GetMatches Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getMatchById = async (id) => {
  try {
    const response = await axios.get(`/matches/${id}`);
    return response.data;
  } catch (error) {
    console.error("GetMatchById Error:", error.response?.data || error.message);
    throw error;
  }
};

export const createMatch = async (data) => {
  try {
    const response = await axios.post("/matches", data);
    return response.data;
  } catch (error) {
    console.error("CreateMatch Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getStagesById = async (id) => {
  try {
    const response = await axios.get(`/stages/tournaments/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error: ", error.response?.data || error.message);
    throw error;
  }
};

// ================================================================
// TEAMS
// ================================================================
export const getTeams = async () => {
  try {
    const response = await axios.get("/teams");
    return response.data;
  } catch (error) {
    console.error("GetTeams Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getTeamById = async (id) => {
  try {
    const response = await axios.get(`/teams/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("GetTeam Error:", error.response?.data || error.message);
    throw error;
  }
};

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
export const getPlayers = async (page = 1, limit = 100) => {
  try {
    const response = await axios.get(`/players?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("GetPlayers Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getPlayerById = async (id) => {
  try {
    const response = await axios.get(`/players/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("GetPlayers Error:", error.response?.data || error.message);
    throw error;
  }
};

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
export const getOfficials = async () => {
  try {
    const response = await axios.get("/officials");
    return response.data;
  } catch (error) {
    console.error("Error: ", error.response?.data || error.message);
    throw error;
  }
};

export const getOfficialById = async (id) => {
  try {
    const response = await axios.get(`/officials/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
};

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
export const getVenues = async () => {
  try {
    const response = await axios.get("/venues");
    return response.data;
  } catch (error) {
    console.error("Error: ", error.response?.data || error.message);
    throw error;
  }
};

export const getVenueById = async (id) => {
  try {
    const response = await axios.get(`/venues/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error: ", error.response?.data || error.message);
    throw error;
  }
};

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
export const getFormats = async () => {
  try {
    const response = await axios.get("/match-types");
    return response.data;
  } catch (error) {
    console.error("Error: ", error.response?.data || error.message);
    throw error;
  }
};

export const getMatchType = async () => {
  try {
    const response = await axios.get("/match-types");
    return response.data;
  } catch (error) {
    console.error("Error: ", error.response?.data || error.message);
    throw error;
  }
};

export const getMatchTypeById = async (id) => {
  try {
    const response = await axios.get(`/match-types/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error: ", error.response?.data || error.message);
    throw error;
  }
};

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
export const getDeliveries = async () => {
  try {
    const response = await axios.get("/deliveries");
    return response.data;
  } catch (error) {
    console.error("Error: ", error.response?.data || error.message);
    throw error;
  }
};
