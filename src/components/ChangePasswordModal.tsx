import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import axiosInstance from '../api/axiosInstance'; //[cite: 2]

export const ChangePasswordModal = ({ visible, onCancel }: { visible: boolean, onCancel: () => void }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            await axiosInstance.post('/auth/change-password/', {
                old_password: values.oldPassword,
                new_password: values.newPassword
            });
            message.success("Password changed successfully!");
            form.resetFields();
            onCancel();
        } catch (err: any) {
            message.error(err.response?.data?.error || "Failed to change password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Change Password" open={visible} onOk={handleOk} onCancel={onCancel} confirmLoading={loading}>
            <Form form={form} layout="vertical">
                <Form.Item name="oldPassword" label="Current Password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 8 }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item name="confirm" label="Confirm New Password" dependencies={['newPassword']} 
                    rules={[{ required: true }, ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                            return Promise.reject(new Error('Passwords do not match!'));
                        },
                    })]}>
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    );
};