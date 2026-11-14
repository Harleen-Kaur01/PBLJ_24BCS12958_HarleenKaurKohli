import api from './api';

export const reviewService = {
    createReview: async (reviewData) => {
        const response = await api.post('/reviews', reviewData);
        return response.data;
    },
    
    getReviewsForUser: async (userId) => {
        const response = await api.get(`/reviews/user/${userId}`);
        return response.data;
    },

    getMyReviews: async () => {
        const response = await api.get('/reviews/me');
        return response.data;
    },
    
    getAverageRating: async (userId) => {
        const response = await api.get(`/reviews/user/${userId}/average`);
        return response.data;
    }
};
