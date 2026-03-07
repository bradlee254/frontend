import api from '../lib/api';

export const getInsights = async () => {
  const res = await api.get("/ai/insights");
  return res.data;
};