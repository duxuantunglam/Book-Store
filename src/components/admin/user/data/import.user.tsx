import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { App, Modal, Table, Upload } from 'antd';
import { useState } from 'react';
import Exceljs from 'exceljs';

const { Dragger } = Upload;

interface IProps {
    openModalImport: boolean;
    setOpenModalImport: (v: boolean) => void;
}

interface IDataImport {
    fullName: string;
    email: string;
    phone: string;
}

const ImportUser = (props: IProps) => {
    const { openModalImport, setOpenModalImport } = props;
    const { message } = App.useApp();
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);

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
                console.log(info.file, info.fileList);
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

    return (
        <>
            <Modal
                title="Import Data Users"
                width={"50vw"}
                open={openModalImport}
                onOk={() => { setOpenModalImport(false); }}
                onCancel={() => {
                    setOpenModalImport(false);
                    setDataImport([]);
                }}
                okText="Import"
                cancelText="Cancel"
                maskClosable={false}    //do not close modal when click outside
                okButtonProps={{ disabled: dataImport.length > 0 ? false : true }}
                destroyOnClose={true}   //destroy modal when closed
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