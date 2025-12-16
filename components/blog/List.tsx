'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Col, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import { useBlogContext } from '@/context/Blogcontext';

type Props = {
    slug: string[];
};

const PER_PAGE = 9;

const BlogList = ({ slug }: Props) => {
    const [notFoundPage, setNotFoundPage] = useState(false);
    const [page, setPage] = useState(1);

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
                setHasLoading(true);

                const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/blogs`;
                const params = new URLSearchParams();

                if (slug?.length) {
                    params.append('category', slug.join(','));
                }

                const res = await fetch(`${baseUrl}?${params.toString()}`);
                const { response_code, response_data } = await res.json();

                if (!response_code || !response_data?.blogData?.length) {
                    setNotFoundPage(true);
                    return;
                }

                setNotFoundPage(false);
                setAllBlogs(response_data.blogData);
                setRecentPost(response_data.recentPost);

                // Fake pagination object for frontend
                setPagination({
                    totalCount: response_data.blogData.length,
                    per_page: PER_PAGE,
                    current_page: page,
                    total_pages: Math.ceil(response_data.blogData.length / PER_PAGE),
                    has_next: page < Math.ceil(response_data.blogData.length / PER_PAGE),
                    has_prev: page > 1,
                });

            } catch (err: unknown) {
                console.log('Blog API error:', (err as Error).message);
            } finally {
                setHasLoading(false);
            }
        };

        fetchBlogs();
    }, [slug]);

    const blogs = allBlogs ?? [];
    const totalPages = Math.ceil(blogs.length / PER_PAGE);
    const paginatedBlogs = blogs.slice(
        (page - 1) * PER_PAGE,
        page * PER_PAGE
    );

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
                                paginatedBlogs.map((item, index) => {
                                    const {
                                        blog_feature_image_path: blog_poster,
                                        Category: blog_category,
                                        blog_title,
                                        blog_slug,
                                        publish_date,
                                    } = item;

                                    const link = process.env.NEXT_PUBLIC_ENV_URL;
                                    const dateObj = publish_date ? new Date(publish_date) : null;
                                    const formattedDate =
                                        dateObj?.toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                        }) +
                                        ', ' +
                                        dateObj?.getFullYear();

                                    return (
                                        <Col lg={4} sm={6} key={index}>
                                            <div className={Styles.card}>
                                                <Link
                                                    href={`${link}/blog/${blog_category?.blog_category_slug}/${blog_slug}`}
                                                    className={Styles.imageWrapper}
                                                >
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${blog_poster}`}
                                                        alt={blog_title || 'Blog Title'}
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
                                                    <Link
                                                        href={`${link}/blog/${blog_category?.blog_category_slug}/${blog_slug}`}
                                                        className={Styles.cardTitle}
                                                    >
                                                        {blog_title}
                                                    </Link>
                                                </div>
                                            </div>
                                        </Col>
                                    );
                                })
                            ) : (
                                [...Array(PER_PAGE)].map((_, index) => (
                                    <Col lg={4} sm={6} key={index}>
                                        <div className={Styles.card}>
                                            <div className={`skeleton ${Styles.imageWrapper}`} />
                                            <div className={Styles.cardBody}>
                                                <div className="skeleton w-50 mb-2" style={{ height: 20 }} />
                                                <div className="skeleton w-100 mb-2" />
                                                <div className="skeleton w-75" />
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            )}
                        </Row>
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="paginationWrapper">
                            <ul className="pagination">
                                {/* Previous Button */}
                                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                    <span
                                        className="page-link"
                                        onClick={() => page > 1 && setPage(page - 1)}
                                    >
                                        Prev
                                    </span>
                                </li>

                                {[...Array(totalPages)].map((_, i) => (
                                    <li
                                        key={i}
                                        className={`page-item ${page === i + 1 ? 'active' : ''}`}
                                    >
                                        <span
                                            className="page-link"
                                            onClick={() => setPage(i + 1)}
                                        >
                                            {i + 1}
                                        </span>
                                    </li>
                                ))}

                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                    <span
                                        className="page-link"
                                        onClick={() => page < totalPages && setPage(page + 1)}
                                    >
                                        Next
                                    </span>
                                </li>
                            </ul>
                        </div>
                    )}

                </>
            )}
        </>
    );
};

export default BlogList;
