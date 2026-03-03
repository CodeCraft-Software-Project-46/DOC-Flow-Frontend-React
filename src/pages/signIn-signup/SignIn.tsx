import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

export const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const onFinish = (values: any) => {
        // FAKE AUTH LOGIC (Replace with API later)
        if (values.username === "admin" && values.password === "1234") {
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("userRole", "Admin"); // Simulating an Admin user
            navigate('/dashboard');
        } else {
            setError('Invalid username or password (Try: admin / 1234)');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card title="DocFlow Secure Login" className="w-full max-w-sm shadow-xl">
                {error && <Alert message={error} type="error" showIcon className="mb-4" />}

                <Form name="login" onFinish={onFinish} layout="vertical" initialValues={{ remember: true }}>
                    <Form.Item name="username" rules={[{ required: true, message: 'Required' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: 'Required' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full bg-blue-600" size="large">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};