
import { Outlet, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./SideBar";
import Footer from "./Footer";
import ChatBot from "./ChatBot";

export function RootLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedKey = location.pathname;
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    
    // Mock user data — replace with actual auth context in production
    const [userRole] = useState<"admin" | "manager" | "user">("admin");
    const [userWorkflows] = useState<string[]>(["Purchase Order Approval", "GRN Processing", "SRN Workflow", "Direct Payment"]);

    const handleMenuClick = (key: string) => {
        navigate(key);
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                selectedKey={selectedKey}
                onMenuClick={handleMenuClick}
                onLogout={() => {
                    localStorage.removeItem("isAuthenticated");
                    navigate("/");
                }}
            />
            <div className=" flex-1 flex flex-col h-screen overflow-hidden">
                <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} currentPage={selectedKey} />
                <main className="flex-1 overflow-auto p-2 md:p-3">
                    <div className="bg-gray-50  shadow-sm p-1 md:p-2 min-h-full">
                        {/* This is where the child routes (Dashboard, Documents) will render */}
                        <Outlet />
                    </div>
                </main>
                <Footer />
            </div>
            {/* ChatBot RAG Assistant */}
            <ChatBot userRole={userRole} userWorkflows={userWorkflows} />
        </div>
    );
}