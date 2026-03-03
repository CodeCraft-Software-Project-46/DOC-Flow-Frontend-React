import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { SlaCountdown } from '@/components/dashboard/SlaCountdown';
import { PriorityBadge } from '@/components/dashboard/PriorityBadge';
import { mockTasks, mockDashboardDocuments, mockNotifications } from '@/data/mockDashboardData';
import { FileText, Upload, Play, Clock, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StaffDashboard() {
  const { user } = useAuth();
  const myTasks = mockTasks.filter((t) => t.assignedUser === user?.id);
  const myDocs = mockDashboardDocuments.filter((d) => d.owner === user?.id);
  const myNotifs = mockNotifications.filter((n) => n.userId === user?.id && !n.read);

  const dueToday = myTasks.filter((t) => t.status !== 'completed' && t.dueTime.getTime() - Date.now() < 24 * 3600000 && t.dueTime.getTime() > Date.now());
  const overdue = myTasks.filter((t) => t.status === 'overdue' || (t.status !== 'completed' && t.dueTime.getTime() < Date.now()));
  const pendingTasks = myTasks.filter((t) => t.status === 'pending' || t.status === 'in-progress');

  return (
    <MainLayout title={`Welcome, ${user?.name || 'Staff'}`} subtitle="Your tasks and documents overview">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: 'My Pending Tasks', value: pendingTasks.length, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
            { label: 'My Documents', value: myDocs.length, icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Notifications', value: myNotifs.length, icon: Bell, color: 'text-info', bg: 'bg-info/10' },
            { label: 'Due Today', value: dueToday.length, icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
            { label: 'Overdue', value: overdue.length, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
          ].map((s) => (
            <Card key={s.label} className="enterprise-card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                  </div>
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', s.bg)}>
                    <s.icon className={cn('w-5 h-5', s.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button className="gap-2"><Upload className="w-4 h-4" /> Upload Document</Button>
          <Button variant="outline" className="gap-2"><Play className="w-4 h-4" /> Start Workflow</Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* My Tasks */}
          <Card className="enterprise-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> My Tasks</CardTitle>
              <CardDescription>Tasks assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              {myTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-10 h-10 mx-auto mb-2 text-success" />
                  <p>No tasks right now. You're all caught up!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Document</th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Step</th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Priority</th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">SLA</th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myTasks.map((task) => (
                        <tr key={task.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-2">
                            <div>
                              <p className="font-medium text-foreground">{task.documentName}</p>
                              <p className="text-xs text-muted-foreground">{task.documentType}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-muted-foreground">{task.workflowStep}</td>
                          <td className="py-3 px-2"><PriorityBadge priority={task.priority} /></td>
                          <td className="py-3 px-2"><SlaCountdown deadline={task.dueTime} /></td>
                          <td className="py-3 px-2"><StatusBadge status={task.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Documents */}
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> My Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.type} • {doc.currentStep}</p>
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {myNotifs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No new notifications</p>
              ) : (
                <div className="space-y-3">
                  {mockNotifications.filter((n) => n.userId === user?.id).slice(0, 5).map((n) => (
                    <div key={n.id} className={cn('flex items-start gap-3 p-3 rounded-lg border border-border/50', !n.read && 'bg-primary/5 border-primary/20')}>
                      <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', n.read ? 'bg-muted-foreground/30' : 'bg-primary')} />
                      <div>
                        <p className="text-sm text-foreground">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.createdAt.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
