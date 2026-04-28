import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Button, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import axios from 'axios';

const { Dragger } = Upload;
const { Option } = Select;

interface ManualUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define TypeScript interfaces for our database records
interface DocumentTypeRecord {
  id: number;
  type_name: string;
}

interface WorkflowRecord {
  id: string; // Remember Awishka uses UUIDs!
  name: string;
}

const ManualUploadModal: React.FC<ManualUploadModalProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // --- NEW: State for our dynamic dropdowns ---
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeRecord[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowRecord[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

  // --- NEW: Fetch data when modal opens ---
  useEffect(() => {
    if (isOpen) {
      const fetchDropdownData = async () => {
        setIsLoadingDropdowns(true);
        try {
          const response = await axios.get('http://localhost:8000/api/documents/upload/dropdowns/');
          setDocumentTypes(response.data.document_types);
          setWorkflows(response.data.workflows);
        } catch (error) {
          console.error("Failed to fetch dropdowns", error);
          message.error("Failed to load Document Types and Workflows.");
        } finally {
          setIsLoadingDropdowns(false);
        }
      };
      
      fetchDropdownData();
    }
  }, [isOpen]); // This effect runs every time 'isOpen' changes

  const handleUploadChange: UploadProps['onChange'] = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    setFileList(newFileList);
  };

  const handleFinish = async (values: any) => {
    if (fileList.length === 0) {
      message.error("Please attach a file before submitting.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj as File);
    formData.append('document_type_id', values.document_type_id);
    formData.append('workflow_id', values.workflow_id);

    try {
      const response = await axios.post('http://localhost:8000/api/documents/upload/manual/', formData, {
        headers: { 'Accept': 'application/json' }
      });

      message.success(response.data.message || 'Document successfully uploaded and routed!');
      form.resetFields();
      setFileList([]);
      onClose(); 

    } catch (error) {
      console.error("Upload error:", error);
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.error || 'Upload failed.');
      } else {
        message.error('A network error occurred.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      title="Upload Document"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
        <Form.Item
          name="document_type_id"
          label="Document Type"
          rules={[{ required: true, message: 'Please select a document type' }]}
        >
          {/* We add a loading state so the user knows data is fetching */}
          <Select placeholder="Select Document Type..." loading={isLoadingDropdowns}>
            {documentTypes.map((type) => (
              <Option key={type.id} value={type.id}>{type.type_name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="workflow_id"
          label="Assign to Workflow"
          rules={[{ required: true, message: 'Please select a target workflow' }]}
        >
          <Select placeholder="Select Target Workflow..." loading={isLoadingDropdowns}>
            {workflows.map((wf) => (
              <Option key={wf.id} value={wf.id}>{wf.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Attach File" required>
          <Dragger
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false}
            maxCount={1}
            className="bg-gray-50 border-gray-300 hover:border-blue-500"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined className="text-blue-500" />
            </p>
            <p className="ant-upload-text font-medium text-gray-700">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint text-gray-500">
              Supports single file upload. Valid formats: PDF, PNG, JPG.
            </p>
          </Dragger>
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isUploading} className="bg-blue-600">
            Upload & Process
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ManualUploadModal;