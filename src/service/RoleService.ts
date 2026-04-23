import axios from "axios";

const BASE_URL = "http://localhost:8000/api/user";

export const roleService = {
    getAll: async () => {
        const res = await axios.get(`${BASE_URL}/get-roles/`);
        return res.data;
    },

    create: async (data: {
        name: string;
        description: string;
        permissions: string[];
    }) => {
        const res = await axios.post(`${BASE_URL}/save-role/`, data);
        return res.data;
    },

    update: async (
        id: string,
        data: {
            name: string;
            description: string;
            permissions: string[];
        }
    ) => {
        const res = await axios.put(`${BASE_URL}/update-role/${id}/`, data);
        return res.data;
    },

    delete: async (id: string) => {
        const res = await axios.delete(`${BASE_URL}/delete-role/${id}/`);
        return res.data;
    }
};