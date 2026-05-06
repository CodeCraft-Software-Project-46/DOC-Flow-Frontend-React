import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Form, Input, Button, message, Skeleton } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { ChangePasswordForm } from './ChangePasswordForm';

export const ProfileSettingsModal = ({ visible, onCancel }: { visible: boolean, onCancel: () => void }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    // Dynamic Fetching Logic
    useEffect(() => {
        const fetchCurrentDetails = async () => {
            if (visible) {
                setFetching(true);
                try {
                    const response = await axiosInstance.get('/auth/profile/');
                    // Map the backend data directly to the form fields
                    form.setFieldsValue({
                        username: response.data.username,
                        email: response.data.email,
                        mobile: response.data.mobile,
                        address: response.data.address,
                        name: response.data.name,
                    });
                } catch (err) {
                    message.error("Could not load your latest profile details.");
                } finally {
                    setFetching(false);
                }
            }
        };

        fetchCurrentDetails();
    }, [visible, form]); // Triggered every time the modal opens

    const handleUpdate = async (values: any) => {
        setLoading(true);
        try {
            await axiosInstance.put('/auth/profile/', values);
            message.success("Profile updated successfully!");
            onCancel(); 
        } catch (err) {
            message.error("Failed to save changes.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Account Settings" open={visible} onCancel={onCancel} footer={null} width={500}>
            <Tabs defaultActiveKey="1" items={[
                {
                    key: '1',
                    label: 'General Information',
                    children: (
                        fetching ? <Skeleton active /> : (
                            <Form form={form} layout="vertical" onFinish={handleUpdate}>
                                <Form.Item name="name" label="Full Name"><Input /></Form.Item>
                                <Form.Item name="username" label="Username"><Input /></Form.Item>
                                <Form.Item name="email" label="Email Address"><Input /></Form.Item>
                                <Form.Item name="mobile" label="Mobile Number"><Input /></Form.Item>
                                <Form.Item name="address" label="Home Address"><Input.TextArea rows={3} /></Form.Item>
                                
                                <Button type="primary" htmlType="submit" loading={loading} block>Save Changes</Button>
                            </Form>
                        )
                    ),
                },
                {
                    key: '2',
                    label: 'Security',
                    children: <ChangePasswordForm />, // Your extracted password form
                },
            ]} />
        </Modal>
    );
};