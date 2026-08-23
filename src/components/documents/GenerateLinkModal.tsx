import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, InputNumber, Button, message } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

interface DropdownData {
  document_types: { id: number; type_name: string }[];
  workflows: { id: string; name: string }[];
}

interface GenerateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const GenerateLinkModal: React.FC<GenerateLinkModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [dropdowns, setDropdowns] = useState<DropdownData>({ document_types: [], workflows: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Dropdown data when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      axios.get('http://localhost:8000/api/documents/upload/dropdowns/')
        .then(res => setDropdowns(res.data))
        .catch(() => message.error("Failed to load dropdown data."))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  const handleFinish = async (values: any) => {
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:8000/api/documents/upload-links/generate/', {
        document_type_id: values.document_type_id,
        workflow_id: values.workflow_id,
        expiry_days: values.expiry_days || 7
      });
      message.success("Upload link generated successfully!");
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error: any) {
      message.error(error.response?.data?.error || "Failed to generate link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Generate API Upload Link" open={isOpen} onCancel={onClose} footer={null} destroyOnHidden>
      <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
        <Form.Item name="document_type_id" label="Document Type" rules={[{ required: true, message: 'Required' }]}>
          <Select placeholder="Select Document Type..." loading={isLoading}>
            {dropdowns.document_types.map(t => <Option key={t.id} value={t.id}>{t.type_name}</Option>)}
          </Select>
        </Form.Item>
        
        <Form.Item name="workflow_id" label="Target Workflow" rules={[{ required: true, message: 'Required' }]}>
          <Select placeholder="Select Workflow..." loading={isLoading}>
            {dropdowns.workflows.map(w => <Option key={w.id} value={w.id}>{w.name}</Option>)}
          </Select>
        </Form.Item>
        
        <Form.Item name="expiry_days" label="Expiration (Days)" initialValue={7} extra="Link expires after this period.">
          <InputNumber min={1} max={90} className="w-full" prefix={<LinkOutlined />} />
        </Form.Item>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting} className="bg-purple-600">Generate Link</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default GenerateLinkModal;