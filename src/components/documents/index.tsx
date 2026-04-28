import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ManualUploadModal from '../../components/documents/ManualUploadModal';

const DocumentsPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-blue-600"
        >
          Upload Document
        </Button>
      </div>

      {/* Your table or document grid would go here */}

      <ManualUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
};

export default DocumentsPage;