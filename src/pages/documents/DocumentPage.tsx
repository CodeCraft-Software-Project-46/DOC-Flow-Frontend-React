import React, { useState, useEffect } from 'react';
import { Button, Table, Tag, message, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  FolderAddOutlined, 
  FolderOpenOutlined, 
  FileTextOutlined, 
  EyeOutlined 
} from '@ant-design/icons';
import axios from 'axios';

// Import both of your modal components
import ManualUploadModal from '../../components/documents/ManualUploadModal';
import CreatePipelineModal from '../../components/documents/CreatePipelineModal';

// --- TypeScript Interfaces ---
interface FolderMapping {
  id: number;
  folder_name: string;
  workflow_name: string;
  is_active: boolean;
}

interface DocumentRecord {
  id: number;
  document_name: string;
  source: string; // 'manual' or 'gdrive'
  current_status: string;
  ai_summary: string;
  s3_url: string;
  submitted_date: string;
}

const DocumentPage: React.FC = () => {
  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  
  // Data States
  const [mappings, setMappings] = useState<FolderMapping[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  
  // Loading States
  const [isMappingsLoading, setIsMappingsLoading] = useState(false);
  const [isDocsLoading, setIsDocsLoading] = useState(false);

  // --- API Calls ---
  
  // 1. Fetch the active pipelines
  const fetchMappings = async () => {
    setIsMappingsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/documents/mappings/');
      setMappings(response.data);
    } catch (error) {
      console.error("Failed to fetch mappings:", error);
    } finally {
      setIsMappingsLoading(false);
    }
  };

  // 2. Fetch all processed documents
  const fetchDocuments = async () => {
    setIsDocsLoading(true);
    try {
      // NOTE: Ensure this URL matches your Django urls.py endpoint for listing documents!
      const response = await axios.get('http://localhost:8000/api/documents/list/'); 
      setDocuments(response.data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      message.error("Failed to load document vault.");
    } finally {
      setIsDocsLoading(false);
    }
  };

  // Load both tables when the page opens
  useEffect(() => {
    fetchMappings();
    fetchDocuments();
  }, []);

  // Refresh tables when modals close
  const handlePipelineModalClose = () => {
    setIsPipelineModalOpen(false);
    fetchMappings(); 
  };

  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false);
    fetchDocuments(); // Refresh documents to show the newly uploaded one!
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
    {
      title: 'Target Workflow',
      dataIndex: 'workflow_name',
      key: 'workflow_name',
    },
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
        <Tag color={source === 'gdrive' ? 'blue' : 'purple'}>
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
          href={record.s3_url} 
          target="_blank"
          disabled={!record.s3_url} // Disable if S3 upload failed
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

      {/* 1. THE PIPELINES TABLE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Active Pipelines</h2>
        <Table 
          columns={pipelineColumns} 
          dataSource={mappings} 
          rowKey="id" 
          loading={isMappingsLoading}
          pagination={false} // Turn off pagination for pipelines since there won't be many
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

      {/* YOUR HIDDEN MODALS */}
      <ManualUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={handleUploadModalClose} 
      />

      <CreatePipelineModal 
        isOpen={isPipelineModalOpen} 
        onClose={handlePipelineModalClose} 
      />

    </div>
  );
};

export default DocumentPage;