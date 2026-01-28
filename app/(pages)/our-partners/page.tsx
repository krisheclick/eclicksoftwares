"use client";
import Banner from "@/components/our-partner/Banner";
import { useEffect, useState } from 'react';
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import Styles from "./style.module.css";
import List from "@/components/organization/List";
import Developer from "@/components/hire-developer/Developer";
import Faq from "@/components/hire-developer/faq/Faq";
import { useScheduleCall } from "@/utils/useLetsConnect";

type PageData = {
    id: number;
    heading: string;
    page_feature_image: string;
    short_description: string;
    page_title: string;
    description: string;
    pages_custom_field: string; // JSON string
    page_repeater_data: string;
    usp_categorys: UspCategory[];
    faqs: Faq[];
    counter_data: string; // JSON string
};

type UspCategory = {
    usp_category_title: string;
    usp_category_description: string;
    usps: Usp[];
};

type Usp = {
    usp_feature_image_path: string;
    usp_title: string;
    usp_short_description: string;
    usp_description: string;
    usp_feature_image: string;
};

type Faq = {
    faq_title: string;
    faq_description: string;
};


type PagesCustomField = {
    banner?: Banner;
    program?: Program;
    faq: CustomFaq;
    slug: string[];
};

type Banner = {
    name: string;
    is_compoment: string;
    z6hd_title: string;
    z6hd_short_description: string;
    z6hd_button_name: string;
    z6hd_button_link: string;
    z6hd_image: string;
};

type Program = {
    name: string;
    is_compoment: string;
    nplh_title_1: string;
    nplh_heading_1: string;
    nplh_description_1: string;
    nplh_title_2: string;
    nplh_heading_2: string;
    nplh_description_2: string;
};

type CustomFaq = {
    name: string;
    is_compoment: string;
    khft_title: string;
    khft_description: string;
    khft_button_name: string;
    khft_button_link: string;
};

