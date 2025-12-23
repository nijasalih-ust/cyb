import api from './api';

const frameworkService = {
    getTactics: async () => {
        try {
            const response = await api.get('/frameworks/tactics/');
            return response.data; // Backend returns list directly
        } catch (error) {
            console.error("Failed to fetch tactics:", error);
            throw error;
        }
    },

    getMatrix: async () => {
        try {
            const response = await api.get('/frameworks/matrix/');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch matrix:", error);
            throw error;
        }
    },

    getTechnique: async (id) => {
        try {
            const response = await api.get(`/mitre-techniques/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch technique ${id}:`, error);
            throw error;
        }
    },

    getTechniquesByTactic: async (tacticId) => {
        try {
            const response = await api.get(`/frameworks/tactics/${tacticId}/techniques/`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch techniques for tactic ${tacticId}:`, error);
            throw error;
        }
    }
};

export default frameworkService;
