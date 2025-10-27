import axios from "./axiosConfig";

// Tournaments
export const getTournaments = async () => {
  const response = await axios.get("/tournaments");
  return response.data;
};

export const getTournamentById = async (id) => {
  const response = await axios.get(`/tournaments/${id}`);
  return response.data;
};

export const createTournament = async (data) => {
  const response = await axios.post("/tournaments", data);
  return response.data;
};

export const updateTournament = async ({ id, data }) => {
  const response = await axios.patch(`/tournaments/${id}`, data);
  return response.data;
};

export const deleteTournament = async (id) => {
  const response = await axios.delete(`/tournaments/${id}`);
  return response.data;
};

// Matches
export const getMatches = async () => {
  const response = await axios.get("/matches");
  return response.data;
};

export const getMatchById = async (id) => {
  const response = await axios.get(`/matches/${id}`);
  return response.data;
};

export const createMatch = async (data) => {
  const response = await axios.post("/matches", data);
  return response.data;
};
