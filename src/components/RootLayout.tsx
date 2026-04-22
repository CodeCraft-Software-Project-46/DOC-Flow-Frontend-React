// In React, the RootLayout is the Picture Frame. Its job is to hold the UI elements that should never disappear 
// when the user navigates around your app—like the Sidebar on the left, the Header at the top, and the Footer at the bottom.
import { Outlet, useLocation, useNavigate } from "react-router"; 
import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./SideBar";
import Footer from "./Footer";

export function RootLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Track which page we are on for the Sidebar highlighting
    const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
    
    // Manage mobile sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    // Keep the highlighted button in sync if the URL changes
    useEffect(() => {
        setSelectedKey(location.pathname);
    }, [location.pathname]);

    // Handle clicking a sidebar link
    const handleMenuClick = (key: string) => {
        setSelectedKey(key);
        navigate(key);
        setIsSidebarOpen(false); // Auto-close on mobile
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* 1. The Dynamic Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                selectedKey={selectedKey}
                onMenuClick={handleMenuClick}
                // Notice we deleted the onLogout prop! 
                // The Sidebar talks directly to the AuthContext Vault now.
            />
            
            {/* 2. The Main Application Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                
                {/* Your custom Header */}
                <Header 
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                    currentPage={selectedKey} 
                />
                
                {/* 3. The Outlet where your actual pages load */}
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    <div className="bg-gray-50 shadow-sm p-2 md:p-6 min-h-full">
                        <Outlet />
                    </div>
                </main>
                
                {/* Your custom Footer */}
                <Footer />
            </div>
        </div>
    );
}