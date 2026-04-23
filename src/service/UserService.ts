import axios from "axios";

const API = "http://localhost:8000/api/user";

export const userService = {

    getUsers: async () => {
        const res = await axios.get(`${API}/get-users/`);
        return res.data;
    },

    createUser: async (data: any) => {
        const res = await axios.post(`${API}/save-user/`, data);
        return res.data;
    },

    updateUser: async (id: string, data: any) => {
        const res = await axios.put(`${API}/update-user/${id}/`, data);
        return res.data;
    },

    deleteUser: async (id: string) => {
        return axios.delete(`${API}/delete-user/${id}/`);
    }
};