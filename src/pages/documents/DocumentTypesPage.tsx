import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Tag, Switch, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, FileTextOutlined, DeleteOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';



// Define the TypeScript interface matching your MySQL table
interface DocumentType {
  id: number;
  type_name: string;
  category: string;
  allowed_extensions: string;
  is_active: boolean;
}

export const DocumentTypesPage: React.FC = () => {
  const [types, setTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  // Fetch the Document Types from Django
  const fetchTypes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/documents/types/');
      setTypes(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("Failed to load document types.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // Handle Form Submission
  const handleCreate = async (values: any) => {
    setIsSubmitting(true);
    try {
      // If the switch is untouched, it might be undefined, so default to true
      const payload = {
        ...values,
        is_active: values.is_active !== undefined ? values.is_active : true
      };

      await axios.post('http://localhost:8000/api/documents/types/', payload);
      message.success("Document type created successfully!");
      setIsModalOpen(false);
      form.resetFields();
      fetchTypes(); // Refresh the table
    } catch (error: any) {
      console.error("Creation error:", error);
      message.error("Failed to create document type.");
    } finally {
      setIsSubmitting(false);
    }
  };

// Function to Disable/Enable
  const handleToggleStatus = async (record: any) => {
    try {
      // Assuming your database field is called 'is_active'. Adjust if it's 'status'
      const updatedStatus = !record.is_active; 
      
      await axios.patch(`http://localhost:8000/api/documents/types/${record.id}/`, {
        is_active: updatedStatus
      });
      
      message.success(`Document type successfully ${updatedStatus ? 'enabled' : 'disabled'}!`);
      fetchTypes(); // <-- Replace with whatever function fetches your table data
    } catch (error) {
      console.error("Failed to update status:", error);
      message.error("Failed to update document type status.");
    }
  };

  // Function to Delete
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/documents/types/${id}/`);
      message.success('Document type deleted successfully!');
      fetchTypes(); // <-- Replace with whatever function fetches your table data
    } catch (error) {
      console.error("Failed to delete:", error);
      message.error("Failed to delete document type. It might be in use.");
    }
  };

  // Configure the Ant Design Table Columns
  const columns = [
    {
      title: 'Type Name',
      dataIndex: 'type_name',
      key: 'type_name',
      render: (text: string) => (
        <span className="font-medium text-gray-800">
          <FileTextOutlined className="mr-2 text-blue-500" />
          {text}
        </span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Allowed Extensions',
      dataIndex: 'allowed_extensions',
      key: 'allowed_extensions',
      render: (text: string) => <span className="font-mono text-xs bg-gray-100 p-1 rounded">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: any) => {
        // Make it bulletproof: Accept boolean true, number 1, or string "1"
        const isActuallyActive = isActive === true || isActive === 1 || isActive === "1";
        
        return (
          <Tag color={isActuallyActive ? 'green' : 'red'}>
            {isActuallyActive ? 'Active' : 'Disabled'}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          {/* Disable / Enable Button */}
          <Button 
            type="link" 
            onClick={() => handleToggleStatus(record)}
            className={record.is_active ? "text-amber-500 hover:text-amber-600" : "text-green-500 hover:text-green-600"}
            icon={record.is_active ? <StopOutlined /> : <CheckCircleOutlined />}
          >
            {record.is_active ? 'Disable' : 'Enable'}
          </Button>

          {/* Delete Button with Safety Confirmation */}
          <Popconfirm
            title="Delete Document Type"
            description="Are you sure you want to permanently delete this type?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Document Types</h1>
          <p className="text-gray-500 text-sm mt-1">Manage system-wide document classifications and allowed file types.</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600"
        >
          Create New Type
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={types} 
        rowKey="id" 
        loading={isLoading}
        className="bg-white shadow-sm rounded-lg border border-gray-100"
        pagination={{ pageSize: 10 }}
      />

      {/* CREATE MODAL */}
      <Modal
        title="Create Document Type"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} className="mt-4">
          <Form.Item
            name="type_name"
            label="Document Type Name"
            rules={[{ required: true, message: 'Please enter a name (e.g., Invoice, Contract).' }]}
          >
            <Input placeholder="e.g., HR Resume" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please enter a category.' }]}
          >
            <Input placeholder="e.g., Finance, Human Resources, Legal" />
          </Form.Item>

          <Form.Item
            name="allowed_extensions"
            label="Allowed File Extensions"
            rules={[{ required: true, message: 'Please specify allowed extensions.' }]}
            extra="Separate extensions with commas, no spaces (e.g., pdf,jpg,png)"
          >
            <Input placeholder="pdf,docx,jpg" />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Disabled" />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting} className="bg-blue-600">
              Create Document Type
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};