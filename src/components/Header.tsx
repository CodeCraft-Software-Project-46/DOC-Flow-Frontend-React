import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROLE_LABELS } from "../contexts/AuthContext";

type HeaderProps = {
    onToggleSidebar: () => void;
    currentPage?: string;
};

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
        : "?";

    const roleLabel = user?.role ? ROLE_LABELS[user.role] : "";

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

                {/* Left Section - Welcome Text */}
                <div className="hidden md:flex flex-col min-w-0">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                        Welcome, {user?.name ?? "Guest"}
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
                            width="18" height="18" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2"
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
                        <svg width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    {/* User Avatar & Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <div
                            className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                {initials}
                            </div>
                            <div className="hidden lg:flex flex-col gap-0.5">
                                <div className="text-sm font-medium text-gray-900">{user?.name ?? "Guest"}</div>
                                <div className="text-xs text-gray-600">{roleLabel}</div>
                            </div>
                            <svg
                                className={`hidden lg:block text-gray-600 transition-transform flex-shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}
                                width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2"
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                                {/* User info at top */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>

                                {/* Menu items */}
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                    onClick={() => { setDropdownOpen(false); navigate("/settings"); }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="8" r="4"></circle>
                                        <path d="M20 21a8 8 0 1 0-16 0"></path>
                                    </svg>
                                    Profile
                                </button>

                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                    onClick={() => { setDropdownOpen(false); navigate("/settings"); }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                    </svg>
                                    Settings
                                </button>

                                <div className="border-t border-gray-100 mt-1"></div>

                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                    onClick={handleLogout}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;