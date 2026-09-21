'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Col, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import { useBlogContext } from '@/context/Blogcontext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

type Props = {
    slug: string[];
};

const PER_PAGE = 9;
const ELLIPSIS = 'ellipsis';

const getPaginationItems = (currentPage: number, totalPages: number) => {
    if (totalPages <= 4) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set<number>([
        currentPage,
        Math.min(currentPage + 1, totalPages),
        Math.max(totalPages - 1, 1),
        totalPages,
    ]);

    const sortedPages = [...pages].sort((a, b) => a - b);

    return sortedPages.reduce<(number | typeof ELLIPSIS)[]>((items, pageNumber) => {
        const previousPage = items[items.length - 1];

        if (
            typeof previousPage === 'number' &&
            pageNumber - previousPage > 1
        ) {
            items.push(ELLIPSIS);
        }

        items.push(pageNumber);
        return items;
    }, []);
};

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
    const paginationItems = getPaginationItems(page, totalPages);
    const paginatedBlogs = blogs.slice(
        (page - 1) * PER_PAGE,
        page * PER_PAGE
    );

    return (
        <>
            {notFoundPage ? (
                <div className="d-flex flex-column justify-content-center align-items-center vh-60 text-center p-4">
                    <h2 className="fw-semibold mb-3" style={{lineHeight: "1.35em"}}>Oops! Post Not Found 😢</h2>
                </div>
            ) : (
                <>
                    <div className={Styles.blogList}>
                        <Row className="gx-xxl-4 gx-sm-3 gx-2 rowGap">
                            {!hasLoading ? (
                                paginatedBlogs.map((item, index) => {
                                    const {
                                        blog_feature_image_path: blog_poster,
                                        Category: blog_category,
                                        blog_title,
                                        blog_slug,
                                        publish_date,
                                    } = item;

                                    const categorySlug = blog_category?.blog_category_slug;
                                    const blogHref = categorySlug
                                        ? `/blog/${categorySlug}/${blog_slug}`
                                        : `/blog/${blog_slug}`;
                                    const dateObj = publish_date ? new Date(publish_date) : null;
                                    const formattedDate =
                                        dateObj?.toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                        }) +
                                        ', ' +
                                        dateObj?.getFullYear();

                                    return (
                                        <Col xl={4} xs={6} key={index}>
                                            <div className={Styles.card}>
                                                <Link
                                                    href={blogHref}
                                                    className={Styles.imageWrapper}
                                                >
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${blog_poster}`}
                                                        alt={blog_title || 'Blog Title'}
                                                        fill
                                                        priority
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src =
                                                                `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/placeholder.webp`;
                                                        }}
                                                        className={Styles.cardImage}
                                                    />
                                                </Link>

                                                <div className={Styles.cardBody}>
                                                    <span className={Styles.cardDate}>{formattedDate}</span>
                                                    <Link
                                                        href={blogHref}
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
                                    <Col xl={4} xs={6} key={index}>
                                        
                                        <div className={`skeleton w-100 ${Styles.card}`}>
                                            <div className={`skeleton ${Styles.imageWrapper}`}></div>
                                            <div className={Styles.cardBody}>
                                                <div className={`skeleton mb-2 ${Styles.skeletontitle}`}>&nbsp;</div>
                                                <div className={`skeleton ${Styles.skeletontitle}`}>&nbsp;</div>
                                                <div className={"skeleton skeletonText"}>&nbsp;</div>
                                                <div className={"skeleton skeletonText w-75"}></div>
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
                                        aria-label="Previous page"
                                    >
                                        <FontAwesomeIcon icon={faAngleLeft} />
                                    </span>
                                </li>

                                {paginationItems.map((item, index) => {
                                    if (item === ELLIPSIS) {
                                        return (
                                            <li key={`${item}-${index}`} className="page-item disabled">
                                                <span className="page-link">...</span>
                                            </li>
                                        );
                                    }

                                    return (
                                        <li
                                            key={item}
                                            className={`page-item ${page === item ? 'active' : ''}`}
                                        >
                                            <span
                                                className="page-link"
                                                onClick={() => setPage(item)}
                                            >
                                                {item}
                                            </span>
                                        </li>
                                    );
                                })}

                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                    <span
                                        className="page-link"
                                        onClick={() => page < totalPages && setPage(page + 1)}
                                        aria-label="Next page"
                                    >
                                        <FontAwesomeIcon icon={faAngleRight} />
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
