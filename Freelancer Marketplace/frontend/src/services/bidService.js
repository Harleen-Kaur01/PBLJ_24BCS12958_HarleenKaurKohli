import api from './api';

export const bidService = {
    getBidsForProject: async (projectId) => {
        const response = await api.get(`/projects/${projectId}/bids`);
        return response.data;
    },

    getMyBids: async () => {
        const response = await api.get('/bids/me');
        return response.data;
    },
    
    acceptBid: async (bidId) => {
        const response = await api.put(`/bids/${bidId}/accept`);
        return response.data;
    }
};
