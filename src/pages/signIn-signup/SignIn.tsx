import React, { useState, useContext } from 'react'; 
import { Form, Input, Button, Card, Alert, Checkbox } from 'antd'; // ant design components.
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router'; //useNavigate: This tool acts as a teleporter. When Django says "Yes, the password is correct,
                                            // "you call Maps('/dashboard'), and it instantly swaps the screen to the dashboard without a loading screen.
import axios from 'axios'; // To make HTTP requests.
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router';

export const SignIn: React.FC = () => { // React.FC means(typescript) this is a React Functional Component. It's a fancy way of saying "This is a piece of the UI that can be reused and has its own logic."
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null); // This is where we store any error messages that come back from Django. Initially, it's empty (null).
    
    // 1. "Tap into the Pipe" to get our login function
    const authContext = useContext(AuthContext);

    // 2. Make this function 'async' because talking to the database takes time
    const onFinish = async (values: any) => { // onFinish get user typed data and package them values.username and values.password. We will send this to Django to check if it's correct.
        setError(null); // Clear old errors

        try {
            // A. Send the form data to the Django Bouncer
            // Make sure the port (8000) matches your running Django server!
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
                username: values.username,
                password: values.password
            });

            // B. Django says YES! Grab the keys.
            const { access, refresh } = response.data;

            // C. Put the keys into the Global Vault (This updates the whole app instantly!)
            if (authContext) {
                authContext.login(access, refresh);
            }

            // D. Send them to the dashboard
            navigate('/dashboard');

        } catch (err: any) {
            // Django's Bouncer said NO.
            console.error("Login error:", err);
            setError('Invalid username or password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {/* min-h-screen: makes the background stretch to the full height of the screen. */}
            <Card title="DocFlow Secure Login" className="w-full max-w-sm shadow-xl">
                {/* card is ant design title bannar. */}
                {error && <Alert message={error} type="error" showIcon className="mb-4" />}

                <Form name="login" onFinish={onFinish} layout="vertical" initialValues={{ remember: true }}>
                    <Form.Item name="username" rules={[{ required: true, message: 'Required' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: 'Required' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <div className="flex items-center justify-between">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
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