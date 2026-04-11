//frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: `http://${window.location.hostname}:5000/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Thêm interceptor để tự động gắn token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const registerUser = (data) => api.post('/register', data);

export const addMemberToProject = (projectId, data) =>
  api.post(`/project/${projectId}/members`, data);

export const getUserStory = (id) => api.get(`/userstory/${id}`);
export const createUserStory = (data) => api.post('/userstory', data);
export const updateUserStory = (id, data) => api.patch(`/userstory/${id}`, data);
export const deleteUserStory = (id) => api.delete(`/userstory/${id}`);
export const getStoriesByProject = (projectId) => api.get(`/project/${projectId}/userstories`);
export const getMyProjectRole = (projectId) => api.get(`/project/${projectId}/role`);
export const getDashboardStats = (projectId) => api.get(`/project/${projectId}/dashboard`);

// SPRINTS
export const getSprintsByProject = (projectId) => api.get(`/project/${projectId}/sprints`);
export const createSprint = (projectId, data) => api.post(`/project/${projectId}/sprints`, data);
export const updateSprint = (id, data) => api.patch(`/sprint/${id}`, data);
export const getSprintDetails = (id) => api.get(`/sprint/${id}`);

// REORDER
export const reorderStories = (stories) => api.patch('/userstory/reorder', { stories });

// TASKS
export const createStoryTask = (storyId, data) => api.post(`/userstory/${storyId}/tasks`, data);
export const updateTask = (id, data) => api.patch(`/tasks/${id}`, data);
export const assignTaskByEmail = (id, email) => api.patch(`/tasks/${id}/assign`, { email });
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const getStoryTasks = (storyId) => api.get(`/userstory/${storyId}/tasks`);

// COMMENTS
export const getStoryComments = (storyId) => api.get(`/userstory/${storyId}/comments`);
export const createStoryComment = (storyId, content) => api.post(`/userstory/${storyId}/comments`, { content });
// TASK COMMENTS (US-046)
export const getTaskComments = (taskId) => 
  
  api.get(`/tasks/${taskId}/comments`)


export const createTaskComment = (taskId, content, authorId) => 
  
  api.post(`/tasks/${taskId}/comments`, { content, authorId });
// LỜI MỜI
export const getInvitations = () => api.get('/invitations');
export const respondToInvitation = (id, action) => api.post(`/invitations/${id}/respond`, { action });

// MEMBERS
export const getProjectMembers = (projectId) => api.get(`/project/${projectId}/members`);

export default api;
