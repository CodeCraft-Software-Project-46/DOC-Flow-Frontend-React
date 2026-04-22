import { createBrowserRouter, RouterProvider, Navigate } from "react-router";

// Layouts
import { RootLayout } from "./components/RootLayout";
import {ProtectedRoute} from "./components/ProtectedRoute.tsx";

import { DocumentPage } from "./pages/documents/DocumentPage";
import {SettingsPage} from "./pages/settings/SettingsPage.tsx";
import {SignIn} from "./pages/signIn-signup/SignIn.tsx";
import {DashboardSuperAdmin} from "./pages/dashboard/Dashboard-SuperAdmin.tsx";
import {WorkFlowVersionPage} from "./pages/workflow/WorkFlowVersionPage.tsx";
import {UserPage} from "./pages/user/UserPage.tsx";
import {DashBoardBuilder} from "./pages/dashboard/DashBoardBuilder.tsx";
import {WorkFlowPage} from "./pages/workflow/WorkFlowPage.tsx";
import {WorkFlowInstances} from "./pages/workflow/WorkFlowInstances.tsx";
import {AnalyticsPage} from "./pages/analytics/AnalyticsPage.tsx";
import {DocumentTypesPage} from "./pages/documents/DocumentTypesPage.tsx";

import NotificationsPage from "./pages/notifications/NotificationsPage";




export default function App() {
    const routes = createBrowserRouter([
        // 1. Login Route
        { path: "/", element: <SignIn /> },



        // 2. Protected App Routes
        {
            element: <RootLayout />, // Contains the Sidebar & Outlet
            children: [
                {
                    element: <ProtectedRoute />, // Checks if user is logged in
                    children: [

                        { path: "/dashboard", element: <DashboardSuperAdmin /> },
                        { path: "/dashboard-builder", element: <DashBoardBuilder /> },
                        { path: "/document", element: <DocumentPage /> },
                        { path: "/document-types", element: <DocumentTypesPage /> },
                        { path: "/workflow", element: <WorkFlowPage /> },
                        { path: "/workflow-version", element: <WorkFlowVersionPage /> },
                        { path: "/instances", element: <WorkFlowInstances /> },
                        { path: "/settings", element: <SettingsPage /> },
                        { path: "/user", element: <UserPage /> },
                        { path: "/analytics", element: <AnalyticsPage/> },
                        { path: "/notifications", element: <NotificationsPage /> },

                    ]
                }
            ]
        },

        { path: "*", element: <Navigate to="/dashboard" replace /> }
    ]);

    return <RouterProvider router={routes} />;
}