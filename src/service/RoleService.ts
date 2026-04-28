import axios from "axios";

const BASE_URL = "http://localhost:8000/api/user/role";

export const roleService = {
    getAll: async () => {
        const res = await axios.get(`${BASE_URL}/getAll/`);
        return res.data;
    },

    create: async (data: {
        name: string;
        description: string;
        permissions: string[];
    }) => {
        const res = await axios.post(`${BASE_URL}/save/`, data);
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
        const res = await axios.put(`${BASE_URL}/update/${id}/`, data);
        return res.data;
    },

    delete: async (id: string) => {
        const res = await axios.delete(`${BASE_URL}/delete/${id}/`);
        return res.data;
    }
};