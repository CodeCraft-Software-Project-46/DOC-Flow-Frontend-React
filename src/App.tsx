import { createBrowserRouter, RouterProvider, Navigate } from "react-router";

// Layouts
import { RootLayout } from "./components/RootLayout"; //  Used for ALL pages after login,(Contains the Sidebar,Header & main contentarea)
import {ProtectedRoute} from "./components/ProtectedRoute.tsx";// frontend security(check if user is logged in, if not redirect to login page)

import  DocumentPage  from "./pages/documents/DocumentPage";
import {SettingsPage} from "./pages/settings/SettingsPage.tsx";
import {SignIn} from "./pages/signIn-signup/SignIn.tsx";
import {DashboardSuperAdmin} from "./pages/dashboard/Dashboard-SuperAdmin.tsx"; // Default landing page after login, can be different for each role
import {WorkFlowVersionPage} from "./pages/workflow/WorkFlowVersionPage.tsx";
import {UserPage} from "./pages/user/UserPage.tsx";
import {DashBoardBuilder} from "./pages/dashboard/DashBoardBuilder.tsx";
import {WorkFlowPage} from "./pages/workflow/WorkFlowPage.tsx";
import {WorkFlowInstances} from "./pages/workflow/WorkFlowInstances.tsx";
import {AnalyticsPage} from "./pages/analytics/AnalyticsPage.tsx";
import {DocumentTypesPage} from "./pages/documents/DocumentTypesPage.tsx";

// --- NEW: Import the external upload page ---
import ExternalUploadPage from "./pages/documents/ExternalUploadPage.tsx";

export default function App() {
    const routes = createBrowserRouter([   //define all routes inside this
        // 1. PUBLIC ROUTES (No login required)
        { path: "/", element: <SignIn /> },
        
        // NEW: Public route for external vendors using API links
        { path: "/external-upload/:linkId", element: <ExternalUploadPage /> },

        // 2. PROTECTED APP ROUTES
        {
            element: <RootLayout />, //Share same layout (sidebar + header)
            children: [
                {
                    element: <ProtectedRoute />, // Checks if user is logged in
                    children: [
                        { path: "/dashboard", element: <DashboardSuperAdmin /> }, // Default landing page after login
                        { path: "/dashboard-builder", element: <DashBoardBuilder /> },
                        { path: "/document", element: <DocumentPage /> },
                        { path: "/document-types", element: <DocumentTypesPage /> },
                        { path: "/workflow", element: <WorkFlowPage /> },
                        { path: "/workflow-version", element: <WorkFlowVersionPage /> },
                        { path: "/instances", element: <WorkFlowInstances /> },
                        { path: "/settings", element: <SettingsPage /> },
                        { path: "/user", element: <UserPage /> },
                        { path: "/analytics", element: <AnalyticsPage/> },
                    ]
                }
            ]
        },

        { path: "*", element: <Navigate to="/dashboard" replace /> } // Redirect any unknown routes(If user enters wrong URL:) to dashboard
    ]);

    return <RouterProvider router={routes} />; // Wrap the app with RouterProvider and pass the defined routes
}