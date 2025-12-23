import api from './api';

const learningService = {
    getPaths: async () => {
        try {
            const response = await api.get('/paths/');
            return response.data; // Backend returns list directly
        } catch (error) {
            console.error("Failed to fetch paths:", error);
            throw error;
        }
    },

    getPathDetail: async (id) => {
        try {
            const response = await api.get(`/paths/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch path ${id}:`, error);
            throw error;
        }
    },

    getLesson: async (id) => {
        try {
            const response = await api.get(`/lessons/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch lesson ${id}:`, error);
            throw error;
        }
    },

    completeLesson: async (id) => {
        try {
            await api.post(`/lessons/${id}/complete/`);
            return { success: true };
        } catch (error) {
            console.error(`Failed to complete lesson ${id}:`, error);
            throw error;
        }
    }
};

export default learningService;
