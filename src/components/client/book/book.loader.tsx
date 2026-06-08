import { Col, Row, Skeleton } from "antd";

const BookLoader = () => {
    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="view-detail-book" style={{ maxWidth: 1440, margin: "0 auto", padding: "0 20px" }}>
                <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={10} sm={0} xs={0}>
                            <Skeleton.Input
                                active={true}
                                block={true}
                                style={{ width: "100%", height: 350 }}
                            />
                            <div>
                                <Skeleton.Image active={true} />
                                <Skeleton.Image active={true} />
                                <Skeleton.Image active={true} />
                            </div>
                        </Col>
                        <Col md={14} sm={24}>
                            <Skeleton
                                paragraph={{ rows: 3 }}
                                active={true}
                            />
                            <br /> <br />
                            <Skeleton
                                paragraph={{ rows: 2 }}
                                active={true}
                            />
                            <br /> <br />
                            <div style={{ display: "flex", gap: 20, marginTop: 20, justifyContent: "flex-end" }}>
                                <Skeleton.Button active={true} style={{ width: 100 }} />
                                <Skeleton.Button active={true} style={{ width: 100 }} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default BookLoader;