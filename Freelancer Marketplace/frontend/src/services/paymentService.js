import api from './api';

export const paymentService = {
    getPaymentHistory: async () => {
        const response = await api.get('/payments/history');
        return response.data;
    },
    
    createPayment: async (contractId, amount) => {
        const response = await api.post('/payments', {
            contractId,
            amount
        });
        return response.data;
    },
    
    updatePaymentStatus: async (paymentId, status) => {
        const response = await api.put(`/payments/${paymentId}/status?status=${status}`);
        return response.data;
    }
};
