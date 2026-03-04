import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { SlaCountdown } from '@/components/dashboard/SlaCountdown';
import { PriorityBadge } from '@/components/dashboard/PriorityBadge';
import { mockTasks, mockNotifications } from '@/data/mockDashboardData';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, RotateCcw, Clock, AlertTriangle, Bell, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type Action = 'approve' | 'reject' | 'send-back';

export default function ApproverDashboard() {
  const { user } = useAuth();
  const [actionDialog, setActionDialog] = useState<{ open: boolean; taskId: string; action: Action }>({ open: false, taskId: '', action: 'approve' });
  const [comment, setComment] = useState('');
  const [tasks, setTasks] = useState(mockTasks);

  const myTasks = tasks.filter((t) => t.assignedUser === user?.id);
  const pending = myTasks.filter((t) => t.status === 'pending');
  const overdue = myTasks.filter((t) => t.status === 'overdue');
  const sentBack = myTasks.filter((t) => t.status === 'sent-back');
  const myNotifs = mockNotifications.filter((n) => n.userId === user?.id && !n.read);

  const openAction = (taskId: string, action: Action) => {
    setActionDialog({ open: true, taskId, action });
    setComment('');
  };

  const executeAction = () => {
    const { taskId, action } = actionDialog;
    if (action === 'reject' && !comment.trim()) {
      toast({ title: 'Comment required', description: 'Please provide a reason for rejection.', variant: 'destructive' });
      return;
    }
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: action === 'approve' ? 'completed' as const : action === 'reject' ? 'rejected' as const : 'sent-back' as const, comments: comment || undefined }
          : t
      )
    );
    toast({ title: `Task ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'sent back'}` });
    setActionDialog({ open: false, taskId: '', action: 'approve' });
  };

  const actionLabel = { approve: 'Approve', reject: 'Reject', 'send-back': 'Send Back' };
  const actionColor = { approve: 'bg-success text-success-foreground hover:bg-success/90', reject: 'bg-destructive text-destructive-foreground hover:bg-destructive/90', 'send-back': 'bg-warning text-warning-foreground hover:bg-warning/90' };

  return (
    <MainLayout title={`Approvals - ${user?.name}`} subtitle="Documents waiting for your approval">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Pending Approvals', value: pending.length, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
            { label: 'Due Soon', value: myTasks.filter((t) => t.status === 'pending' && t.dueTime.getTime() - Date.now() < 4 * 3600000).length, icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
            { label: 'Overdue', value: overdue.length, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
            { label: 'Sent Back', value: sentBack.length, icon: RotateCcw, color: 'text-info', bg: 'bg-info/10' },
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

        {/* Pending Approvals Table */}
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Pending Approvals</CardTitle>
            <CardDescription>Tasks awaiting your action</CardDescription>
          </CardHeader>
          <CardContent>
            {pending.length === 0 && overdue.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 text-success" />
                <p>All caught up! No pending approvals.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Document</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Step</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Priority</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">SLA Remaining</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...overdue, ...pending].map((task) => (
                      <tr key={task.id} className={cn('border-b border-border/50 hover:bg-muted/50 transition-colors', task.status === 'overdue' && 'bg-destructive/5')}>
                        <td className="py-3 px-2">
                          <p className="font-medium text-foreground">{task.documentName}</p>
                          <p className="text-xs text-muted-foreground">{task.documentType}</p>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">{task.workflowStep}</td>
                        <td className="py-3 px-2"><PriorityBadge priority={task.priority} /></td>
                        <td className="py-3 px-2"><SlaCountdown deadline={task.dueTime} /></td>
                        <td className="py-3 px-2"><StatusBadge status={task.status} /></td>
                        <td className="py-3 px-2">
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="ghost" className="h-7 text-success hover:text-success" onClick={() => openAction(task.id, 'approve')} title="Approve">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 text-destructive hover:text-destructive" onClick={() => openAction(task.id, 'reject')} title="Reject">
                              <XCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 text-warning hover:text-warning" onClick={() => openAction(task.id, 'send-back')} title="Send Back">
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                {myNotifs.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="w-2 h-2 rounded-full mt-1.5 bg-primary shrink-0" />
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

        {/* Action Dialog */}
        <Dialog open={actionDialog.open} onOpenChange={(o) => setActionDialog((p) => ({ ...p, open: o }))}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{actionLabel[actionDialog.action]} Document</DialogTitle>
              <DialogDescription>
                {actionDialog.action === 'reject'
                  ? 'A comment is mandatory for rejection.'
                  : 'Optionally add a comment.'}
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Enter your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog((p) => ({ ...p, open: false }))}>Cancel</Button>
              <Button className={actionColor[actionDialog.action]} onClick={executeAction}>
                {actionLabel[actionDialog.action]}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
