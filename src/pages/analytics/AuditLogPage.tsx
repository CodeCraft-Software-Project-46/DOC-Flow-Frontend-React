import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShieldAlert } from "lucide-react";

// 1. Define the Data Structure
interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  status: 'success' | 'failure' | 'warning';
}

// 2. Create Mock Data (Since backend isn't connected yet)
const mockAuditLogs: AuditLog[] = [
  { id: '1', user: 'Admin User', role: 'Admin', action: 'System Login', target: 'Auth Module', timestamp: '2026-03-03 08:30:12', status: 'success' },
  { id: '2', user: 'External Party', role: 'External', action: 'Failed Login', target: 'Auth Module', timestamp: '2026-03-03 08:45:00', status: 'failure' },
  { id: '3', user: 'Staff Member', role: 'Staff', action: 'Document Upload', target: 'Invoice_Q1.pdf', timestamp: '2026-03-03 09:15:22', status: 'success' },
  { id: '4', user: 'Supervisor', role: 'Supervisor', action: 'Workflow Override', target: 'Leave Request #42', timestamp: '2026-03-03 10:05:10', status: 'warning' },
  { id: '5', user: 'Approver', role: 'Approver', action: 'Status Change', target: 'Contract_v2.docx', timestamp: '2026-03-03 11:20:45', status: 'success' },
];

export function AuditLogPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // 3. Simple Search Logic
  const filteredLogs = mockAuditLogs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 4. Helper for Badge Colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge variant="default" className="bg-green-600">Success</Badge>;
      case 'failure': return <Badge variant="destructive">Failure</Badge>;
      case 'warning': return <Badge variant="outline" className="text-amber-600 border-amber-600">Warning</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Audit Log</h2>
          <p className="text-muted-foreground">Monitor security events and user actions across the platform.</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-primary" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <CardDescription>A complete log of the latest system events.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex items-center space-x-2 mb-6">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by user, action, or target..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Data Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm text-muted-foreground">{log.timestamp}</TableCell>
                      <TableCell>
                        <div className="font-medium">{log.user}</div>
                        <div className="text-xs text-muted-foreground">{log.role}</div>
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No matching audit logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}