import React, { useState, useEffect } from 'react';                // Manage state + lifecycle
import { Button, Table, Tag, message, Tooltip } from 'antd';       // Ant Design components for UI elements
import { 
  PlusOutlined, 
  FolderAddOutlined, 
  FolderOpenOutlined, 
  FileTextOutlined, 
  EyeOutlined 
} from '@ant-design/icons';
import axios from 'axios';             // API calls to backend

// Import both of your modal components
import ManualUploadModal from '../../components/documents/ManualUploadModal';
import CreatePipelineModal from '../../components/documents/CreatePipelineModal';

// --- TypeScript Interfaces ---
interface FolderMapping {                   // Define the structure of the folder mapping data we get from the backend
  id: number;
  folder_name: string;
  workflow_name: string;
  is_active: boolean;
}

interface DocumentRecord {            // Define the structure of the document records we get from the backend
  id: number;
  document_name: string;
  source: string; // 'manual' or 'gdrive'
  current_status: string;
  ai_summary: string;
  presigned_url: string;
  submitted_date: string;
}

const DocumentPage: React.FC = () => {              // Main component for the Documents page
  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);             // Controls manual upload modal visibility
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);        // Controls pipeline modal visibility
  
  // Data States
  const [mappings, setMappings] = useState<FolderMapping[]>([]);             // Stores folder-workflow mappings
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);            // Stores document records
  
  // Loading States
  const [isMappingsLoading, setIsMappingsLoading] = useState(false);     // Loading state for pipelines table
  const [isDocsLoading, setIsDocsLoading] = useState(false);           // Loading state for documents table

  // --- API Calls ---
  
  // 1. Fetch the active pipelines
  const fetchMappings = async () => {                // Fetch pipeline mappings from backend
    setIsMappingsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/documents/mappings/');       // Ensure URL matches Django endpoint
      setMappings(response.data);
    } catch (error) {
      console.error("Failed to fetch mappings:", error);              // Handle API error
    } finally {
      setIsMappingsLoading(false);   // Stop loading
    }
  };

  // 2. Fetch all processed documents
  const fetchDocuments = async () => {                   // Fetch document list from backend
    setIsDocsLoading(true);
    try {
      // Ensure this URL matches your Django endpoint
      const response = await axios.get('http://localhost:8000/api/documents/list/');
      setDocuments(response.data);
    } catch (error) {           
      console.error("Failed to fetch documents:", error);    
      message.error("Failed to load document vault.");             
    } finally {
      setIsDocsLoading(false);        
    }
  };

  // Load both tables on mount
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
    fetchDocuments(); // Refresh documents after upload
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
          {/* Icon next to folder name */}
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
          {/* Active/Disabled status */}
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
          {/* Document icon */}
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
          {/* Source type */}
          {source ? source.toUpperCase() : 'UNKNOWN'}                   
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'current_status',
      key: 'current_status',
      render: (status: string) => {              
        // Determine color based on status
        let color = 'default';
        if (status === 'uploaded') color = 'cyan';
        if (status === 'in_workflow') color = 'geekblue';
        if (status === 'purged') color = 'red';

        return (
          <Tag color={color}>
            {status ? status.replace('_', ' ').toUpperCase() : 'N/A'}
          </Tag>
        );
      },
    },
    {
      title: 'AI Summary',
      dataIndex: 'ai_summary',
      key: 'ai_summary',
      render: (text: string) => (
        <>
          {/* Tooltip shows full summary */}
          <Tooltip title={text} placement="topLeft">
            <span className="truncate block max-w-xs text-gray-600 cursor-help">
              {/* Show fallback if AI not ready */}
              {text || 'Waiting for AI...'}
            </span>
          </Tooltip>
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: DocumentRecord) => (
        <>
          {/* Secure document view button */}
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            href={record.presigned_url} 
            target="_blank"
            disabled={!record.presigned_url}              
          >
            View Securely
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Documents Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all incoming documents and automated pipelines.
          </p>         
          {/* Subtitle for context */}
        </div>
        
        {/* BUTTON CONTAINER */}
        <div className="flex gap-3">

          {/* Open pipeline modal */}
          <Button 
            icon={<FolderAddOutlined />} 
            onClick={() => setIsPipelineModalOpen(true)}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            New Pipeline
          </Button>

          {/* Open upload modal */}
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
          pagination={false} 
        />
      </div>

      {/* 2. THE MASTER DOCUMENT VAULT */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        {/* Document vault container */}
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Document Vault</h2>
        {/* Vault title */}
        <Table 
          columns={documentColumns} 
          dataSource={documents} 
          rowKey="id" 
          loading={isDocsLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* YOUR HIDDEN MODALS */}

      {/* Manual upload modal */}
      <ManualUploadModal
        isOpen={isUploadModalOpen} 
        onClose={handleUploadModalClose} 
      />

      {/* Create pipeline modal */}
      <CreatePipelineModal
        isOpen={isPipelineModalOpen} 
        onClose={handlePipelineModalClose} 
      />

    </div>
  );
};

export default DocumentPage;