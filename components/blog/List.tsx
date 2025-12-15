'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Col, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import { useBlogContext } from '@/context/Blogcontext';
type Props = {
    slug: string[];
}
const BlogList = ({ slug }: Props) => {
    const [notFoundPage, setNotFoundPage] = useState(false);
    const {
        setHasLoading,
        hasLoading,
        allBlogs,
        setAllBlogs,
        setPagination,
        setRecentPost,
    } = useBlogContext();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const url = slug
                    ? `${process.env.NEXT_PUBLIC_API_URL}/blogs?category=${slug}`
                    : `${process.env.NEXT_PUBLIC_API_URL}/blogs`;

                const res = await fetch(url);
                const { response_code, response_data } = await res.json();
                if (!response_code || !response_code || !response_data?.blogData?.length) {
                    setNotFoundPage(true);
                }
                setAllBlogs(response_data.blogData);
                setPagination(response_data.pagination);
                setRecentPost(response_data.recentPost);

            } catch (err: unknown) {
                console.log('Blog API get is something wrong', (err as Error).message)
            } finally {
                setHasLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <>
            {notFoundPage ? (
                <div className="d-flex flex-column justify-content-center align-items-center vh-60 text-center p-4">
                    <h2 className="fw-semibold mb-3">Oops! Post Not Found 😢</h2>
                </div>
            ) : (
                <>
                    <div className={Styles.blogList}>
                        <Row className="rowGap">
                            {!hasLoading ? (
                                allBlogs?.map((item, index) => {
                                    const { blog_feature_image_path: blog_poster, Category: blog_category, blog_title, blog_slug, publish_date } = item;
                                    const link = `${process.env.NEXT_PUBLIC_ENV_URL}`;
                                    const dateObj = publish_date ? new Date(publish_date) : null;
                                    const formattedDate = dateObj?.toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short"
                                    }) + ", " + dateObj?.getFullYear();
                                    return (
                                        <Col lg={4} sm={6} key={index}>
                                            <div className={Styles.card}>
                                                <Link href={`${link}/blog/${blog_category?.blog_category_slug}/${blog_slug}`} className={Styles.imageWrapper}>
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${blog_poster}`}
                                                        alt={blog_title || "Blog Title"}
                                                        fill
                                                        priority
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src =
                                                                `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/noimage.jpg`;
                                                        }}
                                                        className={Styles.cardImage}
                                                    />
                                                </Link>

                                                <div className={Styles.cardBody}>
                                                    <span>{formattedDate}</span>
                                                    <Link href={`${link}/blog/${blog_category?.blog_category_slug}/${blog_slug}`} className={Styles.cardTitle}>
                                                        {blog_title}
                                                    </Link>
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                })

                            ) : (
                                [...Array(6)].map((_, index) => (
                                    <Col lg={4} sm={6} key={index}>
                                        <div className={Styles.card}>
                                            <div className={`skeleton ${Styles.imageWrapper}`}></div>

                                            <div className={Styles.cardBody}>
                                                <div className={`skeleton w-50 mb-2 ${Styles.skeletonDate}`} style={{ height: "20px" }}></div>
                                                <div className={`skeleton w-100 skeletonText ${Styles.skeletonTitle}`}></div>
                                                <div className={`skeleton skeletonText ${Styles.skeletonTitle}`}></div>
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            )}

                        </Row>
                    </div>
                </>
            )}
        </>
    );
};

export default BlogList;
