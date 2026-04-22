import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { AddRuleModal } from '../../components/AddRuleModal';
import { Bell, CheckCircle, AlertTriangle, Plus, Trash2 } from 'lucide-react';

interface NotificationRule {
    id: number;
    name: string;
    event_trigger: string;
    channel: string;
    recipients: string[];
    is_active: boolean;
    created_by_username: string;
}

const NotificationsPage = () => {
    const [rules, setRules] = useState<NotificationRule[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRules = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axiosInstance.get('/notifications/rules/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRules(response.data);
        } catch (error) {
            console.error("Failed to fetch rules:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    // --- NEW ACTION LOGIC ---

    // 1. Toggle Active/Inactive Status
    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('access_token');
            // We use PATCH to only update the 'is_active' field
            await axiosInstance.patch(`/notifications/rules/${id}/`, 
                { is_active: !currentStatus }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchRules(); // Refresh list to show change
        } catch (error) {
            console.error("Toggle failed:", error);
            alert("Failed to update rule status.");
        }
    };

    // 2. Delete a Rule
    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this notification rule?")) return;
        
        try {
            const token = localStorage.getItem('access_token');
            await axiosInstance.delete(`/notifications/rules/${id}/`, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchRules(); // Refresh list
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete the rule.");
        }
    };

    // Stats Calculation
    const totalRules = rules.length;
    const activeRules = rules.filter(r => r.is_active).length;
    const disabledRules = rules.filter(r => !r.is_active).length;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                    <p className="text-gray-500 text-sm">Configure notification triggers and channels</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={18} />
                    Add Rule
                </button>
            </div>

            {/* Stats Cards (Same as before) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Bell size={24} /></div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{totalRules}</p>
                        <p className="text-sm text-gray-500">Total Rules</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{activeRules}</p>
                        <p className="text-sm text-gray-500">Active Rules</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><AlertTriangle size={24} /></div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{disabledRules}</p>
                        <p className="text-sm text-gray-500">Disabled Rules</p>
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Rules</h2>
            
            {isLoading ? (
                <p className="text-gray-500">Loading rules...</p>
            ) : rules.length === 0 ? (
                <div className="bg-white p-8 text-center rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 mb-4">No notification rules configured yet.</p>
                    <button onClick={() => setIsModalOpen(true)} className="text-blue-600 font-medium hover:underline">
                        Create your first rule
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {rules.map((rule) => (
                        <div key={rule.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-gray-50 rounded-lg mt-1"><Bell size={20} className="text-gray-600" /></div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-gray-800">{rule.name}</h3>
                                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full lowercase">
                                            {rule.channel}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Trigger: {rule.event_trigger}</p>
                                    <p className="text-sm text-gray-400 mt-1">Recipients: {rule.recipients.join(', ')}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {/* TOGGLE BUTTON: Now wired to handleToggleActive */}
                                <button 
                                    onClick={() => handleToggleActive(rule.id, rule.is_active)}
                                    className={`w-10 h-6 rounded-full p-1 transition-colors ${rule.is_active ? 'bg-blue-600' : 'bg-gray-300'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${rule.is_active ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </button>
                                
                                {/* DELETE BUTTON: Now wired to handleDelete */}
                                <button 
                                    onClick={() => handleDelete(rule.id)}
                                    className="text-gray-400 hover:text-red-500 transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddRuleModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRuleAdded={fetchRules} 
            />
        </div>
    );
};

export default NotificationsPage;