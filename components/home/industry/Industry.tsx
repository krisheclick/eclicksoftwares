"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Col, Container, Row } from "react-bootstrap";
import Styles from "./style.module.css";
import Skeleton from "@/components/common/Skeleton";
import CustomImage from "@/utils/CustomImage";
import { useScheduleCall } from "@/utils/useLetsConnect";
type IndustryItem = {
    industry_feature_image_path?: string;
    industry_title?: string;
    industry_short_description?: string;
    project?: {
        proj_cover_image_path: string;
        proj_name: string;
        proj_slug: string;
        proj_short_desc: string;
    }
}

const HookIndustry = () => {
    const [hasLoading, setLoading] = useState(true);
    const [data, setData] = useState<IndustryItem[]>([]);
    const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

    const fetchAPI = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}industry?is_home=1`);
            const { response_data } = await response.json();
            setData(response_data);
        } catch (err: unknown) {
            console.log('Industry API is something wrong!', (err as Error).message);
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchAPI();
    }, []);

    useEffect(() => {
        if (data.length > 0 && !activeTab) {
            setActiveTab(data[0].industry_title);
        }
    }, [data, activeTab]);

    const activeItem = data.find((item) => item.industry_title === activeTab);
    const { openScheduleModal} = useScheduleCall();
    return (
        <div className={Styles.sectionArea}>
            <Container className="container-full">
                <div className={`section-content text-center ${Styles.section_content ?? ""}`}>
                    {!hasLoading ? <h3 className={`heading text-white ${Styles.sectionHeading ?? ""}`}>Industries We Empower</h3> : <Skeleton />}
                </div>

                <hr />

                <div className={Styles.tabWrapper}>
                    <div className={Styles.navigation}>
                        <ul className="noList">
                            {hasLoading ? (
                                data?.map((value, index) => {
                                    const { industry_title, industry_feature_image_path } = value;
                                    return (
                                        <li key={index}
                                            className={`${Styles.navLink} ${activeTab === industry_title ? Styles.activeLink : ''}`}
                                            onClick={() => setActiveTab(industry_title)}
                                        >
                                            <span className={Styles.navIcon}>
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${industry_feature_image_path}`}
                                                    alt={`${industry_title} Icon` || "Industry Icon"}
                                                    fill
                                                    role="presentation"
                                                />
                                            </span>
                                            <span>{industry_title}</span>
                                        </li>
                                    )
                                })
                            ) : (
                                [...Array(8)].map((_, index) => (
                                    <li key={index} className={`${Styles.navLink}`}>
                                        <div className={`${Styles.navIcon} skeleton`}></div>
                                        <div className={`${Styles.navText} skeleton h-100`}></div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                    <div className={Styles.tabContent}>
                        <Row className="align-items-center justify-content-center gx-xxl-5 rowGap">
                            <Col lg={6} xl={7}>
                                {!hasLoading ? (
                                    <CustomImage
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${activeItem?.project?.proj_cover_image_path}`}
                                        alt={activeItem?.industry_title}
                                        className={Styles.poster}
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className={`skeleton ${Styles.poster}`}></div>
                                )}
                            </Col>
                            <Col lg={6} xl={5}>
                                {!hasLoading ? (
                                    <div className="section-content text-white">
                                        {/* <CustomImage
                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${activeItem?.industry_feature_image_path}`}
                                            alt={activeItem?.industry_title}
                                            className={Styles.icon}
                                            style={{objectFit: "scale-down"}}
                                        /> */}
                                        <div className={`title text-white ${Styles.heading}`}>{activeItem?.industry_title ?? activeItem?.project?.proj_name}</div>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: activeItem?.industry_short_description ?? '',
                                            }}
                                        />
                                        <div className="btn_left">
                                            <button type="button" onClick={() => openScheduleModal('general_schedule_a_call')} className={`eclick-btn-schedule white-btn lg ${Styles.auditBtn ?? ''}`}>
                                                <span>
                                                    <Image
                                                        className="auto-img"
                                                        src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
                                                        alt="Schedule a Call"
                                                        width={21} height={21}
                                                        priority={true}
                                                    />
                                                </span>
                                                <em>Get in Touch</em>
                                            </button>
                                            {/* <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/casestudies/${activeItem?.project?.proj_slug}`} className={`eclick-btn-audit white-btn lg ${Styles.auditBtn}`}>Get a Free Website Audit</Link> */}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`skeleton title text-white mb-2 ${Styles.heading}`}>&nbsp;</div>
                                        <div className={`skeleton title text-white w-75 ${Styles.heading}`}>&nbsp;</div>
                                        <br />
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText d-lg-none"></div>
                                        <div className="skeleton skeletonText d-lg-none"></div>
                                        <div className="skeleton skeletonText w-75"></div>
                                        <div className="skeleton skeletonText w-50"></div>
                                        <div className="btn_left">
                                            <span className={`skeleton eclick-btn-audit max-btn m-0 ${Styles.viewBtn ?? ''}`}>&nbsp;</span>
                                        </div>
                                    </>
                                )}
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default HookIndustry;
