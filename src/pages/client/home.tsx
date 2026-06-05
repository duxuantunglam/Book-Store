import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Divider, Form, FormProps, InputNumber, Pagination, Rate, Row, Tabs } from "antd";
import 'styles/home.scss';

type FieldType = {
    mainText: string;
    subText: string;
};

const HomePage = () => {
    const [form] = Form.useForm();

    const handleChangeFilter = (changedValues: any, values: any) => {
        console.log("check", changedValues, values);
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

    };

    const onChange = (key: string) => {
        console.log(key);
    }

    const items = [
        {
            key: '1',
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: '2',
            label: `Hàng mới`,
            children: <></>,
        },
        {
            key: '3',
            label: `Giá thấp đến cao`,
            children: <></>,
        },
        {
            key: '4',
            label: `Giá cao đến thấp`,
            children: <></>,
        }
    ]

    return (
        <div className="homepage-container" style={{ maxWidth: 1440, margin: "0 auto" }}>
            <Row gutter={[20, 20]}>
                <Col md={4} sm={0} xs={0} style={{ border: "1px solid green" }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span><FilterTwoTone /> Bộ lọc tìm kiếm</span>
                        <ReloadOutlined title="Reset" onClick={() => { form.resetFields() }} />
                    </div>
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
                                <Row>
                                    <Col span={24}>
                                        <Checkbox value="A">
                                            A
                                        </Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="B">
                                            B
                                        </Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="C">
                                            C
                                        </Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="D">
                                            D
                                        </Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="E">
                                            E
                                        </Checkbox>
                                    </Col>
                                </Row>
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
                                    />
                                </Form.Item>
                                <p>-</p>
                                <Form.Item name={["range", 'to']}>
                                    <InputNumber
                                        name='to'
                                        min={0}
                                        placeholder="đến"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
                </Col>

                <Col md={20} xs={24} style={{ border: "1px solid red" }}>
                    <Row>
                        <Tabs
                            defaultActiveKey="1"
                            items={items}
                            onChange={onChange}
                        />
                    </Row>
                    <Row className='customize-row'>
                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="https://salt.tikicdn.com/cache/400x400/ts/product/1b/0d/1c/8e7a3cbb1fbb4e311d9b938fbe0caa4.jpg" />
                                </div>
                                <div className='text'>Conan</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(100000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: "#ffce3d", fontSize: 10 }} />
                                    <span>Đã bán 36</span>
                                </div>
                            </div>
                        </div>

                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="https://salt.tikicdn.com/cache/400x400/ts/product/1b/0d/1c/8e7a3cbb1fbb4e311d9b938fbe0caa4.jpg" />
                                </div>
                                <div className='text'>Conan</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(100000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: "#ffce3d", fontSize: 10 }} />
                                    <span>Đã bán 36</span>
                                </div>
                            </div>
                        </div>

                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="https://salt.tikicdn.com/cache/400x400/ts/product/1b/0d/1c/8e7a3cbb1fbb4e311d9b938fbe0caa4.jpg" />
                                </div>
                                <div className='text'>Conan</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(100000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: "#ffce3d", fontSize: 10 }} />
                                    <span>Đã bán 36</span>
                                </div>
                            </div>
                        </div>

                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="https://salt.tikicdn.com/cache/400x400/ts/product/1b/0d/1c/8e7a3cbb1fbb4e311d9b938fbe0caa4.jpg" />
                                </div>
                                <div className='text'>Conan</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(100000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: "#ffce3d", fontSize: 10 }} />
                                    <span>Đã bán 36</span>
                                </div>
                            </div>
                        </div>

                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="https://salt.tikicdn.com/cache/400x400/ts/product/1b/0d/1c/8e7a3cbb1fbb4e311d9b938fbe0caa4.jpg" />
                                </div>
                                <div className='text'>Conan</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(100000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: "#ffce3d", fontSize: 10 }} />
                                    <span>Đã bán 36</span>
                                </div>
                            </div>
                        </div>

                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="https://salt.tikicdn.com/cache/400x400/ts/product/1b/0d/1c/8e7a3cbb1fbb4e311d9b938fbe0caa4.jpg" />
                                </div>
                                <div className='text'>Conan</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(100000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: "#ffce3d", fontSize: 10 }} />
                                    <span>Đã bán 36</span>
                                </div>
                            </div>
                        </div>
                    </Row>
                    <Divider />

                    <Row style={{ display: "flex", justifyContent: "center" }}>
                        <Pagination
                            defaultCurrent={6}
                            total={500}
                            responsive
                        />
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default HomePage