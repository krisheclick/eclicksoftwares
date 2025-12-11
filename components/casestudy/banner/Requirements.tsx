"use client";
import { Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import Styles from "../casestudy.module.css";
type Data = {
    proj_scope?: string;
    proj_cover_image_path?: string;
    proj_name?: string;
    proj_gallery?: string;
}
type Props = {
    data?: Data;
}
const Requirements = ({ data }: Props) => {
    const galleryArray = data?.proj_gallery ? data.proj_gallery.split(",").filter(item => item.trim() !== "") : [];
    return (
        <section className={Styles.requirementsList}>
            <Container>
                <Row className={Styles.requirSec}>
                    <Col lg={6}>
                        <div className={Styles.reqLeft}>
                            <h2>Requirements</h2>
                            <div className={Styles.content}
                                dangerouslySetInnerHTML={{ __html: data?.proj_scope || '' }}
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className={Styles.reqRight}>
                            <FontAwesomeIcon icon={faCaretLeft} className={Styles.faCaretLeft} />
                            {galleryArray.length > 0 ? (
                                <Swiper
                                    modules={[Autoplay, Pagination, FreeMode]}
                                    pagination={{
                                        clickable: true,
                                        dynamicBullets: true,
                                    }}
                                    slidesPerView={1}
                                    loop
                                    autoplay={{ delay: 3000, disableOnInteraction: true }}
                                    className={`gallerySlider ${Styles.gallerySlider}`}
                                >
                                    {galleryArray.map((value, index) => (
                                        <SwiperSlide key={index} className={Styles.galleryPoster}>
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/project/${value}`}
                                                alt={data?.proj_name || "Project image"}
                                                width={624}
                                                height={598}
                                                priority
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <figure className={Styles.galleryPoster}>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${data?.proj_cover_image_path}`}
                                        alt={data?.proj_name || ''}
                                        width={624}
                                        height={598}
                                        priority={true}
                                    />
                                </figure>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Requirements