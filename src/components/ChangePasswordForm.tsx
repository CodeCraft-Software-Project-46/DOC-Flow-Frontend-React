import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import axiosInstance from '../api/axiosInstance'; //

export const ChangePasswordForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await axiosInstance.post('/auth/change-password/', {
                old_password: values.oldPassword,
                new_password: values.newPassword
            });
            message.success("Password changed successfully!");
            form.resetFields();
        } catch (err: any) {
            message.error(err.response?.data?.error || "Failed to change password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="oldPassword" label="Current Password" rules={[{ required: true }]}>
                <Input.Password placeholder="Enter current password" />
            </Form.Item>

            <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 8 }]}>
                <Input.Password placeholder="Enter new password (min 8 chars)" />
            </Form.Item>

            <Form.Item 
                name="confirm" 
                label="Confirm New Password" 
                dependencies={['newPassword']} 
                rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                            return Promise.reject(new Error('Passwords do not match!'));
                        },
                    })
                ]}
            >
                <Input.Password placeholder="Repeat new password" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block className="bg-blue-600">
                    Update Password
                </Button>
            </Form.Item>
        </Form>
    );
};