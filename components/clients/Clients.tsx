"use client";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import 'swiper/css';
import Styles from "./style.module.css";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

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

    const fetchAPI = async() => {
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}clients`);
            const {response_data} = await response.json();
            setdata(response_data?.data || []);
        }catch(err: unknown){
            console.log('Cliens data is something wrong:', (err as Error).message)
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchAPI();
    }, []);
    
    return (
        <div className={Styles.clients}>
            <Container>
                <div className={`${Styles.boxwrapper} ${classValue ?? ''}`}>
                    <Swiper
                        loop={data.length > 6} 
                        slidesPerGroup= {1}
                        slidesPerView={'auto'}
                        spaceBetween={16}
                        modules={[Autoplay, Navigation]}
                    >
                        {!hasLoading ? (
                            data.slice(0, 12).map((value, index) => {
                                const {client_name, client_logo} = value;
                                const image = client_logo;
                                return(
                                    <SwiperSlide className={Styles.sliderItem} key={index}>
                                        <div className={Styles.box}>
                                            <Image
                                                src={image
                                                    ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${image}`
                                                    : "/cashpoint.png"
                                                }
                                                alt={client_name || "Eclick Client"}
                                                fill
                                                priority={true}
                                            />
                                        </div>
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
