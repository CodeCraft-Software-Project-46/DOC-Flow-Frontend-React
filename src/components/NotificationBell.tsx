import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { Bell, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

interface Notification {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    event_type?: string;
    level?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    created_at: string;
}

const NotificationBell = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const bellRef = useRef<HTMLDivElement>(null); // Reference for the whole bell area

    const fetchNotifications = () => {
        axiosInstance.get('/notifications/inbox/')
            .then(res => setNotifications(res.data))
            .catch(err => console.error('Fetch error:', err));
    };

    const handleMarkAsRead = async (id: number) => {
        console.log("Attempting to mark as read, ID:", id); // Debug Log
        try {
            // CHECK: Make sure this URL matches your Django urls.py exactly!
            await axiosInstance.patch(`/notifications/inbox/${id}/read/`);
            
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    // --- FIX: Click Outside Logic ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);
    // --------------------------------

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="relative" ref={bellRef}> {/* Added ref here */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#1a2c3e] border border-white/10 rounded-lg shadow-2xl z-[999] overflow-hidden">
                    <div className="p-3 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <span className="font-bold text-sm text-white">Notifications</span>
                        <span className="text-[10px] text-white/40 uppercase">{unreadCount} New</span>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-white/30 text-sm">No new alerts</div>
                        ) : (
                            notifications.map(notif => (
                                <div 
                                    key={notif.id} 
                                    // onClick is now more explicit
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevents the dropdown from closing weirdly
                                        if(!notif.is_read) handleMarkAsRead(notif.id);
                                    }}
                                    className={`p-4 border-b border-white/5 transition-all cursor-pointer flex gap-3 ${
                                        !notif.is_read ? 'bg-blue-500/10 hover:bg-blue-500/20' : 'opacity-50 hover:bg-white/5'
                                    }`}
                                >
                                    <div className="flex-1">
                                        <p className={`text-xs font-bold ${!notif.is_read ? 'text-white' : 'text-white/60'}`}>
                                            {notif.title}
                                        </p>
                                        <p className="text-[11px] text-white/70 mt-1">{notif.message}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;