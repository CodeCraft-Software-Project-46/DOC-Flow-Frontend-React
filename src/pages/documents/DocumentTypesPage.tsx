import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Tag, Switch, message } from 'antd';
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons';
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