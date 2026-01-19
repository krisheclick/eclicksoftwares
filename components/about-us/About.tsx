"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Banner from "./banner/Banner";
import Clients from "@/components/clients/Clients";
import CalltoAction from "@/components/call-to-action/CalltoAction";
import CoreServices from "../home/service/Coreservice";
import MissionVission from "./MissionVission";
import Counters from "@/components/counters/Counters";
import WhatWeDo from "./WhatWeDo";
import { Col, Container, Row } from "react-bootstrap";
import Review_rating from "./Review_rating";
import WhatsKeep from "./keep/WhatsKeep";
import Teams from "../meet-team/Teams";
import Styles from "./style.module.css";
import BannerSkeleton from "./banner/BannerSkeleton";
import CustomImage from "@/utils/CustomImage";

type UspCategory = {
    usp_category_title: string;
    usp_category_description: string;
    usps: Usp[];
}

type Usp = {
    usp_feature_image_path: string;
    usp_title: string;
    usp_short_description: string;
    usp_description: string;
    usp_feature_image: string;
}

type CounterItem = {
    site_counter_number: number;
    site_counter_simbol: string;
    site_counter_title: string;
}

type TeamMember = {
    team_feature_image_path: string;
    team_title: string;
    team_rating: string;
    team_designation: string;
    team_description: string;
    team_feature_image: string;
}

type Faq = {
    id?: number;
    question?: string;
    answer?: string;
}

type Technology = {
    id?: number;
    name?: string;
    icon?: string;
}

type BannerItem = {
    h6xu_image?: string;
    h6xu_title?: string;
    banner?: BannerItem;
}

type CounterData = {
    dz44_title?: string;
    dz44_heading?: string;
    counter?: CounterData;
};
type AboutcomponentData = {
    heading: string;
    page_feature_image: string;
    short_description: string;
    page_title: string;
    description: string;
    pages_custom_field: string;
    page_repeater_data: string;
    page_technologies_used: string | null;
    page_top_pick_team: string | null;
    page_teams_used: string;
    usp_categorys: UspCategory[];
    top_pick_team: TeamMember[] | null;
    faqs: Faq[];
    technologies: Technology[];
    recommend_team: TeamMember[];
    counter_data: string;
}
const Aboutcomponent = () => {
    const [aboutData, setAboutData] = useState<AboutcomponentData | null>(null);
    const [bannerData, setBannerData] = useState<BannerItem | null>(null);
    const [teamData, setTeam] = useState<TeamMember[] | null>(null);
    const [counterData, setCounterData] = useState<CounterData | null>(null);
    const [hasLoading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/about-us`);
            const { response_data } = await response.json();

            setAboutData(response_data);
            setTeam(response_data?.recommend_team);
        } catch (err: unknown) {
            console.error("Failed to fetch About Page:", (err as Error).message);
        } finally {
            setLoading(false);
        };
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (aboutData) {
            if (aboutData?.pages_custom_field) {
                try {
                    const customResponse = JSON.parse(aboutData?.pages_custom_field ?? "{}");
                    const data = customResponse?.group_name;
                    setBannerData(data?.banner);
                    setCounterData(data?.counter);

                } catch (err: unknown) {
                    console.error("Error parsing custom field data:", (err as Error).message);
                }
            }
        }
    }, [aboutData]);

    const counters: CounterItem[] = JSON.parse(
        aboutData?.counter_data ?? "[]"
    );

    const customData = JSON.parse(
        aboutData?.pages_custom_field ?? "{}"
    );

    return (
        <div className="about_page">
            {!hasLoading && bannerData ? (
                <Banner data={bannerData} />
            ) : (
                <BannerSkeleton />
            )}
            <div className={`sectionArea pt-3 ${Styles.about_section ?? ''}`}>
                <Container>
                    <Row className="rowGap gx-xl-5 align-items-center">
                        <Col lg={6}>
                            {!hasLoading ? (
                                <CustomImage
                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${aboutData?.page_feature_image}`}
                                    alt={aboutData?.page_title}
                                    className={Styles.aboutPoster}
                                    style={{ objectFit: "cover" }}
                                />
                            ) : (
                                <figure className={`skeletonPoster ${Styles.aboutPoster}`}>
                                    <div className="skeleton skeletonFill"></div>
                                </figure>
                            )}
                        </Col>
                        <Col lg={6}>
                            <div className={`ps-4 ${Styles.about_content}`}>
                                {!hasLoading ? (
                                    <>
                                        <h2 className={`title fw-bold ${Styles.page_title}`}>{aboutData?.page_title}</h2>
                                        <div
                                            className="editorText"
                                            dangerouslySetInnerHTML={{ __html: aboutData?.description || "" }}
                                        />
                                        <Review_rating hasLoading={hasLoading} data={customData?.group_name} />
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
                    </Row>
                </Container>
            </div>

            <CalltoAction spaceClass={Styles.spaceAdd} content={customData?.group_name} isLoading={hasLoading} />
            {aboutData?.usp_categorys?.[1] && (
                <WhatWeDo
                    isLoading={hasLoading}
                    data={aboutData.usp_categorys[1]}
                    services={
                        aboutData.usp_categorys[1].usps.map((item: Usp) => ({
                            wcp_title: item.usp_title,
                            wcp_short_description: item.usp_description,
                            wcp_icon_path: item.usp_feature_image_path,
                            wcp_icon: item.usp_feature_image,
                            wcp_slug: ''
                        }))
                    }
                />
            )}

            <MissionVission hasLoading={hasLoading} data={customData?.group_name} />
            <CoreServices />
            <div className={Styles.counter_section}>
                <Container>
                    <div className={`section-content ${Styles.section_content ?? ''}`}>
                        {!hasLoading ? (
                            <>
                                {counterData?.dz44_title && (
                                    <div className="small_title">{counterData.dz44_title}</div>
                                )}

                                <div className={`title fw-bold ${Styles.title ?? ''}`}
                                    dangerouslySetInnerHTML={{ __html: counterData?.dz44_heading || '' }}
                                />
                            </>
                        ) : (
                            <>
                                {counterData?.dz44_title && (
                                    <div className="skeleton skeletonSmallTitle"></div>
                                )}
                                <div className={Styles.skeletonTitleWrapper}>
                                    <div className={`skeleton w-100 mb-2 ${Styles.skeletonTitle}`}></div>
                                    <div className={`skeleton w-50 ${Styles.skeletonTitle}`}></div>
                                </div>
                            </>
                        )}
                    </div>
                    <Counters hasLoading={hasLoading} counters={counters} />
                </Container>
            </div>
            {aboutData?.usp_categorys?.[0] && (
                <WhatsKeep
                    hasLoading={hasLoading}
                    data={aboutData?.usp_categorys?.[0]}
                />
            )}

            {teamData && (
                <Teams hasLoading={hasLoading} content={customData?.group_name} data={teamData} />
            )}
            <Clients classValue={"fullBox"} />
        </div>
    );
};

export default Aboutcomponent;
