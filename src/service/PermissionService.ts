import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/user/permissions/";

export const permissionService = {

    // GET all permissions
    getAll: async () => {
        const res = await axios.get(BASE_URL, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return res.data;
    },
};