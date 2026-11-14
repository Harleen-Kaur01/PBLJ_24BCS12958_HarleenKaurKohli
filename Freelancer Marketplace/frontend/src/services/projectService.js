import api from './api';

export const projectService = {
    getAllProjects: async () => {
        const response = await api.get('/projects');
        return response.data;
    },

    getMyProjects: async () => {
        const response = await api.get('/projects/me');
        return response.data;
    },
    
    getProjectById: async (id) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    createProject: async (projectData) => {
        const response = await api.post('/projects', projectData);
        return response.data;
    },
    
    submitBid: async (projectId, bidData) => {
        const response = await api.post(`/projects/${projectId}/bids`, bidData);
        return response.data;
    }
};
