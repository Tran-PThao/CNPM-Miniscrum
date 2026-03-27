import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.6:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

export const registerUser = (data) => api.post('/register', data);

export const addMemberToProject = (projectId, data) =>
  api.post(`/project/${projectId}/members`, data);

export const getUserStory = (id) => api.get(`/userstory/${id}`);

export default api;
