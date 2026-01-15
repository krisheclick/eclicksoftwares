'use client';
import { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Skeleton from "@/components/common/Skeleton";
import Styles from "./style.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
type Project = {
    proj_name: string;
    proj_slug: string;
    proj_type: string;
    proj_short_desc: string;
    proj_feature_image: string;
    proj_feature_image_path: string;
    proj_tools_used: string;
    proj_gallery?: string | string[];
}

const Platformscomponent = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [hasLoading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const parseGallery = (gallery?: string | string[]) => {
        if (!gallery) return [];
        if (Array.isArray(gallery)) return gallery;
        return gallery.split(",").map(img => img.trim());
    };
    const fetchData = async () => {
        setLoading(true);
        try {
            const API = `${process.env.NEXT_PUBLIC_API_URL}products?is_home=1&limit=6`;

            const response = await fetch(API);
            if (!response.ok) {
                throw new Error("API data is not ok. Please check & fixed...");
            }
            const data = await response.json();
            if (data.response_code === false) {
                console.error("API response_code is false");
                return;
            }
            const responseData = data.response_data;

            setProjects(responseData.data);
        } catch (err) {
            console.error('API error:', (err as Error).message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    const toggleFAQ = (index: number) => {
        setActiveIndex(prev => (prev === index ? null : index));
    };


    return (
        <div className={Styles.sectionArea}>
            <Container className='container-full'>
                <div className={`section-content text-center ${Styles.section_content ?? ""}`}>
                    {!hasLoading ? <h4 className={`heading ${Styles.heading ?? ''}`}>Tailored Platforms for Your Business</h4> : <Skeleton />}
                </div>

                <div className={Styles.cardWrapper}>
                    <Row className="gx-xl-5">
                        <Col lg={6} className="align-self-start">
                            <div className={Styles.cardBox}>
                                {!hasLoading ? (
                                    projects.map((faq, index) => (
                                        <div
                                            key={index}
                                            className={`${Styles.card} ${activeIndex === index ? Styles.activeCard : ""
                                                }`}
                                        >
                                            <button className={`subtitle ${Styles.accordionTitle}`}
                                                onClick={() => toggleFAQ(index)}
                                                aria-expanded={activeIndex === index}
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: faq.proj_name ?? '' }} />
                                                <em className={`${Styles.icon} ${activeIndex === index ? Styles.iconRotated : ""}`}>
                                                    <FontAwesomeIcon icon={faArrowRight} />
                                                </em>
                                            </button>

                                            {activeIndex === index && (
                                                <div className={`editorText ${Styles.accordionContent}`}
                                                    dangerouslySetInnerHTML={{ __html: faq.proj_short_desc ?? '' }}
                                                />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    [...Array(6)].map((_, index) => (
                                        <div
                                            key={index}
                                            className={`skeleton ${Styles.card} ${index === 0 ? Styles.activeCard : ""
                                                }`}
                                        >
                                            <button className={Styles.accordionTitle}>
                                                <div className="skeleton" style={{ width: "85%", height: "32px" }}></div>
                                                <em className={`${Styles.icon} ${index === 0 ? Styles.iconRotated : ""}`}>
                                                    <FontAwesomeIcon icon={faArrowRight} />
                                                </em>
                                            </button>

                                            {index === 0 && (
                                                <div className={Styles.accordionContent}>
                                                    <div className="skeleton skeletonText" style={{ width: "95%" }}></div>
                                                    <div className="skeleton skeletonText" style={{ width: "95%" }}></div>
                                                    <div className="skeleton" style={{ width: "20%", height: "32px", marginTop: "20px" }}></div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </Col>

                        <Col lg={6}>
                            {(
                                !hasLoading &&
                                activeIndex !== null &&
                                projects[activeIndex] &&
                                parseGallery(projects[activeIndex].proj_gallery).length > 0
                            ) ? (
                                <Swiper
                                    key={activeIndex}
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    spaceBetween={20}
                                    slidesPerView={1}
                                    className={Styles.gallerySwiper}
                                >
                                    {parseGallery(projects[activeIndex].proj_gallery).map((img, i) => (
                                        <SwiperSlide key={i}>
                                            <div className={Styles.imageWrapper}>
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/project/${img}`}
                                                    alt={`${projects[activeIndex].proj_name} image ${i + 1}`}
                                                    fill
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <div className={`skeleton rounded shadow-sm ${Styles.imageWrapper}`}></div>
                            )}
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default Platformscomponent
