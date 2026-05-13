import React, { useState, useEffect } from 'react';          // React hooks for state management and lifecycle handling
import { Modal, Form, Select, Button, Upload, message } from 'antd';          // Ant Design UI components
import { InboxOutlined } from '@ant-design/icons';           // Icon for drag-and-drop upload area
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';           // TypeScript types for upload handling
import axios from 'axios';          // Library for making HTTP requests to backend APIs

const { Dragger } = Upload;       // Ant Design drag-and-drop upload component
const { Option } = Select;       // Ant Design Select option component

interface ManualUploadModalProps {      // Props expected by ManualUploadModal component
  isOpen: boolean;        // Controls visibility of the modal
  onClose: () => void;       // Function to close the modal
}

// Interface representing document type data from backend
interface DocumentTypeRecord {
  id: number;
  type_name: string;
  allowed_extensions: string;   // Comma-separated extensions (e.g., "pdf,jpg,png")
}

// Interface representing workflow data from backend
interface WorkflowRecord {
  id: string;
  name: string;
}

const ManualUploadModal: React.FC<ManualUploadModalProps> = ({ isOpen, onClose }) => {   // Functional component with props
  const [form] = Form.useForm();     // Form instance for validation and resetting
  const [fileList, setFileList] = useState<UploadFile[]>([]);    // Stores uploaded file list (only one file allowed)
  const [isUploading, setIsUploading] = useState(false);    // Tracks upload loading state
  
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeRecord[]>([]);     // Stores document types fetched from backend
  const [workflows, setWorkflows] = useState<WorkflowRecord[]>([]);     // Stores workflows fetched from backend
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);    // Loading state for dropdown data

  // States for dynamic file validation
  const [acceptedExts, setAcceptedExts] = useState<string>("");      // Stores allowed file extensions for selected type
  const [hintText, setHintText] = useState<string>("Select a Document Type first");     // UI hint text for user guidance

  useEffect(() => {
    if (isOpen) {       // Trigger only when modal opens
      const fetchDropdownData = async () => {              // Fetch document types and workflows from backend
        setIsLoadingDropdowns(true);                     // Start loading indicator
        try {
          const response = await axios.get('http://localhost:8000/api/documents/upload/dropdowns/');         // API call to fetch dropdown data
          setDocumentTypes(response.data.document_types);  // Store document types
          setWorkflows(response.data.workflows);      // Store workflows
        } catch (error) {           
          console.error("Failed to fetch dropdowns", error);            // Log error for debugging
          message.error("Failed to load Document Types and Workflows.");           // Show user-friendly error
        } finally {
          setIsLoadingDropdowns(false);         // Stop loading indicator
        }
      };
      fetchDropdownData();          // Execute fetch function
    }
  }, [isOpen]);

  // Updates allowed file types when document type is selected
  const handleDocumentTypeChange = (value: number) => {            
    const selectedType = documentTypes.find(t => t.id === value);            // Find selected document type
    if (selectedType && selectedType.allowed_extensions) {              
      // Convert "pdf,jpg,png" → ".pdf,.jpg,.png" for HTML input accept attribute
      const formattedExts = selectedType.allowed_extensions             
        .split(',')
        .map(ext => `.${ext.trim().toLowerCase()}`)    
        .join(',');
      
      setAcceptedExts(formattedExts);            // Set allowed extensions
      setHintText(`Valid formats: ${selectedType.allowed_extensions.toUpperCase()}`);            // Update hint text
    }
  };

  // Ensures only the latest uploaded file is kept
  const handleUploadChange: UploadProps['onChange'] = (info) => {           
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);          // Keep only one file
    setFileList(newFileList);
  };

  // Validates file before upload (frontend validation)
  const beforeUpload = (file: File) => {
    if (!acceptedExts) {                  // Block if document type not selected
      message.error("Please select a Document Type before attaching a file.");
      return Upload.LIST_IGNORE;           
    }

    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();          // Extract file extension
    const allowedArr = acceptedExts.split(',');

    if (!allowedArr.includes(fileExt)) {            
      message.error(`File type ${fileExt} is not allowed! ${hintText}`);           
      return Upload.LIST_IGNORE;
    }

    return false;                     // Prevent auto-upload (manual submission)
  };

  // Handles form submission and sends data to backend
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
      
      // Reset form and states after success
      form.resetFields();                 
      setFileList([]);                      
      setAcceptedExts("");               
      setHintText("Select a Document Type first");                
      onClose();               

    } catch (error) {
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
    <Modal title="Upload Document" open={isOpen} onCancel={onClose} footer={null} destroyOnClose>            
      <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">               
        
        <Form.Item name="document_type_id" label="Document Type" rules={[{ required: true }]}>                  
          <Select 
            placeholder="Select Document Type..."                
            loading={isLoadingDropdowns}                     
            onChange={handleDocumentTypeChange}            
          >
            {documentTypes.map((type) => (                     
              <Option key={type.id} value={type.id}>{type.type_name}</Option>           
            ))}
          </Select>
        </Form.Item>            

        <Form.Item name="workflow_id" label="Assign to Workflow" rules={[{ required: true }]}>                  
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
            beforeUpload={beforeUpload} 
            accept={acceptedExts}       
            maxCount={1}
            disabled={!acceptedExts}    
            className="bg-gray-50 border-gray-300 hover:border-blue-500"          
          >
            <p className="ant-upload-drag-icon">               
              <InboxOutlined className={`text-blue-500 ${!acceptedExts && 'opacity-50'}`} />                       
            </p>
            <p className="ant-upload-text font-medium text-gray-700">                  
              {acceptedExts ? "Click or drag file to this area to upload" : "Awaiting Document Type selection..."}           
            </p>
            <p className="ant-upload-hint text-gray-500">            
              {hintText}                 
            </p>
          </Dragger>
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">                
          <Button onClick={onClose} disabled={isUploading}>Cancel</Button>              
          <Button type="primary" htmlType="submit" loading={isUploading} className="bg-blue-600">          
            Upload & Process
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ManualUploadModal;