import axios from "axios";

const API = "http://localhost:8000/api/user/user";

export const userService = {

    getUsers: async () => {
        const res = await axios.get(`${API}/getAll/`);
        return res.data;
    },

    createUser: async (data: any) => {

        try {
            const res = await axios.post(`${API}/save/`, data);
            return res.data;
        } catch (error: any) {
            console.log("FULL ERROR:", error.response?.data);
        }

    },

    updateUser: async (id: string, data: any) => {
        const res = await axios.put(`${API}/update/${id}/`, data);
        return res.data;
    },

    deleteUser: async (id: string) => {
        return axios.delete(`${API}/delete/${id}/`);
    }
};