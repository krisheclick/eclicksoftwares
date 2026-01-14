"use client";
import Styles from "../casestudy.module.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Autoplay, FreeMode } from 'swiper/modules';
import { Container, Image } from "react-bootstrap";

interface Projects {
    proj_feature_image_path?: string;
}
const MySlider = ({ data }: { data?: Projects[] }) => {
    if (!data) return null;
    console.log('data', data)
    return (
        <div className={Styles.MySliderSection}>
            <Container>
                <h2 className={Styles.title}>Other Case Studies</h2>
                <div className={Styles.sliderContainer}>
                    <Swiper
                        modules={[Autoplay, Pagination, FreeMode]}
                        slidesPerView={3}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: true }}
                        loop={true}
                        centeredSlides={true}
                        className="sliderdiv"
                    >
                        {data?.map((value, index) => (
                            <SwiperSlide key={index}>
                                <figure>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${value?.proj_feature_image_path}`}
                                        width={401}
                                        height={440}
                                        alt=""
                                        style={{objectFit: "cover", objectPosition: "top"}}
                                    />
                                </figure>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </Container>
        </div>
    );
}
export default MySlider