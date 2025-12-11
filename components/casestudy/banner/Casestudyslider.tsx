"use client";
import Styles from "../casestudy.module.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Autoplay, FreeMode } from 'swiper/modules';
import { Container, Image } from "react-bootstrap";
const MySlider = () => {
    return (
        <section className={Styles.MySliderSection}>
            <Container>
                <h2 className={Styles.title}>Other Case Studies</h2>
                <section className={Styles.sliderContainer}>
                    <Swiper
                        modules={[Autoplay, Pagination, FreeMode]}
                        spaceBetween={20}
                        slidesPerView={3}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: true }}
                        loop={true}
                        className="sliderSection"
                    >
                        <SwiperSlide>
                            <figure>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/sliderimg01.jpg`}
                                    width={401}
                                    height={440}
                                    alt=""
                                />
                            </figure>
                        </SwiperSlide>
                        <SwiperSlide>
                            <figure>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/sliderimg02.jpg`}
                                    width={401}
                                    height={440}
                                    alt=""

                                />
                            </figure>
                        </SwiperSlide>
                        <SwiperSlide>
                            <figure>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/detailsimg.jpg`}
                                    width={401}
                                    height={440}
                                    alt=""

                                />
                            </figure>
                        </SwiperSlide>
                        <SwiperSlide>
                            <figure>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/sliderimg02.jpg`}
                                    width={401}
                                    height={440}
                                    alt=""
                                />
                            </figure>
                        </SwiperSlide>
                    </Swiper>
                </section>
            </Container>
        </section>
    );
}
export default MySlider