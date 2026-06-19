import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { App, Modal, notification, Table, Upload } from 'antd';
import { useState } from 'react';
import Exceljs from 'exceljs';
import { bulkCreateUsersAPI } from '@/services/api';
import templateFile from '@/assets/template/users.xlsx?url';

const { Dragger } = Upload;

interface IProps {
    openModalImport: boolean;
    setOpenModalImport: (v: boolean) => void;
    refreshTable: () => void;
}

interface IDataImport {
    fullName: string;
    email: string;
    phone: string;
}

const ImportUser = (props: IProps) => {
    const { openModalImport, setOpenModalImport, refreshTable } = props;
    const { message } = App.useApp();
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

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
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    const workbook = new Exceljs.Workbook();
                    const arrayBuffer = await file.arrayBuffer();
                    await workbook.xlsx.load(arrayBuffer);

                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        // read first row as data keys
                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;
                        let keys = firstRow.values as any[];
                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            let values = row.values as any[];
                            let obj: any = {};
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        })

                    });

                    jsonData = jsonData.map((item, index) => ({
                        ...item,
                        id: index + 1
                    }));

                    setDataImport(jsonData);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleImport = async () => {
        setIsSubmit(true);
        const dataSubmit = dataImport.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
        }));

        const res = await bulkCreateUsersAPI(dataSubmit);
        if (res.data) {
            notification.success(
                {
                    message: "Bulk create users successfully!",
                    description: `Success = ${res.data.createdCount}. Error = ${dataSubmit.length - res.data.createdCount}`
                }
            );
        }

        setIsSubmit(false);
        setOpenModalImport(false);
        setDataImport([]);
        refreshTable();
    }

    return (
        <>
            <Modal
                title="Import Data Users"
                width={"50vw"}
                open={openModalImport}
                onOk={() => { handleImport() }}
                onCancel={() => {
                    setOpenModalImport(false);
                    setDataImport([]);
                }}
                okText="Import"
                cancelText="Cancel"
                maskClosable={false}    //do not close modal when click outside
                okButtonProps={{
                    disabled: dataImport.length > 0 ? false : true,
                    loading: isSubmit
                }}
                destroyOnClose={true}   //destroy modal when closed
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xlsx, .xls files. Please click the link below to download sample file format.
                        <br />
                        <a
                            onClick={e => e.stopPropagation()}
                            href={templateFile}
                            download
                        >
                            Download Sample File
                        </a>
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        rowKey={"id"}
                        title={() => <span>"Dữ liệu Upload"</span>}
                        dataSource={dataImport}
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