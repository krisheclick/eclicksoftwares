"use client";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import Styles from "./style.module.css";
import ReferAFriendModal from "../careers/ReferAFriendModal";
import { useReferModal } from "@/utils/useLetsConnect";

type PageData = {
    id: number;
    heading: string;
    page_feature_image: string;
    short_description: string;
    page_title: string;
    description: string;
    pages_custom_field: string; // JSON string
    page_repeater_data: string;
    page_technologies_used: null;
    page_top_pick_team: null;
    page_teams_used: null;
    top_pick_team: null;
    counter_data: string; // JSON string
};

type PagesCustomField = {
    banner?: Banner;
    slug?: string | string[];
};

type Banner = {
    name: string;
    is_compoment: string;
    t8vk_title: string;
    t8vk_description: string;
    t8vk_image: string;
};

type CareersResponse = {
    careers: Career[];
    pagination: Pagination;
};

type Career = {
    career_feature_image_path: string;
    career_id: number;
    career_name: string;
    career_slug: string;
    career_location: string;
    career_short_description: string;
    career_feature_image: string;
};

type Pagination = {
    total: number;
    per_page: number;
    current_page: number;
    totalPages: number;
    has_next: boolean;
    has_prev: boolean;
};

const Careers = () => {
    const { showReferModal, setShowReferModal, openReferModal } = useReferModal();
    
    const [isLoading, setIsLoading] = useState(true);
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [bannerData, setBannerData] = useState<Banner | null>(null);
    const [pageCustomField, setPageCustomField] = useState<PagesCustomField | null>(null);
    const [vacancies, setVacancies] = useState<Career[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const [isFetchingVacancies, setIsFetchingVacancies] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/career`);
            const { response_data } = await response.json();

            setPageData(response_data);
        } catch (err: unknown) {
            console.error("Failed to fetch About Page:", (err as Error).message);
        } finally {
            setIsLoading(false);
        
        };
    }

    const fetchVacancyData = async (pageNumber = 1) => {
        if (!hasMore || isFetchingVacancies) return;

        setIsFetchingVacancies(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/careers?page=${pageNumber}&limit=20`
            );

            const { response_data } = await response.json();

            setVacancies(prev =>
                pageNumber === 1
                    ? response_data.careers
                    : [...prev, ...response_data.careers]
            );

            setHasMore(response_data.pagination.has_next);
            setPagination(response_data.pagination);
        } catch (err) {
            console.error("Failed to fetch vacancies", err);
        } finally {
            setIsFetchingVacancies(false);
        }
    };


    useEffect(() => {
        fetchData();
        fetchVacancyData(1);
    }, []);

    useEffect(() => {
        if (!observerRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingVacancies) {
                    setPage(prev => {
                        const nextPage = prev + 1;
                        fetchVacancyData(nextPage);
                        return nextPage;
                    });
                }
            },
            {
                root: null,
                rootMargin: "100px",
                threshold: 0, // 🔥 IMPORTANT
            }
        );

        observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [hasMore, isFetchingVacancies]);


    useEffect(() => {
        if (pageData) {
            if (pageData?.pages_custom_field) {
                try {
                    const customResponse = JSON.parse(pageData?.pages_custom_field ?? "{}");
                    const data = customResponse?.group_name;
                    setBannerData(data?.banner);
                    setPageCustomField(data);

                } catch (err: unknown) {
                    console.error("Error parsing custom field data:", (err as Error).message);
                }
            }
        }
    }, [pageData]);

    return (
        <>
            {/* Hero Section */}
            <div className={Styles.heroSection}>
                <Container className="container-full">
                    <figure>
                        {!isLoading ? (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${bannerData?.t8vk_image}`}
                                alt={bannerData?.t8vk_title || "Banner Poster"}
                                fill
                                priority
                            />
                        ) : (
                            <div className="skeleton skeletonFill"></div>
                        )}
                    </figure>
                    <div className={Styles.bannerText}>
                        <Container>
                            <div className={Styles.bannerText_in}>
                                {!isLoading ? (
                                    <>
                                        {
                                            bannerData?.t8vk_title && (
                                                <h1 dangerouslySetInnerHTML={{ __html: bannerData?.t8vk_title }} className={`${Styles.bannerTitle}`} />
                                            )
                                        }
                                        {bannerData?.t8vk_description && (
                                            <div className={Styles.banerparaul}><div dangerouslySetInnerHTML={{ __html: bannerData.t8vk_description }}/></div>
                                        )}
                                        <div className={Styles.btnbanner}>
                                            <Link href="#job_openings" className={Styles.btnbnrs}>
                                                Let’s start your journey
                                            </Link>
                                            <Link href="#job_openings" className={Styles.btnbnrs}>
                                                refer a friend
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={`skeleton w-50 mx-auto mb-2 ${Styles.skeletonTitle}`}></div>
                                        <div className={`skeleton w-75 mx-auto ${Styles.skeletonTitle}`}></div>
                                    </>
                                )}
                                
                            </div>
                        </Container>
                    </div>
                </Container>
            </div>

            {/* Why Eclick Section */}
            <div className={`${Styles.sectionArea}`}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={6}>
                            <div className={`ps-4 ${Styles.about_content}`}>
                                {!isLoading ? (
                                    <>
                                        <p >{pageData?.short_description}</p>
                                        <h2 className={`title fw-bold ${Styles.page_title}`}>{pageData?.page_title}</h2>
                                        <div
                                            className="editorText"
                                            dangerouslySetInnerHTML={{ __html: pageData?.description || "" }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div className={`skeleton mb-2 ${Styles.skeletonTitle}`}></div>
                                        <div className={`skeleton w-75 ${Styles.skeletonTitle}`}></div>
                                        <div className="skeleton skeletonText w-100"></div>
                                        <div className="skeleton skeletonText w-100"></div>
                                        <div className="skeleton skeletonText w-100"></div>
                                        <div className="skeleton skeletonText w-100"></div>
                                        <div className="skeleton skeletonText w-100"></div>
                                        <div className="skeleton skeletonText w-75"></div>
                                        <div className="skeleton skeletonText w-50"></div>
                                    </>
                                )}
                            </div>
                        </Col>
                        <Col lg={6}>
                            <figure className={Styles.aboutPoster}>
                                {!isLoading ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${pageData?.page_feature_image}`}
                                        alt={pageData?.page_title ?? "Card Poster"}
                                        width={800}
                                        height={800}
                                        className="img-fluid"
                                        priority
                                        style={{ objectFit: "cover" }}
                                    />
                                ) : (
                                    <div className='skeleton skeletonFill'></div>
                                )}
                            </figure>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Referral Section */}
             <div className={`${Styles.referralSectionsam}`}>
                <Container>
                    <Row className="justify-content-center align-items-center">
                        <Col lg={6}>
                            <div className={Styles.referralContentl}>
                                <div className={Styles.lablheading}>for freshers</div>
                                <h2 className={Styles.sectionTitle}>First Flush - Start Your Journey Here</h2>
                                <p className={Styles.referralText}>
                                    If you are fresh out of college and want to jumpstart your IT career, our First Flush program can help you explore your flair for innovation in the industry. Come and join the INT. family, and help us inspire possibilities throughout the world. 
                                </p>
                                <Link href="/contact-us" className={Styles.btncare}>
                                    Let’s start your journey
                                </Link>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className={Styles.referralContentr}>
                                <div className={Styles.lablheading}>refer</div>
                                <h2 className={Styles.sectionTitle}>Refer a Friend & get Rewarded!</h2>
                                <p className={Styles.referralText}>
                                    Join our “Refer a Friend and Get Rewarded” program! Invite a friend to our community and enjoy great rewards together. For each successful referral, you’ll get exclusive discounts, and your friend will receive a welcome bonus. 
                                </p>
                                <Link href="#" onClick={openReferModal} className={Styles.btncare}>
                                    Refer a Friend
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div> 

            {/* Current Openings */}
            <div className={`${Styles.openingsSection}`}>
                <Container>                    
                    <div id="job_openings" className={Styles.openingsContent}>
                        <div className="d-flex justify-content-center align-items-center mb-4">
                            <h2 className={Styles.sectionTitle}>Job Vacancies</h2>
                        </div>

                        {isLoading ? (
                            <div className={Styles.loading}>
                                <p>Loading job openings...</p>
                            </div>
                        ) : vacancies.length > 0 ? (
                            <Row className={`${Styles.jobsContainer} justify-content-center`}>
                                {vacancies.map((job) => (                                    
                                    <Col key={job.career_id} className={Styles.jobCard}>
                                        <div className={Styles.jobHeader}>
                                            <h3 className={Styles.jobTitle}>
                                                {job.career_name}
                                            </h3>
                                            <p className={Styles.jobMeta}>
                                                <span className={Styles.jobLocation}>
                                                    {job.career_location}
                                                </span>
                                                <span className={Styles.jobType}>
                                                    Full-time
                                                </span>
                                            </p>
                                        </div>
                                        <div className={Styles.jobDescription}>
                                            <p>{job.career_short_description}</p>
                                        </div>
                                        <div className={Styles.jobFooter}>
                                            <Link
                                                href={`/career/apply-job/${job.career_slug}`}
                                                className="eclick-btn-primary"
                                            >Apply Now</Link>
                                        </div>
                                    </Col>
                                ))}
                                <div ref={observerRef} style={{ height: "1px" }} />

                                {isLoading && (
                                    <p className="text-center mt-3">Loading more jobs...</p>
                                )}
                            </Row>
                        ) : (
                            <div className={Styles.noJobs}>
                                <p>No current openings available. Please check back later.</p>
                            </div>
                        )}
                    </div>
                </Container>
            </div>

            {/* Refer a Friend Modal */}
            <ReferAFriendModal
                show={showReferModal}
                onHide={() => setShowReferModal(false)}
                title="Refer a Friend"
            />
        </>
    );
};

export default Careers;