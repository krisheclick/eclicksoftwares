"use client";
import { Col, Container, Row } from "react-bootstrap";
import Styles from "./style.module.css";
import { useEffect, useState } from "react";
import Card from "./card/Card";

type CasestudyList = {
    proj_feature_image_path?: string;
    proj_responsive_image_1_path?: string;
    proj_responsive_image_2_path?: string;
    proj_name?: string;
    proj_slug?: string;
    proj_short_desc?: string;
    proj_tools_used?: string;
};
const CasestudyList = () => {
    const [hasLoading, setLoading] = useState(true);
    const [data, setData] = useState<CasestudyList[]>([]);
    const [tabActive, setActiveTab] = useState<'videos' | 'written'>('videos');

    // const [page, setPage] = useState(1);
    // const [hasMore, setHasMore] = useState(true);
    // const [hasNext, setHasNext] = useState(false);
    // const loaderRef = useRef<HTMLDivElement | null>(null);

    const fetchAPI = async (pageNumber: number) => {
        const postPerpage = 10;
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

            // setHasNext(response_data?.pagination?.has_next);
        } catch (err: unknown) {
            console.log("Case Study API error:", (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAPI(1);
    }, []);

    // useEffect(() => {
    //     if (!loaderRef.current) return;

    //     const observer = new IntersectionObserver(
    //         (entries) => {
    //             const target = entries[0];
    //             if (target.isIntersecting && hasNext && !hasLoading) {
    //                 const nextPage = page + 1;
    //                 setPage(nextPage);
    //                 setLoading(true);

    //                 setTimeout(() => {
    //                     fetchAPI(nextPage);
    //                 }, 2000);
    //             }
    //         },
    //         { root: null, rootMargin: "0px", threshold: 1.0 }
    //     );

    //     observer.observe(loaderRef.current);

    //     return () => {
    //         if (loaderRef.current) observer.unobserve(loaderRef.current);
    //     };
    // }, [hasNext, hasLoading, page]);



    // const filteredData = data.filter(item => {
    //     if (tabActive === 'videos') {
    //         return item.testimonial_type === 'video';
    //     }
    //     return item.testimonial_type !== 'video';
    // });

    return (
        <div className={`sectionArea ${Styles.casestudies_section ?? ''}`}>
            <Container>
                <div className={Styles.tabList}>
                    {!hasLoading ? (
                        <ul className="noList">
                            <li
                                className={`${Styles.tabItem} ${data ? Styles.active : ''}`}
                            >
                                Website Design
                            </li>
                            <li
                                className={`${Styles.tabItem}`}
                            >
                                Digital Marketing
                            </li>
                        </ul>
                    ) : (
                        <p></p>
                    )}
                </div>
                <div className={Styles.caseList}>
                    <Row className="rowGap">
                        {!hasLoading ? (
                            data?.map((value, index) => {
                                return (
                                    <Col lg={6} key={index}>
                                        <Card
                                            title={value?.proj_name}
                                            projectName={value?.proj_name}
                                            slug={value?.proj_slug}
                                            poster={value?.proj_feature_image_path}
                                        />
                                    </Col>
                                )
                            })
                        ) : (
                            <></>
                        )}
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default CasestudyList;