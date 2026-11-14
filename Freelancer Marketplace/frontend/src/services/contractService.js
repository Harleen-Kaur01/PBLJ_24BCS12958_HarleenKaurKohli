import api from './api';

export const contractService = {
    getMyContracts: async () => {
        const response = await api.get('/contracts');
        return response.data;
    },
    
    completeContract: async (id) => {
        const response = await api.put(`/contracts/${id}/complete`);
        return response.data;
    },
    
    cancelContract: async (id) => {
        const response = await api.put(`/contracts/${id}/cancel`);
        return response.data;
    }
};
