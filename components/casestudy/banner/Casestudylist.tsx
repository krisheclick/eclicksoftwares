"use client";
import { Col, Container, Row } from "react-bootstrap";
import Styles from "../casestudy.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faLink, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type CasestudyList = {
    proj_feature_image_path?: string;
    proj_responsive_image_1_path?: string;
    proj_responsive_image_2_path?: string;
    proj_name?: string;
    proj_slug?: string;
    proj_short_desc?: string;
    proj_tools_used?: string;
};

const Casestudymain = () => {
    const [hasLoading, setLoading] = useState(true);
    const [data, setData] = useState<CasestudyList[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [hasNext, setHasNext] = useState(false);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const fetchAPI = async (pageNumber: number) => {
        const postPerpage = 4;
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}project?limit=${postPerpage}&page=${pageNumber}`
            );
            const { response_data } = await response.json();

            if (pageNumber === 1) {
                setData(response_data?.data || []);
            } else {
                setData((prev) => [...prev, ...(response_data?.data || [])]);
            }

            setHasNext(response_data?.pagination?.has_next);
        } catch (err: unknown) {
            console.log("Case Study API error:", (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAPI(1);
    }, []);
    
    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && hasNext && !hasLoading) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    setLoading(true);

                    setTimeout(() => {
                        fetchAPI(nextPage);
                    }, 2000);
                }
            },
            { root: null, rootMargin: "0px", threshold: 1.0 }
        );

        observer.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [hasNext, hasLoading, page]);


    // ================= SPLIT DATA =================
    const firstFour = data.slice(0, 4);
    const remaining = data.slice(4);

    // ================= UI =================
    return (
        <section className={Styles.mainSection}>
            <Container>
                <Row>
                    <Col lg={12}>
                        <div className={Styles.listTopTitle}>
                            <h4>
                                Real results. Real impact. Stories of how Eclick.
                                <span>turns challenges into growth.</span>
                            </h4>
                        </div>
                    </Col>
                </Row>

                {/* ======= First Four (Large layout) ======= */}
                <section className={Styles.CasestudyList}>
                    {!hasLoading ? (
                        firstFour.map((value, index) => {
                            const {
                                proj_feature_image_path,
                                proj_responsive_image_1_path,
                                proj_responsive_image_2_path,
                                proj_name,
                                proj_slug,
                                proj_short_desc,
                                proj_tools_used,
                            } = value;

                            let tools: { name?: string; value?: string }[] = [];
                            if (typeof proj_tools_used === "string") {
                                try {
                                    tools = JSON.parse(proj_tools_used);
                                } catch (err) {
                                    console.error("Error parsing proj_tools_used:", err);
                                }
                            } else if (Array.isArray(proj_tools_used)) {
                                tools = proj_tools_used;
                            }

                            return (
                                <Row key={index} className={Styles.repetList}>
                                    <Col lg={5}>
                                        <div className={Styles.listLeftPart}>
                                            <div className={Styles.tagline}>{proj_name}</div>
                                            <div className={Styles.portfolioName}>{proj_name}</div>
                                            <div className={Styles.shortDesc}>
                                                <p
                                                    dangerouslySetInnerHTML={{
                                                        __html: proj_short_desc ?? "",
                                                    }}
                                                />
                                            </div>
                                            {tools.length > 0 && (
                                                <div className={Styles.workingTag}>
                                                    <ul>
                                                        {tools.slice(0, 2).map((tool, i) => (
                                                            <li key={i}>{tool.name}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            <div className={Styles.viewButton}>
                                                <Link
                                                    href={`${process.env.NEXT_PUBLIC_ENV_URL}/casestudies/${proj_slug}`}
                                                >
                                                    <span className={Styles.iconText}>
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </span>
                                                    View Case Study
                                                </Link>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={7}>
                                        <section className={Styles.imageSection}>
                                            <div className={Styles.fremeTag}>
                                                <ul>
                                                    {tools.slice(0, 2).map((tool, i) => (
                                                        <li className={Styles.buttonAnimate} key={i}>#{tool.name}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <figure className={Styles.largeImage}>
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${proj_feature_image_path}`}
                                                    alt={proj_name ?? ""}
                                                    width={672}
                                                    height={572}
                                                />
                                            </figure>
                                            <figure className={Styles.smallImage + ' ' + Styles.buttonAnimate}>
                                                <div className={Styles.underSection}>
                                                    <div className={Styles.smallIm}>
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${proj_responsive_image_1_path}`}
                                                            alt={proj_name ?? ""}
                                                            width={116} height={240}
                                                            property="true"
                                                        />
                                                    </div>
                                                    <div className={Styles.smallIm}>
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${proj_responsive_image_2_path}`}
                                                            alt={proj_name ?? ""}
                                                            width={111} height={211}
                                                            property="true"
                                                        />
                                                    </div>
                                                </div>
                                            </figure>
                                        </section>
                                    </Col>
                                </Row>
                            );
                        })
                    ) : (
                        <p>Skeleton Loader</p>
                    )}
                </section>

                {/* ======= Remaining Items (Small layout) ======= */}
                <section className={Styles.smallList}>
                    <Row className="rowGap">
                    {remaining.map((value, index) => {
                        let tools: { name?: string; value?: string }[] = [];
                        if (typeof value.proj_tools_used === "string") {
                            try {
                                tools = JSON.parse(value.proj_tools_used);
                            } catch (err) {
                                console.error("Error parsing proj_tools_used:", err);
                            }
                        } else if (Array.isArray(value.proj_tools_used)) {
                            tools = value.proj_tools_used;
                        }
                        return (
                            <Col lg={6} key={index}>
                                <div className={Styles.rowList}>
                                    <Row>
                                        <Col lg={6}>
                                            <figure>
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${value.proj_feature_image_path}`}
                                                    alt={value.proj_name ?? ""}
                                                    width={295}
                                                    height={328}
                                                />
                                            </figure>
                                        </Col>
                                        <Col lg={6}>
                                            <aside>
                                                <h2>{value.proj_name}</h2>
                                                <p
                                                    dangerouslySetInnerHTML={{
                                                        __html: value.proj_short_desc ?? "",
                                                    }}
                                                />
                                                <ul>
                                                    {tools.slice(0, 2).map((tool, i) => (
                                                        <li key={i}><span className="d-block">{tool.name}</span>{tool.value}</li>
                                                    ))}
                                                </ul>
                                                <div className={Styles.listTarget}>
                                                    <Link
                                                        href={`${process.env.NEXT_PUBLIC_ENV_URL}/casestudies/${value.proj_slug}`}
                                                    >
                                                        <FontAwesomeIcon icon={faLink} /> View Case Study
                                                    </Link>
                                                </div>
                                            </aside>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        )}
                    )}
                    </Row>
                </section>

                {/* ======= Infinite Scroll Loader ======= */}
                {hasNext && (
                    <div ref={loaderRef} className={Styles.loadMore}>
                        <FontAwesomeIcon icon={faSpinner} spin /> Loading more...
                    </div>
                )}
            </Container>
        </section>
    );
};

export default Casestudymain;
