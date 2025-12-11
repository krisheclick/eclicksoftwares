"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Container } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import Styles from './portfolio.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

type CasestudyList = {
    proj_feature_image_path?: string;
    proj_responsive_image_1_path?: string;
    proj_responsive_image_2_path?: string;
    proj_name?: string;
    proj_slug?: string;
    proj_short_desc?: string;
    proj_tools_used?: string;
};
type props = {
    isLoading: boolean;
    title: string;
    projects: CasestudyList[] | undefined;
}

const Portfolio = ({ isLoading, title, projects }: props) => {

    return (
        <div className={Styles.sectionArea}>
            <Container>
                <div className={Styles.section_wrapper}>
                    <div className={`section-content full ${Styles.section_content ?? ''}`}>
                        {!isLoading ? (
                            <>
                                <div className={Styles.subtitle}>Our Portfolio</div>
                                <h2 className={`title ${Styles.title ?? ''}`}>{title ? title : 'Showcasing Success, One Project at a Time (Static).'}</h2>
                            </>
                        ) : (
                            <>
                                <div className="skeleton mb-3" style={{ width: "150px", height: 30 }}></div>
                                <div className="skeleton skeletonTitle"></div>
                            </>
                        )}
                    </div>

                    <Swiper
                        modules={[Pagination, Autoplay]}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        autoplay={{ delay: 3000 }}
                        spaceBetween={20}
                        slidesPerView={2}
                        loop
                        className={`projectSlider ${Styles.projectSlider}`}
                    >
                        {!isLoading ? (
                            projects?.map((item, index) => {
                                const {
                                    proj_feature_image_path,
                                    proj_name,
                                    proj_short_desc,
                                    proj_tools_used,
                                    proj_slug
                                } = item;

                                let tools: { name?: string; value?: string }[] = [];
                                if (typeof proj_tools_used === "string") {
                                    try {
                                        tools = JSON.parse(proj_tools_used);
                                    } catch (err) {
                                        console.error("Error parsing proj_tools_used:", err);
                                    }
                                }

                                return (
                                    <SwiperSlide key={index} className={Styles.rowList}>
                                        <div className={Styles.card}>
                                            <figure className={Styles.cardPoster}>
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${proj_feature_image_path}`}
                                                    alt={proj_name || "Project Image"}
                                                    fill
                                                    priority
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/noimage.jpg`;
                                                    }}
                                                    style={{objectFit: "cover"}}
                                                />
                                            </figure>
                                            <aside>
                                                <div className={Styles.boxTitle}>{proj_name}</div>
                                                <p
                                                    dangerouslySetInnerHTML={{
                                                        __html: proj_short_desc || "",
                                                    }}
                                                />

                                                {tools.length > 0 && (
                                                    <ul>
                                                        {tools.slice(0, 2).map((tool, idx) => (
                                                            <li key={idx}>
                                                                <span>{tool.name}</span> <em>{tool.value}</em>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                <div className={Styles.listTarget}>
                                                    <Link href={`/project/${proj_slug}`}>
                                                        <FontAwesomeIcon icon={faLink} /> {proj_name}
                                                    </Link>
                                                </div>
                                            </aside>
                                        </div>
                                    </SwiperSlide>
                                );
                            })
                        ) : (
                            [...Array(4)].map((_, index) => (
                                <SwiperSlide key={index} className={Styles.rowList}>
                                    <div className={Styles.card}>
                                        <figure className={`skeleton ${Styles.cardPoster}`}></figure>
                                        <aside>
                                            <div className="skeleton mb-3" style={{ width: "85%", height: 32 }}></div>
                                            <div className={"skeleton skeletonText"} style={{ width: "100%" }}></div>
                                            <div className={"skeleton skeletonText"} style={{ width: "100%" }}></div>
                                            <div className={"skeleton skeletonText"} style={{ width: "85%" }}></div>
                                            <ul className='my-4'>
                                                <li>
                                                    <span className='skeleton w-75 mb-1' style={{ height: 12 }}></span>
                                                    <em className='skeleton w-100 skeletonText'></em>
                                                </li>
                                                <li>
                                                    <span className='skeleton w-75 mb-1' style={{ height: 12 }}></span>
                                                    <em className='skeleton w-100 skeletonText'></em>
                                                </li>
                                            </ul>
                                            <div className='skeleton w-50' style={{ height: 32 }}></div>
                                        </aside>
                                    </div>
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>
                </div>
            </Container>
        </div>
    );
};

export default Portfolio;
