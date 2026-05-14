import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';


interface AuditEntry {
    id: number;
    username: string;
    action: string;
    document_id: number | null;
    previous_state: string;
    new_state: string;
    description: string;
    timestamp: string; 
}

const AuditLogPage = () => {
    const [logs, setLogs] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the logs from your new GET /api/audits/logs/ endpoint
        axiosInstance.get('/audits/logs/')
        .then(res => {
                setLogs(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);
    if (loading) return <div className="p-6 text-black">Loading system logs...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-black">System Audit Logs</h1>
            <div className="overflow-x-auto bg-[#1a2c3e] rounded-lg border border-white/10">
                <table className="w-full text-left text-sm text-white/80">
                    <thead className="bg-white/5 text-xs uppercase text-blue-400">
                        <tr>
                            <th className="px-4 py-3">Timestamp</th>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {logs.map(log => (
                            <tr key={log.id} className="hover:bg-white/5">
                                <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="px-4 py-3 font-medium text-white">{log.username}</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-white/60">{log.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogPage;