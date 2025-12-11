"use client";
import { Col, Container, Row } from "react-bootstrap";
import Styles from "../casestudy.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faLink, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type CasestudyList = {
    proj_feature_image_path?: string;
    proj_responsive_image_1_path?: string;
    proj_responsive_image_2_path?: string;
    proj_name?: string;
    proj_slug?: string;
    proj_short_desc?: string;
    proj_tools_used?: string;
}

const Casestudymain = () => {
    const [hasLoading, setLoading] = useState(true);
    const [data, setData] = useState<CasestudyList[]>([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState();

    const fetchAPI = async (pageNumber: number) => {
        const postPerpage = 2;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}project?limit=${postPerpage}&page=${pageNumber}`);
            const { response_data } = await response.json();

            if (pageNumber === 1) {
                setData(response_data?.data || []);
            } else {
                setData((prev) => [...prev, ...(response_data?.data || [])]);
            }

            setHasNext(response_data?.pagination?.has_next);
        } catch (err: unknown) {
            console.log('Case Study API is something wrong:', (err as Error).message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAPI(1);
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage)
        fetchAPI(nextPage);
    };
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

                <section className={Styles.CasestudyList}>
                    {!hasLoading ? (
                        data?.map((value, index) => {
                            console.log('value', value)
                            const { proj_feature_image_path, proj_responsive_image_1_path, proj_responsive_image_2_path, proj_name, proj_slug, proj_short_desc, proj_tools_used } = value;

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
                                                <p dangerouslySetInnerHTML={{ __html: proj_short_desc ?? '' }} />
                                            </div>
                                            {value.proj_tools_used && (
                                                <div className={Styles.workingTag}>
                                                    <ul>
                                                        {tools.map((tool, toolIndex) => (
                                                            <li key={toolIndex}>{tool.name}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            <div className={Styles.viewButton}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/casestudies/${proj_slug}`}> <span className={Styles.iconText}><FontAwesomeIcon icon={faEye} /></span>View Case Study</Link>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={7}>
                                        <section className={Styles.imageSection}>
                                            <div className={Styles.fremeTag}>
                                                <ul>
                                                    <li className={Styles.buttonAnimate}>#Ecommerce</li>
                                                    <li className={Styles.buttonAnimate}>#Figma UI/UX</li>
                                                </ul>
                                            </div>
                                            <figure className={Styles.largeImage}>
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/casestudy1.png`}
                                                    alt="Linda Jewellers"
                                                    width={672} height={572}
                                                    property="true"
                                                />
                                            </figure>
                                            <figure className={Styles.smallImage + ' ' + Styles.buttonAnimate}>
                                                <div className={Styles.underSection}>
                                                    <div className={Styles.smallIm}>
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/smallimg1.jpg`}
                                                            alt="Linda Jewellers"
                                                            width={116} height={240}
                                                            property="true"
                                                        />
                                                    </div>
                                                    <div className={Styles.smallIm}>
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/smallimg2.jpg`}
                                                            alt="Linda Jewellers"
                                                            width={111} height={211}
                                                            property="true"
                                                        />
                                                    </div>
                                                </div>
                                            </figure>
                                        </section>
                                    </Col>
                                </Row>
                            )
                        })
                    ) : (
                        <p>Skeleton Loader</p>
                    )}
                </section>
                {/* ======= casestudy List ======= */}
                <section className={Styles.smallList}>
                    <Row>
                        <Col lg={6}>
                            <div className={Styles.rowList}>
                                <Row>
                                    <Col lg={6}>
                                        <figure>
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/small01.jpg`}
                                                alt="Luxury Watch Ecommerce Platform"
                                                width={295} height={328}
                                                property="true"
                                            />
                                        </figure>
                                    </Col>
                                    <Col lg={6}>
                                        <aside>
                                            <h2>Luxury Watch Ecommerce Platform</h2>
                                            <p>A liquor / wine-ecommerce site, primarily B2C (selling to consumers).</p>
                                            <ul>
                                                <li>
                                                    <span>Used framework</span>
                                                    #WordPress
                                                </li>
                                                <li>
                                                    <span>UI/UX/prototype</span>
                                                    #Figma
                                                </li>
                                            </ul>
                                            <div className={Styles.listTarget}>
                                                <Link href="#"><FontAwesomeIcon icon={faLink} />   Smooth Flow</Link>
                                            </div>
                                        </aside>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className={Styles.rowList}>
                                <Row>
                                    <Col lg={6}>
                                        <figure>
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/small02.jpg`}
                                                alt=""
                                                width={295} height={328}
                                                property="true"
                                            />
                                        </figure>
                                    </Col>
                                    <Col lg={6}>
                                        <aside>
                                            <h2>Handcrafted Beauty, Designed with Soul.</h2>
                                            <p>Discover timeless jewellery made by hand, with heart.</p>
                                            <ul>
                                                <li>
                                                    <span>Used framework</span>
                                                    #WordPress
                                                </li>
                                                <li>
                                                    <span>UI/UX/prototype</span>
                                                    #Figma
                                                </li>
                                            </ul>
                                            <div className={Styles.listTarget}>
                                                <Link href="#"><FontAwesomeIcon icon={faLink} />Evalet</Link>
                                            </div>
                                        </aside>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </section>
                {/* ======= casestudy List end======= */}

                {/* ======= Load More Button ======= */}
                {hasNext && (
                    <div className={Styles.loadMore}>
                        <button
                            className={Styles.loadMoreBtn}
                            onClick={handleLoadMore}
                            disabled={hasLoading}
                        >
                            <FontAwesomeIcon icon={faSpinner} spin={hasLoading} />{" "}
                            {hasLoading ? "Loading..." : "Load More"}
                        </button>
                    </div>
                )}

            </Container>
        </section>
    )
}

export default Casestudymain