"use client";
import { useEffect } from 'react';
import Image from 'next/image'
import Styles from './style.module.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
type ProcessStep = {
    filename: string;
    name: string;
    title: string;
    description: string;
}

type props = {
    isLoading: boolean;
    process_steps: ProcessStep[];
}

const List = ({ isLoading, process_steps }: props) => {

    useEffect(() => {
        const titles = document.querySelectorAll<HTMLElement>(".cprocess_title");
        let maxHeight = 0;

        titles.forEach(title => {
            title.style.minHeight = "auto";
            maxHeight = Math.max(maxHeight, title.offsetHeight);
        });

        titles.forEach(title => {
            title.style.minHeight = `${maxHeight}px`;
        });
    }, [process_steps]);
    return (
        process_steps && process_steps.length > 0 && (
            <div className={Styles.processStep}>
                <div className={Styles.processLine}></div>
                <Swiper
                    className={`${Styles.process_slider ?? ''} process_slider height-auto`}
                    spaceBetween={12}
                    slidesPerView={Math.min(process_steps?.length || 5, 5)}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    rewind={true}
                    modules={[Autoplay, FreeMode]}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 5 },
                    }}
                    onSlideChange={(swiper) => {
                        const visible =
                            typeof swiper.params.slidesPerView === 'number'
                                ? swiper.params.slidesPerView
                                : 1;
                        const stopAt = process_steps.length - visible;
                        if (swiper.activeIndex >= stopAt) {
                            swiper.autoplay.stop();
                        }
                    }}
                >

                    {!isLoading ? (
                        process_steps.map((item: ProcessStep, index: number) => (
                            <SwiperSlide className={Styles.processBox} key={index}>
                                <figure className={Styles.icon}>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.filename}`}
                                        alt={item.title || 'Project Analysis'}
                                        fill
                                        priority={true}
                                    />
                                </figure>
                                <div className={`cprocess_title ${Styles.process_title}`}>
                                    {item.title}
                                </div>
                                <p dangerouslySetInnerHTML={{
                                    __html: item.description ?? ''
                                        .replace(/Â+/g, "")
                                        .replace(/\s+/g, " ")
                                        .trim(),
                                }} />
                            </SwiperSlide>
                        ))
                    ) : (
                        [...Array(5)].map((_, index) => (
                            <SwiperSlide className={Styles.processBox} key={index}>
                                <figure className={`skeleton ${Styles.radiusIcon}`}></figure>
                                <div className={`w-100 ${Styles.skeletonText}`}>
                                    <div className="skeleton w-70" style={{ height: 28, marginBottom: 12 }}></div>
                                    <div className="skeleton skeletonText mb-2"></div>
                                    <div className="skeleton skeletonText w-65"></div>
                                </div>
                            </SwiperSlide>
                        ))
                    )}
                </Swiper>
            </div>
        )
    )
}

export default List
