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
