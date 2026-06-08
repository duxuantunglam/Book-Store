import { Col, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "styles/home.scss";

interface IProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    currentIndex: number;
    items: {
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[];
    title: string;
}

const ModalGallery = (props: IProps) => {
    const { isOpen, setIsOpen, currentIndex, items, title } = props;

    const [activeIndex, setActiveIndex] = useState(0);
    const refGallery = useRef<ImageGallery>(null);

    useEffect(() => {
        if (isOpen) {
            setActiveIndex(currentIndex);
        }
    }, [isOpen, currentIndex]);

    return (
        <Modal
            width={'60vw'}
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={null}
            closable={false}
            className="modal-gallery"
        >
            <Row gutter={[20, 20]}>
                <Col span={16}>
                    <ImageGallery
                        ref={refGallery}
                        items={items}
                        showPlayButton={false}
                        showFullscreenButton={false}
                        startIndex={currentIndex}
                        showThumbnails={false}
                        onSlide={(i) => setActiveIndex(i)}
                        slideOnThumbnailOver={true}
                    />
                </Col>

                <Col span={8}>
                    <div style={{ padding: "5px 0 20px 0" }}>{title}</div>
                    <div>
                        <Row gutter={[20, 20]}>
                            {items.map((item, index) => {
                                return (
                                    <Col key={`image-${index}`}>
                                        <Image
                                            wrapperClassName={"img-normal"}
                                            width={100}
                                            height={100}
                                            src={item.original}
                                            preview={false}
                                            onClick={() => {
                                                refGallery?.current?.slideToIndex(index);
                                            }}
                                        />
                                        <div className={activeIndex === index ? "active" : ""}></div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                </Col>
            </Row>
        </Modal>
    );
};

export default ModalGallery;