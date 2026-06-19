import { getOrdersAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useRef, useState } from "react";

type TSearch = {
    name: string;
    createdAt: string;
    createdAtRange: string;
}

const TableOrder = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });

    const columns: ProColumns<IOrderTable>[] = [
        {
            dataIndex: "index",
            valueType: "indexBorder",
            width: 48,
        },
        {
            title: 'ID',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a href='#'>
                        {entity._id}
                    </a>
                )
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Giá tiền',
            dataIndex: 'totalPrice',
            hideInSearch: true,
            sorter: true,
            render(dom, entity, index, action, schema) {
                return (
                    <span>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.totalPrice)}
                    </span>
                )
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            sorter: true,
            valueType: 'date',
            hideInSearch: true,
        },
    ];

    return (
        <>
            <ProTable<IOrderTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.name) {
                            query += `&name=/${params.name}/i`;
                        }

                        const createdDateRange = dateRangeValidate(params.createdAtRange);
                        if (createdDateRange) {
                            query += `&createdAt>=${createdDateRange[0]}&createdAt<=${createdDateRange[1]}`;
                        }
                    }

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`;
                    } else query += `&sort=-createdAt`;

                    const res = await getOrdersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} of {total} items</div>) }
                }}
                headerTitle="Table order"
            />
        </>
    )
}

export default TableOrder;