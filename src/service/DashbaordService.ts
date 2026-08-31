import axios from "axios";

const API = "http://localhost:8000/api/dashboard";

export const dashboardService = {
    getAccessibleWidgetIds: async (role_id: string) => {
        const res = await axios.get(`${API}/getAccessibleWidgets/${role_id}/`);
        console.log(res.data);
        return res.data;
    },
    saveDashboard: async (data: any) => {

        const res = await fetch(
            "http://127.0.0.1:8000/api/dashboard/saveDashboard/",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(data),
            }
        );

        return await res.json();
    },

    updateDashboard: async (
        id: number,
        data: any
    ) => {

        const res = await fetch(
            `http://127.0.0.1:8000/api/dashboard/updateDashboard/${id}/`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(data),
            }
        );

        return await res.json();
    },


    async getDashboards() {

        const res = await fetch(
            `${API}/getAllDashboard/`
        );

        return await res.json();
    },

    async getDashboard(dashboard_id: number) {

        const res = await fetch(
            `${API}/getDashboard/${dashboard_id}/`
        );

        return await res.json();
    },

    async changeDashboardStatus(
        dashboard_id: number,
        status: string
    ) {

        const response = await fetch(
            `${API}/changeDashboardStatus/${dashboard_id}/`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    status,
                }),
            }
        );

        const data = await response.json();

        // throw backend error properly
        if (!response.ok) {
            throw data;
        }

        return data;
    },
    async deleteDashboard(dashboard_id: number) {

        const response = await fetch(
            `${API}/deleteDashboard/${dashboard_id}/`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data;
    },
    // get active dashboard for a role
    async getActiveDashboard(role_id: number | string | null) {

        if (!role_id) {
            throw new Error("role_id is required");
        }

        const response = await fetch(
            `${API}/getActiveDashboard/${role_id}/`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data;
    },


}