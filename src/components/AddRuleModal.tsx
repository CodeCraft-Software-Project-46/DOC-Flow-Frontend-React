import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios"; 
import axiosInstance from "../api/axiosInstance";

// 1. Define the shape of a single option
interface SelectOption {
    value: string;
    label: string;
}

// 2. Define the shape of the whole metadata object
interface MetaOptions {
    events: SelectOption[];
    channels: SelectOption[];
    roles: string[]; // Roles was just a list of strings in our backend
}

type AddRuleModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onRuleAdded: () => void;
};

export const AddRuleModal: React.FC<AddRuleModalProps> = ({ isOpen, onClose, onRuleAdded }) => {
    const [ruleName, setRuleName] = useState("");
    const [eventTrigger, setEventTrigger] = useState("TASK_ASSIGNED");
    const [deliveryChannel, setDeliveryChannel] = useState("EMAIL");
    
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
    const [options, setOptions] = useState<{ roles: string[], users: string[] }>({ roles: [], users: [] });
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch options only when the modal opens
    useEffect(() => {
        if (isOpen) {
            fetchOptions();
            // Reset form state when opened
            setRuleName("");
            setEventTrigger("TASK_ASSIGNED");
            setDeliveryChannel("EMAIL");
            setSelectedRecipients([]);
        }
    }, [isOpen]);

    const fetchOptions = async () => {
        setIsLoadingOptions(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get("http://127.0.0.1:8000/api/notifications/recipient-options/", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOptions(response.data);
        } catch (error) {
            console.error("Failed to fetch recipient options", error);
        } finally {
            setIsLoadingOptions(false);
        }
    };

    const handleAddRecipient = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value && !selectedRecipients.includes(value)) {
            setSelectedRecipients([...selectedRecipients, value]);
        }
        e.target.value = ""; // Reset dropdown
    };

    const handleRemoveRecipient = (recipientToRemove: string) => {
        setSelectedRecipients(selectedRecipients.filter(r => r !== recipientToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            const token = localStorage.getItem('access_token');
            // Format data exactly how your Django NotificationRuleSerializer expects it
            const ruleData = {
                name: ruleName,
                event_trigger: eventTrigger,
                channel: deliveryChannel,
                // If Django expects a string list: ["Role: Admin", "User: Nesandu"]
                recipients: selectedRecipients, 
            };

            await axios.post("http://127.0.0.1:8000/api/notifications/rules/", ruleData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            onRuleAdded(); // Refresh the list on the main page
            onClose(); // Close the modal
            
        } catch (error) {
            console.error("Failed to save rule", error);
            alert("Failed to save notification rule.");
        } finally {
            setIsSaving(false);
        }
    };

    const [metaOptions, setMetaOptions] = useState<MetaOptions>({ events: [], channels: [], roles: [] });
    // Fetch metadata on mount
    useEffect(() => {
        const fetchMetadata = async () => {
            const res = await axiosInstance.get('/notifications/metadata/');
            setMetaOptions(res.data);
        };
        fetchMetadata();
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">Create Notification Rule</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Manager SLA Alert"
                            value={ruleName}
                            onChange={(e) => setRuleName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Trigger
                        </label>
                        <select
                            value={eventTrigger}
                            onChange={(e) => setEventTrigger(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Select an event...</option>
                            {metaOptions.events.map((event) => (
                                <option key={event.value} value={event.value}>
                                    {event.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Channel</label>
                        <select
                            value={deliveryChannel}
                            onChange={(e) => setDeliveryChannel(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="EMAIL">Email Only</option>
                            <option value="IN_APP_ONLY">In-App Only</option>
                            <option value="BOTH">Both (Email & In-App)</option>
                        </select>
                    </div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                        
                        {selectedRecipients.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {selectedRecipients.map((recipient) => (
                                    <span key={recipient} className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 flex items-center gap-1 text-sm rounded-md">
                                        {recipient}
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveRecipient(recipient)}
                                            className="text-blue-400 hover:text-blue-800"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <select
                            onChange={handleAddRecipient}
                            disabled={isLoadingOptions}
                            defaultValue=""
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 transition-all cursor-pointer"
                        >
                            <option value="" disabled>
                                {isLoadingOptions ? "Loading roles..." : "Select a Role..."}
                            </option>
                            
                            {/* Simplified mapping without optgroup */}
                            {options.roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>

                    <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:bg-blue-300"
                            disabled={!ruleName || selectedRecipients.length === 0 || isSaving}
                        >
                            {isSaving ? "Saving..." : "Create Rule"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};