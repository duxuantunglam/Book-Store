import { createUsersAPI } from '@/services/api';
import { App, Divider, Form, Input, Modal } from 'antd';
import type { FormProps } from 'antd';
import { useState } from 'react';

interface IProps {
    openModalCreateUser: boolean;
    setOpenModalCreateUser: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    fullname: string;
    email: string;
    password: string;
    phone: string;
};

const CreateUser = (props: IProps) => {
    const { openModalCreateUser, setOpenModalCreateUser, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { fullname, email, password, phone } = values;
        setIsSubmit(true);

        const res = await createUsersAPI(fullname, email, password, phone);
        if (res && res.data) {
            message.success("Tạo mới người dùng thành công!");
            form.resetFields();
            setOpenModalCreateUser(false);
            refreshTable();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra!',
                description: res.message
            });
        }
        setIsSubmit(false);
    };

    return (
        <>
            <Modal
                title="Thêm mới người dùng"
                open={openModalCreateUser}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenModalCreateUser(false);
                    form.resetFields();
                }}
                okText="Tạo mới"
                cancelText="Huỷ"
                confirmLoading={isSubmit}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Tên hiển thị"
                        name="fullname"
                        rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
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
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CreateUser;