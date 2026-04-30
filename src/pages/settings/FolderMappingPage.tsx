import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Tag } from 'antd';
import { PlusOutlined, FolderOpenOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

// TypeScript Interfaces for our data
interface FolderMapping {
  id: number;
  folder_name: string;
  workflow_name: string;
  is_active: boolean;
}

interface WorkflowRecord {
  id: string;
  name: string;
}

const FolderMappingPage: React.FC = () => {
  const [mappings, setMappings] = useState<FolderMapping[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  // Fetch initial data when the page loads
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch the existing mappings for the Table
      const mappingRes = await axios.get('http://localhost:8000/api/documents/mappings/');
      setMappings(mappingRes.data);

      // 2. Fetch the Workflows for the Create Modal dropdown
      // (Reusing the dropdowns endpoint we know works perfectly!)
      const dropdownRes = await axios.get('http://localhost:8000/api/documents/upload/dropdowns/');
      setWorkflows(dropdownRes.data.workflows);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      message.error("Failed to load folder mappings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle creating a new folder mapping
  const handleCreateMapping = async (values: any) => {
    setIsSubmitting(true);

    // We need to find the text name of the workflow the user selected 
    // to save it nicely in the database
    const selectedWorkflow = workflows.find(wf => wf.id === values.workflow_id);

    const payload = {
      folder_name: values.folder_name,
      workflow_id: values.workflow_id,
      workflow_name: selectedWorkflow ? selectedWorkflow.name : 'Unknown Workflow'
    };

    try {
      // Because we aren't uploading a file here, we can just send standard JSON
      const response = await axios.post('http://localhost:8000/api/documents/mappings/create/', payload);
      
      message.success(response.data.message || 'Folder created and mapped successfully!');
      setIsModalOpen(false);
      form.resetFields();
      
      // Refresh the table to show the new folder
      fetchData();
    } catch (error: any) {
      console.error("Creation error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error);
      } else {
        message.error("Failed to create folder mapping.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ant Design Table Columns Configuration
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Automated Pipelines</h1>
          <p className="text-gray-500 text-sm mt-1">Manage Google Drive folders and their attached workflows.</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600"
        >
          Create New Pipeline
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={mappings} 
        rowKey="id" 
        loading={isLoading}
        className="bg-white shadow-sm rounded-lg border border-gray-100"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Create Automated Pipeline"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateMapping}
          className="mt-4"
        >
          <Form.Item
            name="folder_name"
            label="Google Drive Folder Name"
            rules={[
              { required: true, message: 'Please enter a folder name.' },
              { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Please use only letters, numbers, dashes, or underscores (No spaces).' }
            ]}
            extra="We recommend using underscores instead of spaces (e.g., HR_Resumes)."
          >
            <Input placeholder="e.g., Q3_Invoices" prefix={<FolderOpenOutlined className="text-gray-400" />} />
          </Form.Item>

          <Form.Item
            name="workflow_id"
            label="Attach to Workflow"
            rules={[{ required: true, message: 'Please select a target workflow.' }]}
            extra="Files dropped into the new folder will automatically trigger this workflow."
          >
            <Select placeholder="Select Workflow...">
              {workflows.map((wf) => (
                <Option key={wf.id} value={wf.id}>{wf.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting} className="bg-blue-600">
              Create & Map Folder
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default FolderMappingPage;