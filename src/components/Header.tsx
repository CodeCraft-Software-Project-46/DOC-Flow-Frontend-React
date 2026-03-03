import React from "react";

type HeaderProps = {
    onToggleSidebar: () => void;
    currentPage?: string;
};

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="flex justify-between items-center gap-6 px-4 md:px-8 py-4">

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden p-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    onClick={onToggleSidebar}
                >
                    ☰
                </button>

                {/* Left Section - Welcome Text (hidden on mobile) */}
                <div className="hidden md:flex flex-col min-w-0">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                        Welcome, Alice Cooper
                    </h1>
                    <p className="text-sm text-gray-600">
                        Your tasks and documents overview
                    </p>
                </div>

                {/* Center Section - Search */}
                <div className="flex-1 max-w-lg min-w-0">
                    <div className="relative">
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <input
                            type="text"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-100 placeholder:text-gray-400"
                            placeholder="Search workflows..."
                            aria-label="Search workflows"
                        />
                    </div>
                </div>

                {/* Right Section - Notifications & User */}
                <div className="flex items-center gap-3 flex-none">
                    {/* Notifications */}
                    <button
                        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Notifications"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    {/* User Avatar & Name */}
                    <div className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                        {/* Avatar always visible */}
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            AC
                        </div>

                        {/* Name hidden on mobile */}
                        <div className="hidden lg:flex flex-col gap-0.5">
                            <div className="text-sm font-medium text-gray-900">Alice Cooper</div>
                            <div className="text-xs text-gray-600">Staff / Initiator</div>
                        </div>

                        {/* Dropdown arrow hidden on mobile */}
                        <svg
                            className="hidden lg:block text-gray-600 transition-transform group-hover:rotate-180 flex-shrink-0"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
