import axios from "axios";

const API = "http://localhost:8000/api/user/department";

export const departmentService = {

    getAll: async () => {
        const res = await axios.get(`${API}/getAll/`);
        return res.data;
    },

    create: async (data: {
        name: string;
        description?: string;
    }) => {
        const res = await axios.post(`${API}/save/`, data);
        return res.data;
    },

    update: async (
        id: string,
        data: {
            name?: string;
            description?: string;
        }
    ) => {
        const res = await axios.put(`${API}/update/${id}/`, data);
        return res.data;
    },

    delete: async (id:string) => {
        await axios.delete(`${API}/delete/${id}/`);
    }
};