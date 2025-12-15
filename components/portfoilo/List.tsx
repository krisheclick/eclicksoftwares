"use client";
import { Col, Row } from "react-bootstrap";
import Styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
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
};

const PortfolioList = () => {
    const [hasLoading, setLoading] = useState(true);
    const [data, setData] = useState<CasestudyList[]>([]);

    const fetchAPI = async (pageNumber: number) => {
        const postPerpage = 6;
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}project?limit=${postPerpage}&page=${pageNumber}`
            );
            const { response_data } = await response.json();
            setData(response_data?.data || []);
        } catch (err: unknown) {
            console.log("Case Study API error:", (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAPI(1);
    }, []);


    if (data.length === 0) {
        return <p className="notFound text-center">Website Design Portfolio items found.</p>;
    }

    return (
        <>
            <div className={Styles.smallList}>
                <Row className="rowGap">
                    {!hasLoading ? (
                        data.map((value, index) => {
                            const {
                                proj_feature_image_path,
                                proj_name,
                                proj_short_desc,
                                proj_tools_used,
                                proj_slug
                            } = value;

                            let tools: { name?: string; value?: string }[] = [];
                            if (typeof proj_tools_used === "string") {
                                try {
                                    tools = JSON.parse(proj_tools_used);
                                } catch (err) {
                                    console.error("Error parsing proj_tools_used:", err);
                                }
                            }
                            return (
                                <Col lg={6} key={index}>
                                    <div className={Styles.rowList}>
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
                                    </div>
                                </Col>
                            )
                        }
                        )
                    ) : (
                        [...Array(4)].map((_, index) => (
                            <Col lg={6} key={index}>
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
                            </Col>
                        ))
                    )}
                </Row>
            </div>
            <div className={`btn_center ${Styles.btn_center ?? ''}`}>
                <Link href="#" className="eclick-btn-portfolio lg">View More Portfolio</Link>
            </div>
        </>
    );
};

export default PortfolioList;
