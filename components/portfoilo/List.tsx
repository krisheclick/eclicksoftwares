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

    return (
        <>
            <div className={Styles.smallList}>
                <Row className="rowGap">
                    {data.map((value, index) => {
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
                        )
                    }
                    )}
                </Row>
            </div>
            <div className={`btn_center ${Styles.btn_center ?? ''}`}>
                <Link href={`javascript:void(0);`} className="eclick-btn-portfolio lg">View More Portfolio</Link>
            </div>
        </>
    );
};

export default PortfolioList;
