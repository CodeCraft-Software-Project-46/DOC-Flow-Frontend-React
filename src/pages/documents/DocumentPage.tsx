import React, { useState, useEffect } from 'react';
import { Button, Table, Tag, message } from 'antd';
import { PlusOutlined, FolderAddOutlined, FolderOpenOutlined } from '@ant-design/icons';
import axios from 'axios';

// Import both of your modal components
import ManualUploadModal from '../../components/documents/ManualUploadModal';
import CreatePipelineModal from '../../components/documents/CreatePipelineModal';

// Define the shape of your pipeline data
interface FolderMapping {
  id: number;
  folder_name: string;
  workflow_name: string;
  is_active: boolean;
}

const DocumentPage: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  
  // State for the Data Table
  const [mappings, setMappings] = useState<FolderMapping[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the active pipelines from Django
  const fetchMappings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/documents/mappings/');
      setMappings(response.data);
    } catch (error) {
      console.error("Failed to fetch mappings:", error);
      message.error("Failed to load pipelines.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load the table data the moment the page opens
  useEffect(() => {
    fetchMappings();
  }, []);

  // When a user finishes creating a new pipeline, close the modal AND refresh the table
  const handlePipelineModalClose = () => {
    setIsPipelineModalOpen(false);
    fetchMappings(); 
  };

  // The columns for your Ant Design Table
  const columns = [
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Documents Dashboard</h1>
        
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

      {/* THE PIPELINES TABLE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mt-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Automated Pipelines</h2>
        <Table 
          columns={columns} 
          dataSource={mappings} 
          rowKey="id" 
          loading={isLoading}
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* YOUR HIDDEN MODALS */}
      <ManualUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />

      <CreatePipelineModal 
        isOpen={isPipelineModalOpen} 
        onClose={handlePipelineModalClose} 
      />

    </div>
  );
};

export default DocumentPage;