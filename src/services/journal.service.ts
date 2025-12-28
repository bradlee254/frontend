import axios from "axios";

const API_URL = "http://localhost:5000/api/journals";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export async function createEntry(entry: {
  mood: number;
  activities: string[];
  content: string;
}) {
  return axios.post(API_URL, entry, { headers: getAuthHeaders() });
}

export async function getMyEntries() {
  const res = await axios.get(API_URL, { headers: getAuthHeaders() });
  return res.data;
}
