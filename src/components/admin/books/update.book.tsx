import { getCategoryAPI, updateBookAPI, uploadFileAPI } from '@/services/api';
import { MAX_UPLOAD_IMAGE_SIZE } from '@/services/helper';
import { App, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Upload } from 'antd';
import type { FormProps, GetProp, InputNumberProps, UploadFile, UploadProps } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { useEffect, useState } from 'react';
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type UserUploadType = "thumbnail" | "slider";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    dataUpdate: IBookTable | null;
    setDataUpdate: (v: IBookTable | null) => void;
}

type FieldType = {
    _id: string;
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    thumbnail: any;
    slider: any;
};

const UpdateBook = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, refreshTable, dataUpdate, setDataUpdate } = props;
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const [listCategory, setListCategory] = useState<{ value: string; label: string }[]>([]);

    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const d = res.data.map((item) => {
                    return { value: item, label: item }
                });
                setListCategory(d);
            }
        };
        fetchCategory();
    }, []);

    useEffect(() => {
        if (dataUpdate) {
            const arrThumbnail = [
                {
                    uid: uuidv4(),
                    name: dataUpdate.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate?.thumbnail}`,
                }
            ];

            const arrSlider = dataUpdate?.slider?.map((item) => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                }
            });

            form.setFieldsValue({
                _id: dataUpdate._id,
                mainText: dataUpdate.mainText,
                author: dataUpdate.author,
                price: dataUpdate.price,
                category: dataUpdate.category,
                quantity: dataUpdate.quantity,
                thumbnail: arrThumbnail,
                slider: arrSlider
            });

            setFileListThumbnail(arrThumbnail as any);
            setFileListSlider(arrSlider as any);
        }
    }, [dataUpdate]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);

        const { _id, mainText, author, price, category, quantity } = values;
        const thumbnail = fileListThumbnail[0]?.name || '';
        const slider = fileListSlider.map((item) => item.name) || [];

        const res = await updateBookAPI(_id, mainText, author, price, category, quantity, thumbnail, slider);
        if (res && res.data) {
            message.success("Cập nhật sách thành công!");
            form.resetFields();
            setFileListSlider([]);
            setFileListThumbnail([]);
            setDataUpdate(null);
            setOpenModalUpdate(false);
            refreshTable();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra!',
                description: res.message
            });
        }
        setIsSubmit(false);
    };

    const formatter: InputNumberProps<number>['formatter'] = (value) => {
        const [start, end] = `${value}`.split('.') || [];
        const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${end ? `${v}.${end}` : `${v}`}`;
    };

    const getBase64 = (file: FileType): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = async (file: UploadFile, type: UserUploadType) => {
        if (type === 'thumbnail') {
            setFileListThumbnail([]);
        }
        if (type === 'slider') {
            const newSlider = fileListSlider.filter((item) => item.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    };

    const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
        if (info.file.status === 'uploading') {
            if (type === 'thumbnail') {
                setLoadingThumbnail(true);
            } else {
                setLoadingSlider(true);
            }
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            if (type === 'thumbnail') {
                setLoadingThumbnail(false);
            } else {
                setLoadingSlider(false);
            }
        }
    };

    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, 'book');

        if (res && res.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: 'done',
                url: `${import.meta.env.VITE_BASE_URL}/images/book/${res.data.fileUploaded}`,
            };
            if (type === 'thumbnail') {
                setFileListThumbnail([{ ...uploadedFile }]);
            } else {
                setFileListSlider((prev) => [...prev, { ...uploadedFile }]);
            }

            if (onSuccess) {
                onSuccess('ok');
            }
            else {
                message.error(res.message);
            }
        };
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <>
            <Modal
                title="Cập nhật sách"
                open={openModalUpdate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setFileListSlider([]);
                    setFileListThumbnail([]);
                    setDataUpdate(null);
                    setOpenModalUpdate(false);
                }}
                destroyOnClose={true}
                okButtonProps={{ loading: isSubmit }}
                okText="Cập nhật"
                cancelText="Huỷ"
                confirmLoading={isSubmit}
                width={"50vw"}
                maskClosable={false}
            >
                <Divider />

                <Form
                    form={form}
                    name="form-create-book"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Form.Item<FieldType>
                            hidden
                            labelCol={{ span: 24 }}
                            label="_id"
                            name="_id"
                        >
                            <Input disabled />
                        </Form.Item>

                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Tên sách"
                                name="mainText"
                                rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Tác giả"
                                name="author"
                                rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Giá tiền"
                                name="price"
                                rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={formatter}
                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                                    addonAfter="VND"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Thể loại"
                                name="category"
                                rules={[{ required: true, message: 'Vui lòng chọn thể loại sách!' }]}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Số lượng"
                                name="quantity"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={formatter}
                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Hình ảnh bìa"
                                name="thumbnail"
                                rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh bìa sách!' }]}

                                //convert value from Upload => form
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-circle"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'thumbnail')}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemove(file, 'thumbnail')}
                                    fileList={fileListThumbnail}
                                >
                                    <div>
                                        {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Slider"
                                name="slider"
                                rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh slider!' }]}

                                //convert value from Upload => form
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    multiple
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    customRequest={(options) => handleUploadFile(options, 'slider')}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemove(file, 'slider')}
                                    fileList={fileListSlider}
                                >
                                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </ Row>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateBook;