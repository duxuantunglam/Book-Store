import { getUsersAPI } from '@/services/api';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { useRef, useState } from 'react';

const columns: ProColumns<IUserTable>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48
    },
    {
        title: 'ID',
        dataIndex: '_id',
        hideInSearch: true,
        render(dom, entity, index, action, schema) {
            return <a href="#">{entity._id}</a>;
        },
    },
    {
        title: 'Full Name',
        dataIndex: 'fullName'
    },
    {
        title: 'Email',
        dataIndex: 'email',
        copyable: true
    },
    {
        title: 'Phone',
        dataIndex: 'phone'
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        valueType: 'date',
        sorter: true,
        hideInSearch: true,
    },
    {
        title: 'Created At',
        dataIndex: 'createdAtRange',
        valueType: 'dateRange',
        hideInTable: true
    },
    {
        title: 'Action',
        dataIndex: 'action',
        hideInSearch: true,
        render(dom, entity, index, action, schema) {
            return (
                <>
                    <EditTwoTone
                        twoToneColor="#f57800"
                        style={{ cursor: 'pointer', marginRight: 15 }}
                    />
                    <DeleteTwoTone
                        twoToneColor="#ff4d4f"
                        style={{ cursor: 'pointer' }}
                    />
                </>
            )
        },
    }
];

type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string
}

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });
    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`;
                        }
                        if (params.email) {
                            query += `&email=/${params.email}/i`;
                        }

                        const createdDateRange = params.createdAtRange;
                        if (createdDateRange) {
                            query += `&createdAt>=${createdDateRange[0]}&createdAt<=${createdDateRange[1]}`;
                        }

                        if (sort && sort.createdAt) {
                            query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`;
                        }
                    }

                    const res = await getUsersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                    }
                    return {
                        data: res.data?.result,
                        page: res.data?.meta.current,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}
                rowKey="_id"
                form={{
                    syncToUrl: (values, type) => {
                        if (type === 'get') {
                            return {
                                ...values,
                                created_at: [values.startTime, values.endTime],
                            };
                        }
                        return values;
                    },
                }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} of {total} items</div>) }
                }}
                dateFormatter="string"
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
        </>
    );
};

export default TableUser;