import { Modal, Tabs } from "antd";
import ChangePassword from "./change.password";
import UserInfo from "./user.info";

interface Iprops {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
}

const ManageAccount = (props: Iprops) => {
    const { isModalOpen, setIsModalOpen } = props;

    const items = [
        {
            key: 'info',
            label: 'Cập nhật thông tin',
            children: <UserInfo />
        },
        {
            key: 'password',
            label: 'Đổi mật khẩu',
            children: <ChangePassword />
        }
    ];

    return (
        <Modal
            title="Quản lý tài khoản"
            open={isModalOpen}
            footer={null}
            onCancel={() => setIsModalOpen(false)}
            maskClosable={true}
            width={"60vw"}
        >
            <Tabs
                defaultActiveKey="info"
                items={items}
            />
        </Modal>
    )
}

export default ManageAccount;