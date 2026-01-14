"use client";
import { Col, Container, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import Styles from "./style.module.css";
type Data = {
    proj_scope?: string;
    proj_cover_image_path?: string;
    proj_name?: string;
    proj_gallery?: string;
    proj_our_achievements?: string | string[];
}
type Props = {
    data?: Data;
    projectType?: boolean;
}
const Requirements = ({ projectType, data }: Props) => {
    const galleryArray = data?.proj_gallery ? data.proj_gallery.split(",").filter(item => item.trim() !== "") : [];
    return (
        <div className={`sectionArea ${projectType ? 'pt-3': ''} ${Styles.requirementsList ?? ''}`}>
            <Container>
                <Row className={Styles.requirSec}>
                    <Col lg={6} className="align-self-center">
                        <div className={Styles.reqLeft}>
                            <h2>{projectType ? 'Our Solution' : 'Requirements'}</h2>
                            <div className={`editorText blue ${Styles.content ?? ''}`}
                                dangerouslySetInnerHTML={{ __html: data?.proj_scope || '' }}
                            />
                            {data?.proj_our_achievements && (
                                <div className={Styles.achivement_content}>
                                    <div className={Styles.achivement_title}>Our achievements:</div>
                                    <div 
                                        className={Styles.achivement_data}
                                        dangerouslySetInnerHTML={{__html: data?.proj_our_achievements || ''}}
                                    />
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className={Styles.reqRight}>
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
        </div>
    )
}

export default Requirements