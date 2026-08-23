import React, { useState, useEffect } from 'react';
import { Button, Table, Tabs, Tag, Popconfirm, Tooltip, message } from 'antd';
import { 
  PlusOutlined, 
  FolderAddOutlined, 
  LinkOutlined, 
  CopyOutlined, 
  StopOutlined, 
  FolderOpenOutlined, 
  FileTextOutlined, 
  EyeOutlined 
} from '@ant-design/icons';
import axios from 'axios';

import ManualUploadModal from '../../components/documents/ManualUploadModal';
import CreatePipelineModal from '../../components/documents/CreatePipelineModal';
import GenerateLinkModal from '../../components/documents/GenerateLinkModal';

interface FolderMapping {
  id: number;
  folder_name: string;
  workflow_name: string;
  is_active: boolean;
}

interface DocumentRecord {
  id: number;
  document_name: string;
  source: string;
  current_status: string;
  ai_summary: string;
  presigned_url: string;
  submitted_date: string;
}

interface UploadLinkRecord {
  id: string;
  document_type_name: string;
  workflow_id: string;
  is_revoked: boolean;
  is_valid: boolean;
  created_at: string;
  expires_at: string;
  url: string;
}

const DocumentPage: React.FC = () => {
  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // Data States
  const [mappings, setMappings] = useState<FolderMapping[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [uploadLinks, setUploadLinks] = useState<UploadLinkRecord[]>([]);
  
  // Loading States
  const [isMappingsLoading, setIsMappingsLoading] = useState(false);
  const [isDocsLoading, setIsDocsLoading] = useState(false);

  // --- API Calls ---
  const fetchPipelinesAndLinks = async () => {
    setIsMappingsLoading(true);
    try {
      const [pipeRes, linksRes] = await Promise.all([
        axios.get('http://localhost:8000/api/documents/mappings/'),
        axios.get('http://localhost:8000/api/documents/upload-links/')
      ]);
      setMappings(pipeRes.data);
      setUploadLinks(linksRes.data);
    } catch (error) {
      console.error("Failed to fetch integration data:", error);
      message.error("Failed to load integrations data.");
    } finally {
      setIsMappingsLoading(false);
    }
  };

  const fetchDocuments = async () => {
    setIsDocsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/documents/list/');
      setDocuments(response.data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      message.error("Failed to load document vault.");
    } finally {
      setIsDocsLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelinesAndLinks();
    fetchDocuments();
  }, []);

// --- ADD THIS MISSING FUNCTION ---

  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false);
    fetchDocuments(); // Refreshes the document vault table so the new file appears
  };
  // ---------------------------------

  const handleRevokeLink = async (id: string) => {
    try {
      await axios.post(`http://localhost:8000/api/documents/upload-links/${id}/revoke/`);
      message.success("Link revoked.");
      fetchPipelinesAndLinks();
    } catch (error) {
      message.error("Failed to revoke link.");
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    message.success("Link copied to clipboard!");
  };

  // --- Table Column Configurations ---
  const pipelineColumns = [
    {
      title: 'Google Drive Folder',
      dataIndex: 'folder_name',
      key: 'folder_name',
      render: (text: string) => (
        <span className="font-medium text-gray-800">
          <FolderOpenOutlined className="text-blue-500 mr-2" />
          {text}
        </span>
      ),
    },
    { title: 'Target Workflow', dataIndex: 'workflow_name', key: 'workflow_name' },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active (Scanning)' : 'Disabled'}
        </Tag>
      ),
    },
  ];

  const linkColumns = [
    { title: 'Target Document Type', dataIndex: 'document_type_name', render: (text: string) => <span className="font-semibold text-gray-800">{text}</span> },
    { title: 'Workflow ID', dataIndex: 'workflow_id', render: (text: string) => <span className="font-mono text-xs bg-gray-100 p-1 rounded">{text}</span> },
    { title: 'Expires At', dataIndex: 'expires_at' },
    { title: 'Status', render: (_: any, record: UploadLinkRecord) => record.is_revoked ? <Tag color="red">Revoked</Tag> : (!record.is_valid ? <Tag color="orange">Expired</Tag> : <Tag color="green">Active</Tag>) },
    { title: 'Actions', render: (_: any, record: UploadLinkRecord) => (
      <div className="flex gap-2">
        <Tooltip title="Copy Link"><Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(record.url)} disabled={!record.is_valid}>Copy</Button></Tooltip>
        {!record.is_revoked && record.is_valid && (
          <Popconfirm title="Revoke Link?" onConfirm={() => handleRevokeLink(record.id)} okText="Yes" okButtonProps={{ danger: true }}>
            <Button size="small" danger icon={<StopOutlined />}>Revoke</Button>
          </Popconfirm>
        )}
      </div>
    )}
  ];

  const documentColumns = [
    {
      title: 'Document Name',
      dataIndex: 'document_name',
      key: 'document_name',
      render: (text: string) => (
        <span className="font-medium text-gray-800">
          <FileTextOutlined className="text-blue-500 mr-2" />
          {text}
        </span>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (source: string) => (
        <Tag color={source === 'gdrive' ? 'blue' : (source === 'api_link' ? 'purple' : 'cyan')}>
          {source ? source.toUpperCase() : 'UNKNOWN'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'current_status',
      key: 'current_status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'uploaded') color = 'cyan';
        if (status === 'in_workflow') color = 'geekblue';
        if (status === 'purged') color = 'red';

        return <Tag color={color}>{status ? status.replace('_', ' ').toUpperCase() : 'N/A'}</Tag>;
      },
    },
    {
      title: 'AI Summary',
      dataIndex: 'ai_summary',
      key: 'ai_summary',
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <span className="truncate block max-w-xs text-gray-600 cursor-help">
            {text || 'Waiting for AI...'}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: DocumentRecord) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />} 
          href={record.presigned_url} 
          target="_blank"
          disabled={!record.presigned_url}
        >
          View Securely
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Documents Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all incoming documents and automated pipelines.</p>
        </div>
        
        {/* BUTTON CONTAINER */}
        <div className="flex gap-3">
          <Button 
            icon={<LinkOutlined />} 
            onClick={() => setIsLinkModalOpen(true)}
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            Generate API Link
          </Button>

          <Button 
            icon={<FolderAddOutlined />} 
            onClick={() => setIsPipelineModalOpen(true)}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            New Pipeline
          </Button>

          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-blue-600"
          >
            Upload Document
          </Button>
        </div>
      </div>

      {/* 1. PIPELINES AND UPLOAD LINKS (TABBED) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-8">
        <Tabs 
          defaultActiveKey="1" 
          items={[
            { 
              key: '1', 
              label: 'Google Drive Pipelines', 
              children: <Table columns={pipelineColumns} dataSource={mappings} rowKey="id" loading={isMappingsLoading} pagination={false} /> 
            },
            { 
              key: '2', 
              label: 'API Upload Links', 
              children: <Table columns={linkColumns} dataSource={uploadLinks} rowKey="id" loading={isMappingsLoading} pagination={{ pageSize: 5 }} /> 
            }
          ]} 
        />
      </div>

      {/* 2. THE MASTER DOCUMENT VAULT */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Document Vault</h2>
        <Table 
          columns={documentColumns} 
          dataSource={documents} 
          rowKey="id" 
          loading={isDocsLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* HIDDEN MODALS */}
      <ManualUploadModal isOpen={isUploadModalOpen} onClose={handleUploadModalClose} />
      <CreatePipelineModal isOpen={isPipelineModalOpen} onClose={() => { setIsPipelineModalOpen(false); fetchPipelinesAndLinks(); }} />
      <GenerateLinkModal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} onSuccess={fetchPipelinesAndLinks} />
    </div>
  );
};

export default DocumentPage;