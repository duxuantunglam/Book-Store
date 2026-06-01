import { updateUserAPI } from '@/services/api';
import { App, Divider, Form, Input, Modal } from 'antd';
import type { FormProps } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
    openModalUpdateUser: boolean;
    setOpenModalUpdateUser: (v: boolean) => void;
    refreshTable: () => void;
    dataUpdate: IUserTable | null;
    setDataUpdate: (v: IUserTable | null) => void;
}

type FieldType = {
    _id: string;
    email: string;
    fullname: string;
    phone: string;
};

const UpdateUser = (props: IProps) => {
    const { openModalUpdateUser, setOpenModalUpdateUser, refreshTable, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                _id: dataUpdate._id,
                fullname: dataUpdate.fullName,
                email: dataUpdate.email,
                phone: dataUpdate.phone
            });
        } else {
            form.resetFields();
        }
    }, [dataUpdate]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { _id, fullname, phone } = values;
        setIsSubmit(true);

        const res = await updateUserAPI(_id, fullname, phone);
        if (res && res.data) {
            message.success("Cập nhật người dùng thành công!");
            form.resetFields();
            setOpenModalUpdateUser(false);
            setDataUpdate(null);
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
                title="Cập nhật người dùng"
                open={openModalUpdateUser}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenModalUpdateUser(false);
                    setDataUpdate(null);
                    form.resetFields();
                }}
                okText="Cập nhật"
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
                        hidden
                        labelCol={{ span: 24 }}
                        label="_id"
                        name="_id"
                        rules={[{ required: true, message: 'Vui lòng nhập _id!' }]}
                    >
                        <Input disabled />
                    </Form.Item>

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
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Vui lòng nhập đúng định dạng email!' }
                        ]}
                    >
                        <Input disabled />
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

export default UpdateUser;