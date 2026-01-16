"use client";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import 'swiper/css';
import "swiper/css/autoplay";
import Styles from "./style.module.css";
import type { Swiper as SwiperType } from "swiper";
import CustomImage from "@/utils/CustomImage";

type classProps = {
    classValue?: string;
}
type ClientData = {
    client_name?: string;
    client_logo?: string;
};

const Clients = ({ classValue }: classProps) => {
    const [hasLoading, setLoading] = useState(true);
    const [data, setdata] = useState<ClientData[]>([]);
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

    const fetchAPI = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}clients?is_home=1`);
            const { response_data } = await response.json();
            setdata(response_data?.data || []);
        } catch (err: unknown) {
            console.log('Cliens data is something wrong:', (err as Error).message)
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchAPI();
    }, []);

    useEffect(() => {
        if (swiperInstance && data.length) {
            setTimeout(() => {
                swiperInstance.update();
            }, 0);
        }
    }, [swiperInstance, data]);

    return (
        <div className={Styles.clients}>
            <Container>
                <div className={`${Styles.boxwrapper} ${classValue ? Styles[classValue] : ""}`}>
                    <Swiper
                        onSwiper={setSwiperInstance}
                        loop={data.length > 6}
                        slidesPerGroup={1}
                        slidesPerView={'auto'}
                        spaceBetween={16}
                        autoplay={{ delay: 3000 }}
                        modules={[Autoplay, Navigation]}
                    >
                        {!hasLoading ? (
                            data.slice(0, 12).map((value, index) => {
                                const { client_name, client_logo } = value;
                                const image = client_logo;
                                return (
                                    <SwiperSlide className={Styles.sliderItem} key={index}>
                                        <CustomImage
                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${image}`}
                                            alt={client_name}
                                            className={Styles.box}
                                        />
                                    </SwiperSlide>
                                )
                            })
                        ) : (
                            <>
                                {[...Array(7)].map((_, index) => (
                                    <SwiperSlide className={Styles.sliderItem} key={index}>
                                        <div className={`skeleton w-100 ${Styles.box}`}></div>
                                    </SwiperSlide>
                                ))}
                            </>
                        )}
                    </Swiper>
                </div>
            </Container>
        </div>
    )
}

export default Clients
