"use client";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import Styles from "./style.module.css";
import Skeleton from "@/components/common/Skeleton";

type ClientData = {
    id?: number;
    client_id?: number;
    client_name: string;
    client_logo: string;
};

type IndustryClientsData = {
    industry_id: number;
    industry_title: string;
    industry_feature_image_path: string;
    industry_feature_image?: string;
    clients?: ClientData[];
};

const IndustryWiseClients = () => {
    const [hasLoading, setLoading] = useState(true);
    const [data, setData] = useState<IndustryClientsData[]>([]);

    const fetchAPI = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}industry?with_client=1`);
            const { response_data } = await response.json();
            
            if (response_data && response_data.length > 0) {
                setData(response_data);
            }
        } catch (err: unknown) {
            console.log('Industry with Clients data error:', (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAPI();
    }, []);

    return (
        <div className={Styles.industryWiseClients}>
            <Container>
                <div className={`${Styles.sectionHeader} text-center mb-5`}>
                    {!hasLoading ? (
                        <>
                            <h2 className={`${Styles.sectionTitle}`}>Our Clients by Industry</h2>
                            <p className={Styles.sectionDesc}>
                                We have worked with leading companies across various industries
                            </p>
                        </>
                    ) : (
                        <>
                            <div className={`skeleton ${Styles.skeletonTitle}`}></div>
                            <div className={`skeleton ${Styles.skeletonDesc}`}></div>
                        </>
                    )}
                </div>

                {/* Industry Sections */}
                <div className={`${Styles.industriesContainer}`}>
                    {!hasLoading ? (
                        data.map((industry, index) => (
                            <>
                            {/* Clients Grid */}
                            {industry.clients && industry.clients.length > 0 ? (
                                <div key={index} className={Styles.industrySection}>
                                    {/* Industry Header */}
                                    <div className={Styles.industryHeader}>
                                        <div className={Styles.industryIcon}>
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${industry.industry_feature_image_path}`}
                                                alt={industry.industry_title}
                                                width={40}
                                                height={40}
                                            />
                                        </div>
                                        <h3 className={Styles.industryTitle}>{industry.industry_title}</h3>
                                    </div>
                                    <Row className={`gx-3 gy-4 ${Styles.clientsGrid}`}>
                                        {industry.clients.map((client) => (
                                            <Col lg={2} md={3} sm={4} xs={6} key={client.client_id || client.id}>
                                                <div className={Styles.clientCard}>
                                                    <div className={Styles.clientLogo}>
                                                        <Image
                                                            src={client.client_logo
                                                                ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${client.client_logo}`
                                                                : "/placeholder-logo.png"
                                                            }
                                                            alt={client.client_name}
                                                            fill
                                                            style={{ objectFit: "contain" }}
                                                            priority={false}
                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            ) : ''}
                            </>

                                
                        ))
                    ) : (
                        <div className={Styles.loadingContainer}>
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className={Styles.industrySection}>
                                    <div className={`skeleton ${Styles.skeletonIndustryHeader}`}></div>
                                    <Row className="gx-3 gy-4">
                                        {[...Array(4)].map((_, i) => (
                                            <Col lg={3} md={4} sm={6} xs={12} key={i}>
                                                <div className={`skeleton ${Styles.skeletonClient}`}></div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default IndustryWiseClients;
