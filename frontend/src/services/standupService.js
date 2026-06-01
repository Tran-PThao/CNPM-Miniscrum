import axios from 'axios';

const API_URL = 'http://localhost:5000/api/standups';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const submitStandup = async (projectId, data) => {
    const response = await axios.post(`${API_URL}/project/${projectId}`, data, getAuthHeaders());
    return response.data;
};

export const getProjectStandups = async (projectId) => {
    const response = await axios.get(`${API_URL}/project/${projectId}`, getAuthHeaders());
    return response.data;
};

export const checkTodayStandup = async (projectId) => {
    const response = await axios.get(`${API_URL}/project/${projectId}/me/today`, getAuthHeaders());
    return response.data;
};
