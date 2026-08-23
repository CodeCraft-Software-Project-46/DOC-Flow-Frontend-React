import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Card, Upload, Button, message, Typography, Result } from 'antd';
import { InboxOutlined, CloudUploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import axios from 'axios';

const { Title, Text } = Typography;
const { Dragger } = Upload;

const ExternalUploadPage: React.FC = () => {
  const { linkId } = useParams<{ linkId: string }>();
  
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUploadChange: UploadProps['onChange'] = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    setFileList(newFileList);
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj as File);

    try {
      await axios.post(`http://localhost:8000/api/documents/upload-links/${linkId}/upload/`, formData, {
        headers: { 'Accept': 'application/json' }
      });
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Upload error:", error);
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.error || 'Upload failed.');
      } else {
        message.error('A network error occurred. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg rounded-xl border-t-4 border-t-green-500">
          <Result
            status="success"
            title="Document Uploaded Successfully!"
            subTitle="Your file has been securely submitted to the organization's workflow."
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
          <CloudUploadOutlined className="text-3xl text-white" />
        </div>
        <Title level={2} className="text-gray-800 m-0">Secure Document Upload</Title>
        <Text className="text-gray-500">Please upload your requested document below.</Text>
      </div>

      <Card className="max-w-md w-full shadow-lg rounded-xl border-none">
        <Dragger
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={() => false}
          maxCount={1}
          className="bg-gray-50 border-gray-300 hover:border-blue-500 p-8"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined className="text-blue-500 text-4xl" />
          </p>
          <p className="ant-upload-text font-medium text-gray-700 mt-4">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint text-gray-500 mt-2 text-sm">
            Only submit files requested by the organization.
          </p>
        </Dragger>

        <Button 
          type="primary" 
          size="large" 
          block 
          className="mt-6 bg-blue-600 h-12 text-lg font-medium rounded-lg"
          onClick={handleUpload}
          loading={isUploading}
          disabled={fileList.length === 0}
        >
          Submit Document
        </Button>
      </Card>
    </div>
  );
};

export default ExternalUploadPage;