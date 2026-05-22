import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Modal, Table, Upload } from 'antd';

const { Dragger } = Upload;

interface IProps {
    openModalImport: boolean;
    setOpenModalImport: (v: boolean) => void;
    refreshTable: () => void;
}

const ImportUser = (props: IProps) => {
    const { openModalImport, setOpenModalImport, refreshTable } = props;

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        customRequest: ({ file, onSuccess }) => {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 1000);
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <>
            <Modal
                title="Import Data Users"
                width={"50vw"}
                open={openModalImport}
                onOk={() => { setOpenModalImport(false); refreshTable(); }}
                onCancel={() => {
                    setOpenModalImport(false);
                }}
                okText="Import"
                cancelText="Cancel"
                maskClosable={false}    //do not close modal when click outside
                okButtonProps={{ disabled: true }}
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or
                        other banned files.
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        title={() => <span>"Dữ liệu Upload"</span>}
                        columns={[
                            { dataIndex: 'fullName', title: 'Tên hiển thị' },
                            { dataIndex: 'email', title: 'Email' },
                            { dataIndex: 'phone', title: 'Số điện thoại' }
                        ]}
                    />
                </div>
            </Modal>
        </>
    );
};

export default ImportUser;