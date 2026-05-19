import { FORMATE_DATE } from '@/services/helper';
import { Drawer, Descriptions, Badge } from 'antd';
import dayjs from 'dayjs';

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IUserTable | null;
    setDataViewDetail: (v: IUserTable | null) => void;
}

const DetailUser = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    return (
        <>
            <Drawer
                title="Detail User"
                width={"50vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="User Info"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="UserName">{dataViewDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Telephone">{dataViewDetail?.phone}</Descriptions.Item>
                    <Descriptions.Item label="Role" span={2}>
                        <Badge status="processing" text={dataViewDetail?.role} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE)}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
};

export default DetailUser;