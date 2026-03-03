export interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  status: 'success' | 'failure' | 'warning';
}

export const mockAuditLogs: AuditLog[] = [
  { id: '1', user: 'Admin User', role: 'Admin', action: 'Login', target: 'System', timestamp: '2026-03-03 10:00', status: 'success' },
  { id: '2', user: 'Staff Member', role: 'Staff', action: 'Upload', target: 'Invoice_001.pdf', timestamp: '2026-03-03 10:15', status: 'success' },
  { id: '3', user: 'Supervisor', role: 'Supervisor', action: 'Reject', target: 'Leave Request #42', timestamp: '2026-03-03 11:30', status: 'warning' },
];