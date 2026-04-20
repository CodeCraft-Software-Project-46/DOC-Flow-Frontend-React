import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { X } from 'lucide-react'; // Assuming you use lucide-react for the close icon

interface AddRuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRuleAdded: () => void; // Function to refresh the rules list after adding
}

export const AddRuleModal: React.FC<AddRuleModalProps> = ({ isOpen, onClose, onRuleAdded }) => {
    const authContext = useContext(AuthContext);
    const [name, setName] = useState('');
    const [eventTrigger, setEventTrigger] = useState('TASK_ASSIGNED');
    const [channel, setChannel] = useState('BOTH');
    const [recipientInput, setRecipientInput] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // Convert comma-separated string into an array (e.g., "Role: Manager, User: admin")
            const recipientsArray = recipientInput.split(',').map(r => r.trim()).filter(r => r !== '');

            const token = localStorage.getItem('access_token');
            
            // Sending POST request to the ListCreateAPIView you built in Django
            await axios.post('http://127.0.0.1:8000/api/notifications/rules/', {
                name: name,
                event_trigger: eventTrigger,
                channel: channel,
                recipients: recipientsArray,
                is_active: true
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Success! Close modal and tell the parent page to refresh the list
            onRuleAdded();
            onClose();
            
            // Reset form
            setName('');
            setRecipientInput('');
        } catch (err: any) {
            console.error("Failed to create rule:", err);
            setError('Failed to create notification rule. Please check your inputs.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Create Notification Rule</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                    {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Manager SLA Alert"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Trigger</label>
                        <select 
                            value={eventTrigger}
                            onChange={(e) => setEventTrigger(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="TASK_ASSIGNED">Task Assigned</option>
                            <option value="SLA_REMINDER">SLA Reminder</option>
                            <option value="SLA_BREACH">SLA Breach</option>
                            <option value="WORKFLOW_COMPLETED">Workflow Completed</option>
                            <option value="TASK_REJECTED">Task Rejected</option>
                            <option value="DOCUMENT_UPLOADED">Document Uploaded</option>
                            <option value="COMMENT_ADDED">Comment Added</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Channel</label>
                        <select 
                            value={channel}
                            onChange={(e) => setChannel(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="BOTH">Email + In-App</option>
                            <option value="EMAIL">Email Only</option>
                            <option value="IN_APP">In-App Only</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                        <input 
                            type="text" 
                            required
                            value={recipientInput}
                            onChange={(e) => setRecipientInput(e.target.value)}
                            placeholder="e.g., Role: Manager, User: admin"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Separate tags with commas. Use "Role: [name]" or "User: [username]".
                        </p>
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Create Rule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};