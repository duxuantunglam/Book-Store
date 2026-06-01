import { FORMATE_DATE } from '@/services/helper';
import { Drawer, Descriptions, Badge, Image, GetProp, UploadProps, UploadFile, Upload, Divider } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IBookTable | null;
    setDataViewDetail: (v: IBookTable | null) => void;
}

const DetailBook = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    useEffect(() => {
        if (dataViewDetail) {
            let imgThumbnail: any = {}, imgSlider: UploadFile[] = [];
            if (dataViewDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataViewDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewDetail?.thumbnail}`
                };

                if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
                    imgSlider = dataViewDetail.slider.map((item) => ({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                    }));
                }
                setFileList([imgThumbnail, ...imgSlider]);
            } else {
                setFileList([]);
            }
        }
    }, [dataViewDetail]);

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    return (
        <>
            <Drawer
                title="Detail Book"
                width={"70vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Book Info"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Book Name">{dataViewDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Author">{dataViewDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Price">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataViewDetail?.price || 0)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Category" span={2}>
                        <Badge status="processing" text={dataViewDetail?.category} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE)}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left">Book Image</Divider>
                <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={{ showRemoveIcon: false }}
                >
                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer>
        </>
    );
};

export default DetailBook;