const Partnerships = () => {
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [hasLoading, setLoading] = useState(true);
    const [bannerData, setBannerData] = useState<Banner | null>(null);
    const [pageCustomField, setPageCustomField] = useState<PagesCustomField | null>(null);
    const [processData, setProcessData] = useState<UspCategory | null>(null);
    const { openScheduleModal } = useScheduleCall();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/our-partners`);
            const { response_data } = await response.json();

            setPageData(response_data);
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
        if (pageData) {
            if (pageData?.pages_custom_field) {
                try {
                    const customResponse = JSON.parse(pageData?.pages_custom_field ?? "{}");
                    const data = customResponse?.group_name;
                    setBannerData(data?.banner);
                    setProcessData(pageData?.usp_categorys[0])
                    setPageCustomField(data)

                } catch (err: unknown) {
                    console.error("Error parsing custom field data:", (err as Error).message);
                }
            }
        }
    }, [pageData]);

    return (


        <div className="about_page">

            {/* ================= PARTNER-BANNER-STARTS ================= */} 
            {bannerData && (
                <Banner hasLoading={hasLoading} data={bannerData} />
            )}
            {/* ================= PARTNER-BANNER-ENDS ================= */}


            {/* ================= PARTNER-ABOUT-STARTS ================= */}
            <div className={`sectionArea pt-3 ${Styles.about_section ?? ''}`}>
                <Container>
                    <Row className="rowGap gx-xl-5 align-items-center">
                        <Col lg={6}>
                            <figure className={Styles.aboutPoster}>
                                {!hasLoading ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${pageData?.page_feature_image}`}
                                        alt={pageData?.page_title ?? "Card Poster"}
                                        fill
                                        priority
                                        style={{ objectFit: "cover" }}
                                    />
                                ) : (
                                    <div className='skeleton skeletonFill'></div>
                                )}
                            </figure>
                        </Col>
                        <Col lg={6}>
                            <div className={`${Styles.about_content}`}>
                                {!hasLoading ? (
                                    <>
                                        <div className={`small_title ${Styles.lablheading ?? ''}`}>{pageData?.short_description}</div>
                                        <h2 className={`title fw-bold ${Styles.partab_mheading ?? ''}`}>{pageData?.page_title}</h2>
                                        <div className={Styles.editorTextpartner}>
                                            <div className="editorText" dangerouslySetInnerHTML={{ __html: pageData?.description || "" }}/>
                                        </div>
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
            {/* ================= PARTNER-ABOUT-ENDS ================= */}                        


            {/* ================= PARTNERSHIP-PROGRAMS-RJ-STARTS ================= */}              
            <div className={`sectionArea ${Styles.processSection ?? ''}`}>
                <Container>
                    <div className={`section-content full text-center ${Styles.section_content ?? ''}`}>
                        {!hasLoading ? (
                            <h3 className={`title fw-normal ${Styles.title ?? ''}`}
                                dangerouslySetInnerHTML={{ __html: processData?.usp_category_title ?? '' }}
                            />
                        ) : (
                            <div className="skeleton w-100 skeletonTitle"></div>
                        )}
                    </div>
                    <List isLoading={hasLoading} process_steps={processData?.usps.map((item) => ({
                        name: item.usp_title ?? '',
                        title: item.usp_title ?? '',
                        description: item.usp_description ?? '',
                        filename: item.usp_feature_image_path ?? ''
                    })) ?? []
                    } />
                </Container>
            </div>
            {/* ================= PARTNERSHIP-PROGRAMS-RJ-ENDS ================= */}


            {/* ================= RESELLER-MARKETING-STARTS ================= */}              
            <div className={`sectionAreaa ${Styles.processSection ?? ''}`}>
                <Container className={Styles.reselmarketsec}>
                    {pageCustomField?.program && (
                        <Row>
                            <Col lg={6}>
                                <div className={Styles.reslsbbg}>
                                    <div className={Styles.lablheading}>{pageCustomField?.program.nplh_title_1}</div>
                                    <h3 className={Styles.maleb_mheading}>{pageCustomField?.program.nplh_heading_1}</h3>
                                    <div className={Styles.resamr_paraul}>
                                        <div dangerouslySetInnerHTML={{__html:pageCustomField?.program.nplh_description_1}}/>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={6}>    
                                <div className={Styles.marksbbg}>                     
                                    <div className={Styles.lablheading}>{pageCustomField?.program.nplh_title_2}</div>
                                    <h3 className={Styles.maleb_mheading}>{pageCustomField?.program.nplh_heading_2}</h3>
                                    <div className={Styles.resamr_paraul}>
                                        <div dangerouslySetInnerHTML={{__html:pageCustomField?.program.nplh_description_2}}/>
                                    </div>
                                </div>   
                            </Col>
                        </Row>   
                    )}
                    
                </Container>
            </div>
            {/* ================= RESELLER-MARKETING-ENDS ================= */}


            {/* ================= VALUES-BUSINESS-STARTS ================= */}      
            <div className={Styles.valuesbus_partner}>     
                {pageData && (
                    <Developer 
                        hasLoading={hasLoading} 
                        data={pageData?.usp_categorys[1]} 
                        whiteClass={true} 
                        separateText={true}
                        isButton={false}
                        boxClass3={true}
                    />
                )}
            </div>
            {/* ================= VALUES-BUSINESS-ENDS ================= */}


            {/* ================= FAQ-STARTS ================= */}
            {pageData && pageData?.faqs?.length > 0 && (
                <div className={`sectionArea ${Styles.faqSectionsam ?? ''}`}>
                    <Container>
                        <Row className={Styles.row}>
                            <Col lg={5}>
                                <div className={Styles.hmfaq_tpbx}>
                                    <h2 className={Styles.hwdtilte}>{pageCustomField?.faq?.khft_title}</h2>
                                    <div className={`${Styles.hwdtiltepara} ${Styles.hwdtectiltepara}`}
                                        dangerouslySetInnerHTML={{ __html: pageCustomField?.faq?.khft_description || '' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => openScheduleModal('general_schedule_a_call')}
                                        className={`eclick-btn-schedule ${Styles.scheduleBtn ?? ''}`}
                                    >
                                        <span>
                                            <Image
                                                className="auto-img"
                                                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
                                                alt={"Schedule a Call"}
                                                width={21} height={21}
                                                priority={true}
                                            />
                                        </span>
                                        <em>Schedule a Call</em>
                                    </button>
                                </div>
                            </Col>

                            <Col lg={7}>
                                <Faq hasLoading={hasLoading} data={pageData?.faqs} />
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
            {/* ================= FAQ-ENDS ================= */}

        </div>
    )
}

export default Partnerships
