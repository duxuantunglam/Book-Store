import MobileFilter from "@/components/client/book/mobile.filter";
import { getBooksAPI, getCategoryAPI } from "@/services/api";
import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Divider, Form, FormProps, InputNumber, Pagination, Rate, Row, Spin, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import 'styles/book.scss';

type FieldType = {
    range: {
        from: number;
        to: number;
    }
    category: string[];
};

const HomePage = () => {
    const navigate = useNavigate();

    const [listCategory, setListCategory] = useState<{ label: string, value: string }[]>([]);
    const [listBook, setListBook] = useState<IBookTable[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [total, setTotal] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const [sortQuery, setSortQuery] = useState<string>("sort=-sold");

    const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);

    const [form] = Form.useForm();

    useEffect(() => {
        const initCategory = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const d = res.data.map((item) => ({
                    label: item,
                    value: item
                }));
                setListCategory(d);
            }
        };
        initCategory();
    }, []);

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery]);

    const fetchBook = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await getBooksAPI(query);
        if (res && res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    }

    const handleOnChangePage = (pagination: { current: number; pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    }

    const handleChangeFilter = (changedValues: any, values: any) => {
        if (changedValues.category) {
            const category = values.category;
            if (category && category.length > 0) {
                const filterCategory = category.join(",");
                setFilter(`category=${filterCategory}`);
            } else {
                setFilter("");
            }
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let filterPrice = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
            if (values?.category?.length) {
                const category = values?.category?.join(",");
                filterPrice += `&category=${category}`;
            }
            setFilter(filterPrice);
        }
    };

    const items = [
        {
            key: 'sort=-sold',
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: 'sort=-updated_at',
            label: `Hàng mới`,
            children: <></>,
        },
        {
            key: 'sort=price',
            label: `Giá thấp đến cao`,
            children: <></>,
        },
        {
            key: 'sort=-price',
            label: `Giá cao đến thấp`,
            children: <></>,
        }
    ]

    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className="homepage-container" style={{ maxWidth: 1440, margin: "0 auto" }}>
                    <Row gutter={[20, 20]}>
                        <Col md={4} sm={0} xs={0}>
                            <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>
                                        <FilterTwoTone />
                                        <span style={{ fontWeight: '500' }}>Bộ lọc tìm kiếm</span>
                                    </span>
                                    <ReloadOutlined
                                        title="Reset"
                                        onClick={() => {
                                            form.resetFields();
                                            setFilter("");
                                        }} />
                                </div>
                                <Divider />

                                <Form
                                    onFinish={onFinish}
                                    form={form}
                                    onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                                >
                                    <Form.Item
                                        name="category"
                                        label="Danh mục sản phẩm"
                                        labelCol={{ span: 24 }}
                                    >
                                        <Checkbox.Group>
                                            {listCategory?.map((item, index) => {
                                                return (
                                                    <Col span={24} key={`index-${index}`} style={{ marginBottom: 5 }}>
                                                        <Checkbox value={item.value}>
                                                            {item.label}
                                                        </Checkbox>
                                                    </Col>
                                                );
                                            })}
                                        </Checkbox.Group>
                                    </Form.Item>
                                    <Divider />
                                    <Form.Item
                                        label="Khoảng giá (VND)"
                                        labelCol={{ span: 24 }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Form.Item name={["range", 'from']}>
                                                <InputNumber
                                                    name='from'
                                                    min={0}
                                                    placeholder="từ"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                            <p>-</p>
                                            <Form.Item name={["range", 'to']}>
                                                <InputNumber
                                                    name='to'
                                                    min={0}
                                                    placeholder="đến"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div>
                                            <Button
                                                onClick={() => form.submit()}
                                                style={{ width: "100%" }}
                                                type="primary"
                                            >
                                                Áp dụng
                                            </Button>
                                        </div>
                                    </Form.Item>
                                    <Divider />
                                    <Form.Item
                                        label="Đánh giá"
                                        labelCol={{ span: 24 }}
                                    >
                                        <div>
                                            <Rate value={5} disabled style={{ color: "#ffce3d", fontSize: 13 }} />
                                            <span className="ant-rate-text"></span>
                                        </div>
                                        <div>
                                            <Rate value={4} disabled style={{ color: "#ffce3d", fontSize: 13 }} />
                                            <span className="ant-rate-text">trở lên</span>
                                        </div>
                                        <div>
                                            <Rate value={3} disabled style={{ color: "#ffce3d", fontSize: 13 }} />
                                            <span className="ant-rate-text">trở lên</span>
                                        </div>
                                        <div>
                                            <Rate value={2} disabled style={{ color: "#ffce3d", fontSize: 13 }} />
                                            <span className="ant-rate-text">trở lên</span>
                                        </div>
                                        <div>
                                            <Rate value={1} disabled style={{ color: "#ffce3d", fontSize: 13 }} />
                                            <span className="ant-rate-text">trở lên</span>
                                        </div>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Col>

                        <Col md={20} xs={24} style={{ border: "1px solid red" }}>
                            <Spin spinning={isLoading} tip="Loading...">
                                <div style={{ padding: "20px", background: "#fff", borderRadius: 5, marginBottom: 20 }}>
                                    <Row>
                                        <Tabs
                                            defaultActiveKey="sort=-sold"
                                            items={items}
                                            onChange={(value) => setSortQuery(value)}
                                            style={{ overflowX: "auto" }}
                                        />
                                        <Col xs={24} md={0}>
                                            <div style={{ marginBottom: 20 }}>
                                                <span onClick={() => setShowMobileFilter(true)}>
                                                    <FilterTwoTone />
                                                    <span style={{ fontWeight: '500', marginLeft: 5, fontSize: 14 }}>Bộ lọc</span>
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='customize-row'>
                                        {listBook.map((item, index) => {
                                            return (
                                                <div
                                                    onClick={() => navigate(`/book/${item._id}`)}
                                                    className="column" key={`book-${index}`}>
                                                    <div className='wrapper'>
                                                        <div className='thumbnail'>
                                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} />
                                                        </div>
                                                        <div className='text' title={item.mainText}>
                                                            {item.mainText}
                                                        </div>
                                                        <div className='price'>
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                        </div>
                                                        <div className='rating'>
                                                            <Rate value={5} disabled style={{ color: "#ffce3d", fontSize: 10 }} />
                                                            <span>Đã bán {item?.sold ?? 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                    </Row>

                                    <div style={{ marginTop: 30 }}></div>

                                    <Row style={{ display: "flex", justifyContent: "center" }}>
                                        <Pagination
                                            current={current}
                                            total={total}
                                            pageSize={pageSize}
                                            responsive
                                            onChange={(page, pageSize) => handleOnChangePage({ current: page, pageSize: pageSize })}
                                        />
                                    </Row>
                                </div>
                            </Spin>
                        </Col>
                    </Row>
                </div>
            </div >

            <MobileFilter
                isOpen={showMobileFilter}
                setIsOpen={setShowMobileFilter}
                handleChangeFilter={handleChangeFilter}
                listCategory={listCategory}
                onFinish={onFinish}
            />
        </>
    )
}

export default HomePage