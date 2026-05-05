"use client";
import Styles from "../casestudy.module.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, FreeMode } from 'swiper/modules';
import { Container } from "react-bootstrap";
import CustomImageLink from "@/utils/CustomImageLink";

interface Projects {
    proj_feature_image_path?: string;
    proj_title?: string;
    proj_slug?: string;
}
const MySlider = ({ data }: { data?: Projects[] }) => {
    if (!data) return null;
    return (
        <div className={Styles.MySliderSection}>
            <Container>
                <h2 className={Styles.title}>Other Case Studies</h2>
                <div className={Styles.sliderContainer}>
                    <Swiper
                        modules={[Autoplay, Pagination, FreeMode]}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        // autoplay={{ delay: 5000, disableOnInteraction: true }}
                        loop={true}
                        className="sliderdiv"
                        breakpoints={{
                            0:{
                                slidesPerView: 1
                            },
                            480:{
                                slidesPerView: 2,
                                spaceBetween: 16
                            },
                            768: {
                                slidesPerView: 3,
                                centeredSlides: true
                            }
                        }}
                    >
                        {data?.map((value, index) => (
                            <SwiperSlide key={index}>
                                <div className={Styles.sliderPostWrap}>
                                    <CustomImageLink
                                        link={`${process.env.NEXT_PUBLIC_ENV_URL}/casestudies/${value?.proj_slug}`}
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${value?.proj_feature_image_path}`}
                                        alt={value?.proj_title}
                                        style={{objectFit: "cover", objectPosition: "top"}}
                                        className={Styles.sliderPost}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </Container>
        </div>
    );
}
export default MySlider