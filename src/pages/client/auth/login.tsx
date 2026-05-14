import { Button, Divider, Form, Input, App } from 'antd';
import type { FormProps } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.scss';
import { loginAPI } from '@/services/api';
import { useCurrentApp } from '@/components/context/app.context';

type FieldType = {
    username?: string;
    password?: string;
};

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const { setIsAuthenticated, setUser } = useCurrentApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { username, password } = values;

        const res = await loginAPI(username!, password!);
        setIsSubmit(false);
        if (res?.data) {
            setIsAuthenticated?.(true);
            setUser?.(res.data.user);
            localStorage.setItem('access_token', res.data.access_token);
            message.success(res.message);
            navigate('/');
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5,
            });
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="login-page">
            <main className='main'>
                <div className='container'>
                    <section className='wrapped'>
                        <div className='heading'>
                            <h2 className='text text-large'>Đăng nhập</h2>
                            <Divider />
                        </div>
                        <Form
                            name="form-login"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="username"
                                rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item label={null}>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>

                            <Divider>Or</Divider>
                            <p className='text text-medium'>Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default LoginPage