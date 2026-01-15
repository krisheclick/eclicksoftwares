'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import { Container } from 'react-bootstrap';
import Styles from './style.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Skeleton from '@/components/common/Skeleton';

type BlogItem = {
    blog_feature_image_path: string;
    blog_title: string;
    blog_slug: string;
    blog_short_description: string;
    publish_date: string;
    Category:{
        blog_category_slug:string;
    }
};

const Blog = () => {
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [hasLoading, setLoading] = useState(true);

    const fetchBlogsData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}blogs?is_home=1&limit=10`);
            const { response_data } = await response.json();
            setBlogs(response_data?.blogData);
        } catch (err) {
            console.error('API error:', (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogsData();
    }, []);


    return (
        <div className={`sectionArea ${Styles.sectionArea ?? ''}`}>
            <Container>
                <div className={`section-content d-lg-flex align-items-start justify-content-between gap-3 ${Styles.section_content ?? ''}`}>
                    {!hasLoading ? (
                        <>
                            <h2 className="heading mb-0">Blogs & Insights</h2>

                            <div className="mt-2 pt-1">
                                <Link
                                    className={`eclick-btn-viewBtn ${Styles.viewBtn ?? ''}`}
                                    href={`/blog`}
                                >
                                    <span className={Styles.icon}>
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </span>
                                    <em>View All Blog</em>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <Skeleton />
                            <div className="mt-1">
                                <div className="skeleton eclick-btn-blog"></div>
                            </div>
                        </>
                    )}
                </div>

                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    autoplay={{ delay: 3000 }}
                    spaceBetween={20}
                    slidesPerView={4}
                    loop
                    className={`blogSlider ${Styles.blogSlider}`}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1200: { slidesPerView: 4 },
                    }}
                >
                    {!hasLoading ? (
                        blogs?.map((item, index) => (
                            <SwiperSlide key={index} className={Styles.slideCard}>
                                <div className={Styles.card}>
                                    <div className={Styles.imageWrapper}>
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.blog_feature_image_path}`}
                                            alt={item.blog_title}
                                            fill
                                            priority
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/noimage.jpg`;
                                            }}
                                            className={Styles.cardImage}
                                        />
                                    </div>

                                    <div className={Styles.cardBody}>
                                        <div className={Styles.cardTitle}>{item.blog_title}</div>
                                        <p className={Styles.cardText}>{item.blog_short_description}</p>

                                        <Link
                                            href={`/blog/${item.Category.blog_category_slug}/${item.blog_slug}`}
                                            className={`learnMore ${Styles.readMore ?? ''}`}
                                        >
                                            Read More
                                            <span className="sr-only">Eclicksoftwares</span>
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    ) : (
                        [...Array(4)].map((_, index) => (
                            <SwiperSlide key={index} className={Styles.slideCard}>
                                <div className={`skeleton w-100 ${Styles.card}`}>
                                    <div className={`skeleton ${Styles.imageWrapper}`}></div>
                                    <div className="mt-3">
                                        <div className={`skeleton ${Styles.skeletontitle}`} style={{ width: "85%" }}></div>
                                        <div className={"mt-3 skeleton skeletonText"} style={{ width: "100%" }}></div>
                                        <div className={"skeleton skeletonText"} style={{ width: "85%" }}></div>
                                        <div className={`skeleton ${Styles.skeletonlearnMore}`}></div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    )}
                </Swiper>
            </Container>
        </div>
    );
};

export default Blog;
