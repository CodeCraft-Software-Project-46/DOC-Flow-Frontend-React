import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

interface WorkflowRecord {
  id: string;
  name: string;
}

interface CreatePipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePipelineModal: React.FC<CreatePipelineModalProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [workflows, setWorkflows] = useState<WorkflowRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

  // Fetch workflows for the dropdown when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchDropdownData = async () => {
        setIsLoadingDropdowns(true);
        try {
          const response = await axios.get('http://localhost:8000/api/documents/upload/dropdowns/');
          setWorkflows(response.data.workflows);
        } catch (error) {
          console.error("Failed to fetch workflows:", error);
          message.error("Failed to load Workflows.");
        } finally {
          setIsLoadingDropdowns(false);
        }
      };
      fetchDropdownData();
    }
  }, [isOpen]);

  const handleFinish = async (values: any) => {
    setIsSubmitting(true);
    const selectedWorkflow = workflows.find(wf => wf.id === values.workflow_id);

    const payload = {
      folder_name: values.folder_name,
      workflow_id: values.workflow_id,
      workflow_name: selectedWorkflow ? selectedWorkflow.name : 'Unknown Workflow'
    };

    try {
      const response = await axios.post('http://localhost:8000/api/documents/mappings/create/', payload);
      message.success(response.data.message || 'Pipeline created successfully!');
      form.resetFields();
      onClose(); // Close the modal on success
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

  return (
    <Modal
      title="Create Automated Pipeline"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
        <Form.Item
          name="folder_name"
          label="Google Drive Folder Name"
          rules={[
            { required: true, message: 'Please enter a folder name.' },
            { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Use only letters, numbers, dashes, or underscores (No spaces).' }
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
          <Select placeholder="Select Workflow..." loading={isLoadingDropdowns}>
            {workflows.map((wf) => (
              <Option key={wf.id} value={wf.id}>{wf.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting} className="bg-blue-600">
            Create & Map Folder
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreatePipelineModal;