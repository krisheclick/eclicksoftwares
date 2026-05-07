"use client";
import { useEffect, useState } from "react";
import { Container, Row, Col, Stack } from "react-bootstrap";
import Image from "next/image";
import Styles from "./style.module.css";
import CustomImage from "@/utils/CustomImage";

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
        <div className={`sectionArea ${Styles.industryWiseClients}`}>
            <Container>
                <div className={`section-content max-content text-center ${Styles.sectionHeader ?? ''}`}>
                    {!hasLoading ? (
                        <>
                            <h2 className={`heading ${Styles.heading ?? ''}`}>Clients Across Industries</h2>
                            <p className={Styles.sectionDesc}>
                                We have worked with leading companies across various industries
                            </p>
                        </>
                    ) : (
                        <>
                            <div className={`heading skeleton w-75 ${Styles.heading}`}>&nbsp;</div>
                            <div className={`skeleton skeletonText ${Styles.sectionDesc}`}></div>
                        </>
                    )}
                </div>

                <div className={Styles.industriesContainer}>
                    <Stack className={Styles.clientsGrid}>
                        {!hasLoading ? (
                            data.map((industry, industryIndex) => (
                                industry.clients && industry.clients.length > 0 && (
                                    industry.clients.map((client, clientIndex) => (
                                        <Stack 
                                            className={Styles.clientCard}
                                            key={
                                                client.client_id
                                                    ? `client-${client.client_id}`
                                                    : `industry-${industryIndex}-client-${clientIndex}`
                                            }
                                        >
                                            <div className={Styles.clientCardPoster}>
                                                <CustomImage
                                                    src={client.client_logo
                                                        ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${client.client_logo}`
                                                        : "/placeholder-logo.png"
                                                    }
                                                    alt={client.client_name}
                                                    className={Styles.clientLogo}
                                                />
                                            </div>
                                            <div className={Styles.industryTitle}>
                                                <span>Industry: </span>
                                                {industry.industry_title}
                                            </div>
                                        </Stack>
                                    ))
                                )
                            ))
                        ) : (
                            [...Array(12)].map((_, i) => (
                                <Stack className={Styles.clientCard} key={i}>
                                    <div className={Styles.clientCardPoster}>
                                        <div className={`skeleton ${Styles.clientLogo}`}></div>
                                    </div>
                                    <div className={`skeleton w-25 ${Styles.industryTitle ?? ''}`}>&nbsp;</div>
                                    <div className={`skeleton ${Styles.industryTitle ?? ''}`}>&nbsp;</div>
                                </Stack>
                            ))
                        )}

                    </Stack>
                </div>
            </Container>
        </div>
    );
};

export default IndustryWiseClients;
