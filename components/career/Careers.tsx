"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardBody, CardHeader, CardText, CardTitle, Col, Container, Row, Stack } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import Styles from "./style.module.css";
import ReferAFriendModal from "../careers/ReferAFriendModal";
import { useReferModal } from "@/utils/useLetsConnect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import CustomImage from "@/utils/CustomImage";

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
            {!isLoading ? (
                <div className={Styles.heroSection} style={{ background: `url(${`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${bannerData?.t8vk_image}`}) no-repeat top center` }}>
                    <div className={Styles.bannerText}>
                        <Container>
                            <div className={Styles.bannerText_in}>
                                {
                                    bannerData?.t8vk_title && (
                                        <h1 dangerouslySetInnerHTML={{ __html: bannerData?.t8vk_title }} className={`${Styles.bannerTitle}`} />
                                    )
                                }
                                {bannerData?.t8vk_description && (
                                    <div className={Styles.banerparaul}>
                                        <div dangerouslySetInnerHTML={{ __html: bannerData.t8vk_description }} className="editorText" />
                                    </div>
                                )}
                                <div className={`btn_wrap btn_left ${Styles.btnbanner}`}>
                                    <Link href="#job_openings" className={`eclick-btn-journey`}>
                                        <em>Let’s start your journey</em>
                                        <span className={Styles.icon}>
                                            <FontAwesomeIcon icon={faArrowRight} />
                                        </span>
                                    </Link>
                                    <Link href="#" onClick={openReferModal} className={`eclick-btn-refer white-btn`}>
                                        <span>
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
                                                alt="Phone"
                                                width={18} height={18}
                                                loading="lazy"
                                            />
                                        </span>
                                        <em>Refer a friend</em>
                                    </Link>
                                </div>
                            </div>
                        </Container>
                    </div>
                </div>
            ) : (
                <div className={Styles.heroSection}>
                    <div className="skeleton skeletonFill"></div>
                </div>
            )}

            {/* Why Eclick Section */}
            <div className={`sectionArea ${Styles.sectionArea ?? ''}`}>
                <Container>
                    <Row className="rowGap gx-xl-5 justify-content-center">
                        <Col lg={6} className="align-self-center">
                            <div className={Styles.about_content}>
                                {!isLoading ? (
                                    <>
                                        {pageData?.short_description && <p >{pageData?.short_description}</p>}
                                        <h2 className={`title fw-bold ${Styles.page_title ?? ''}`}>{pageData?.page_title}</h2>
                                        <div
                                            className="editorText"
                                            dangerouslySetInnerHTML={{ __html: pageData?.description || "" }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div className={`title skeleton ${Styles.page_title}`}>&nbsp;</div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText w-75"></div>
                                        <div className="skeleton skeletonText w-50"></div>
                                    </>
                                )}
                            </div>
                        </Col>
                        <Col lg={6}>
                            {!isLoading ? (
                                <CustomImage
                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${pageData?.page_feature_image}`}
                                    alt={pageData?.page_title ?? "Card Poster"}
                                    className={Styles.aboutPoster}
                                />
                            ) : (
                                <div className={`skeleton ${Styles.aboutPoster}`}></div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Referral Section */}
            <div className={`sectionArea ${Styles.referralSectionsam}`}>
                <Container>
                    <Row className="gx-xl-5 justify-content-center align-items-center">
                        <Col lg={6}>
                            <div className={`${Styles.referralContent} ${Styles.referralContentWhite}`}>
                                <div className={Styles.referralContentInner}>
                                    <div className={`small_title ${Styles.small_title}`}>For Freshers</div>
                                    <div className={`title fw-bold ${Styles.sectionTitle}`}>First Flush - Start Your Journey Here</div>
                                    <p>
                                        If you are fresh out of college and want to jumpstart your IT career, our First Flush program can help you explore your flair for innovation in the industry. Come and join the INT. family, and help us inspire possibilities throughout the world.
                                    </p>
                                    <div className="btn_left sm">
                                        <Link href="/contact-us" className={`eclick-btn-journey white-btn`}>
                                            <em>Let’s start your journey</em>
                                            <span className={Styles.icon}>
                                                <FontAwesomeIcon icon={faArrowRight} />
                                            </span>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className={Styles.referralContent}>
                                <div className={Styles.referralContentInner}>
                                    <div className={`small_title ${Styles.small_title}`}>Refer</div>
                                    <div className={`title fw-bold ${Styles.sectionTitle}`}>Refer a Friend & get Rewarded!</div>
                                    <p>
                                        Join our “Refer a Friend and Get Rewarded” program! Invite a friend to our community and enjoy great rewards together. For each successful referral, you’ll get exclusive discounts, and your friend will receive a welcome bonus.
                                    </p>
                                    <div className="btn_left sm">
                                        <Link href="#" onClick={openReferModal} className={`eclick-btn-refer`}>
                                            <span>
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
                                                    alt="Phone"
                                                    width={18} height={18}
                                                    loading="lazy"
                                                />
                                            </span>
                                            <em>Refer a Friend</em>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Current Openings */}
            <div className={`sectionArea ${Styles.openingsSection}`}>
                <Container>
                    <div id="job_openings" className={Styles.openingsContent}>
                        <div className="section-content text-center">
                            <h3 className={`title fw-bold ${Styles.jobTitle ?? ''}`}>Job Vacancies</h3>
                        </div>

                        {isLoading ? (
                            <CardSkeleton />
                        ) : vacancies.length > 0 ? (
                            <Row className={`${Styles.jobsContainer ?? ''} rowGap justify-content-center`}>
                                {vacancies.map((job) => (
                                    <Col md={6} xl={4} key={job.career_id}>
                                        <Card className={Styles.jobCard}>
                                            <CardHeader className={Styles.CardHeader}>
                                                <CardTitle as="div" className={`subtitle ${Styles.jobCardTitle ?? ''}`}>{job.career_name}</CardTitle>
                                                <Stack direction="horizontal" className={Styles.jobMeta}>
                                                    <span className={Styles.jobLocation}>{job.career_location}</span>
                                                    <span className={Styles.jobType}>Full-time</span>
                                                </Stack>
                                            </CardHeader>
                                            <CardBody className={Styles.CardBody}>
                                                <div className={Styles.jobDescription}>
                                                    <CardText>{job.career_short_description}</CardText>
                                                </div>
                                                <div className="btn_center sm">
                                                    <Link href={`/career/apply-job/${job.career_slug}`} className="eclick-btn-primary sm">Apply Now</Link>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                ))}
                                <div ref={observerRef} style={{ height: "1px" }} />

                                {isLoading && (
                                    <CardSkeleton />
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

const CardSkeleton = () => {
    return (
        <Row className={`${Styles.jobsContainer ?? ''} rowGap justify-content-center`}>
            {[...Array(2)].map((_,index) => (
                <Col md={6} xl={4} key={index}>
                    <Card className={Styles.jobCard}>
                        <CardHeader className={Styles.CardHeader}>
                            <CardTitle as="div" className={`skeleton subtitle ${Styles.subtitle ?? ''}`}>&nbsp;</CardTitle>
                            <Stack direction="horizontal" className={Styles.jobMeta}>
                                <span className={`skeleton w-25 ${Styles.jobLocation}`}>&nbsp;</span>
                                <span className={`skeleton w-25 ${Styles.jobType}`}>&nbsp;</span>
                            </Stack>
                        </CardHeader>
                        <CardBody className={Styles.CardBody}>
                            <div className={Styles.jobDescription}>
                                <div className="skeleton skeletonText"></div>
                                <div className="skeleton skeletonText"></div>
                                <div className="skeleton skeletonText"></div>
                                <div className="skeleton skeletonText d-sm-none"></div>
                                <div className="skeleton skeletonText d-sm-none"></div>
                                <div className="skeleton skeletonText w-75"></div>
                                <div className="skeleton skeletonText w-50"></div>
                            </div>
                            <div className="btn_center sm">
                                <div className="skeleton eclick-btn-primary sm w-25 mx-auto">&nbsp;</div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            ))}
        </Row>
    )
}