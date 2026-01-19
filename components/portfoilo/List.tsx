"use client";
import { Col, Row } from "react-bootstrap";
import Styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useLetsConnect } from "@/utils/useLetsConnect";
import { useEffect, useState } from "react";
import Card from "../casestudy/card/Card";
import Cardskeleton from "../casestudy/card/Cardskeleton";

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

    const { openLetsConnectModal } = useLetsConnect();

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
        return <p className="notFound text-center">Website Design Portfolio items not found.</p>;
    }

    return (
        <>
            <div className={Styles.caseList}>
                <Row className="rowGap">
                    {!hasLoading ? (
                        data?.map((item, index) => (
                            <Col lg={6} key={index}>
                                <Card
                                    poster={item.proj_feature_image_path}
                                    slug={item.proj_slug}
                                    title={item.proj_name}
                                    projectName={item.proj_name}
                                    proj_short_desc={item.proj_short_desc}
                                />
                            </Col>
                        ))
                    ) : (
                        [...Array(6)].map((_, index) => (
                            <Cardskeleton key={index} />
                        ))
                    )}
                </Row>
            </div>
            {!hasLoading && data.length > 0 && (
                <div className={`btn_center ${Styles.btn_center ?? ''}`}>
                    <button type="button" className={`eclick-btn-view lg ${Styles.viewBtn ?? ''}`} onClick={() => openLetsConnectModal("general_lets_connect")}>
                        <span>
                            <FontAwesomeIcon icon={faEye} />
                        </span>
                        <em>View More Portfolio</em>
                    </button>
                </div>
            )}
        </>
    );
};

export default PortfolioList;
