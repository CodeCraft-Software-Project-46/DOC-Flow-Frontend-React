import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import { Sidebar } from "./Sidebar";
import Footer from "./Footer";

export function RootLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false); // 👈 track collapse

    useEffect(() => {
        setSelectedKey(location.pathname);
    }, [location.pathname]);

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar onCollapsedChange={setSidebarCollapsed} /> {/* 👈 pass callback */}
            <div
                className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
                    sidebarCollapsed ? "ml-16" : "ml-64"  // 👈 dynamic margin
                }`}
            >
                <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} currentPage={selectedKey} />
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    <div className="bg-gray-50 min-h-full">
                        <Outlet />
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}