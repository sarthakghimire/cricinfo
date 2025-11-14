import axios from "./axiosConfig";

// Tournaments
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

// Matches
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

// Teams
export const createTeam = async (data) => {
  try {
    const response = await axios.post("/teams", data);
    return response.data;
  } catch (error) {
    console.error("CreateTeam Error:", error.response?.data || error.message);
    throw error;
  }
};

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

// Players
export const createPlayer = async (data) => {
  try {
    const response = await axios.post("/players", data);
    return response.data;
  } catch (error) {
    console.error("CreatePlayer Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getPlayers = async () => {
  try {
    const response = await axios.get("/players");
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

//Umpires
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

//Venues
export const getVenues = async () => {
  try {
    const response = await axios.get("/venues");
    return response.data;
  } catch (error) {
    console.error("Error: ", error.response?.data || error.message);
    throw error;
  }
};
//Add venues post method

//Add match types (ODI/Test....)
export const getMatchType = async () => {
  try {
    const response = await axios.get("/match-types");
    return response.data;
  } catch (error) {
    console.error("Error: ", error.response?.data || error.message);
    throw error;
  }
};
//Fetch Match by ID
export const getMatchTypeById = async (id) => {
  try {
    const response = await axios.get(`/match-types/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error: ", error.response?.data || error.message);
    throw error;
  }
};
//Fetch Stage Details
export const getStagesById = async (id) => {
  try {
    const response = await axios.get(`/stages/tournaments/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error: ", error.response?.data || error.message);
    throw error;
  }
};

//Auth
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

export const getMe = async () => {
  try {
    const response = await axios.get("/auth/me");
    return response.data;
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
