import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { WorkflowFilters } from '@/components/workflows/WorkflowFilters';
import { WorkflowTable } from '@/components/workflows/WorkflowTable';
import { CreateWorkflowWizard } from '@/components/workflows/CreateWorkflowWizard';
import { mockWorkflowTemplates } from '@/data/mockData';
import { WorkflowStatus } from '@/types/workflow';
import { toast } from 'sonner';

export default function WorkflowsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<WorkflowStatus | 'all'>('all');
  const [category, setCategory] = useState('all');
  const [showWizard, setShowWizard] = useState(false);

  const filteredWorkflows = useMemo(() => {
    return mockWorkflowTemplates.filter((workflow) => {
      const matchesSearch =
        !search ||
        workflow.name.toLowerCase().includes(search.toLowerCase()) ||
        workflow.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === 'all' || workflow.status === status;

      const matchesCategory =
        category === 'all' || workflow.documentCategory === category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [search, status, category]);

  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setCategory('all');
  };

  const handleEdit = (id: string) => {
    toast.info(`Editing workflow ${id}`);
  };

  const handleDuplicate = (id: string) => {
    toast.success('Workflow duplicated');
  };

  const handlePublish = (id: string) => {
    toast.success('Workflow published');
  };

  const handleArchive = (id: string) => {
    toast.success('Workflow archived');
  };

  const handleDelete = (id: string) => {
    toast.success('Workflow deleted');
  };

  return (
    <MainLayout
      title="Workflow Templates"
      subtitle="Create and manage document workflow templates"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <WorkflowFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            category={category}
            onCategoryChange={setCategory}
            onClearFilters={clearFilters}
          />

          <Button onClick={() => setShowWizard(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Workflows', value: mockWorkflowTemplates.length, color: 'bg-primary' },
            { label: 'Active', value: mockWorkflowTemplates.filter((w) => w.status === 'active').length, color: 'bg-success' },
            { label: 'Draft', value: mockWorkflowTemplates.filter((w) => w.status === 'draft').length, color: 'bg-warning' },
            { label: 'Archived', value: mockWorkflowTemplates.filter((w) => w.status === 'archived').length, color: 'bg-muted-foreground' },
          ].map((stat) => (
            <div key={stat.label} className="enterprise-card p-4">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${stat.color}`} />
                <div>
                  <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <WorkflowTable
          workflows={filteredWorkflows}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onPublish={handlePublish}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />
      </div>

      {/* Create Wizard */}
      <CreateWorkflowWizard open={showWizard} onClose={() => setShowWizard(false)} />
    </MainLayout>
  );
}
