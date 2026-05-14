import { Button, Divider, Form, Input, App } from 'antd';
import type { FormProps } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.scss';
import { registerAPI } from '@/services/api';

type FieldType = {
    fullname?: string;
    email?: string;
    password?: string;
    phone?: string;
};

const RegisterPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message } = App.useApp();
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { fullname, email, password, phone } = values;

        const res = await registerAPI(fullname!, email!, password!, phone!);
        if (res.data) {
            message.success(res.message);
            navigate('/login');
        } else {
            message.error(res.error || 'Đăng ký thất bại');
        }
        setIsSubmit(false);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="register-page">
            <main className='main'>
                <div className='container'>
                    <section className='wrapped'>
                        <div className='heading'>
                            <h2 className='text text-large'>Đăng ký tài khoản</h2>
                            <Divider />
                        </div>
                        <Form
                            name="form-register"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Họ tên"
                                name="fullname"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Vui lòng nhập đúng định dạng email!' }
                                ]}
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

                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item label={null}>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng ký
                                </Button>
                            </Form.Item>

                            <Divider>Or</Divider>
                            <p className='text text-medium'>Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default RegisterPage