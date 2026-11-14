import api from './api';

export const messageService = {
    getChatHistory: async () => {
        const response = await api.get('/messages/history');
        return response.data;
    },
    
    getConversation: async (otherUserId) => {
        const response = await api.get(`/messages/conversation/${otherUserId}`);
        return response.data;
    },
    
    sendMessage: async (receiverId, content, projectId = null) => {
        const response = await api.post('/messages', {
            receiverId,
            content,
            projectId
        });
        return response.data;
    }
};
