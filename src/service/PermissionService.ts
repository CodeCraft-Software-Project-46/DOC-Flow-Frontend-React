import axios from "axios";

const BASE_URL = "http://localhost:8000/api/user/permission/";

export const permissionService = {

    // GET all permissions
    getAll: async () => {
        const res = await axios.get(`${BASE_URL}getAll/`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return res.data;
    }
};