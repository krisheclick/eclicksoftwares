"use client";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Container, Stack } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faCube, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import Styles from "./style.module.css";
import CustomImage from "@/utils/CustomImage";

type ClientData = {
    id?: number;
    client_id?: number;
    client_name: string;
    client_logo: string;
    client_logo_background_color?: string;
};
type ProjectType = {
    proj_type: string;
};

type ClientCardPosterStyle = CSSProperties & {
    "--backgroundColor": string;
};

type IndustryClientsData = {
    industry_id: number;
    industry_title: string;
    industry_feature_image_path: string;
    industry_feature_image?: string;
    clients?: ClientData[];
    project?: ProjectType;
};

const getProjectTypeKey = (type?: string) => {
    const normalizedType = type?.toLowerCase() || "";

    if (normalizedType.includes("product")) {
        return "product";
    }

    if (normalizedType.includes("cms")) {
        return "cms";
    }

    return "service";
};

const getClientLogoSrc = (logo?: string) => {
    if (!logo) {
        return undefined;
    }

    if (/^https?:\/\//i.test(logo)) {
        return logo;
    }

    return `${process.env.NEXT_PUBLIC_MEDIA_URL || ""}${logo.startsWith("/") ? "" : "/"}${logo}`;
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
                            data.map((industry, industryIndex) =>
                                industry.clients &&
                                industry.clients.length > 0 &&
                                industry.clients.map((client, clientIndex) => {
                                    const projectType = industry?.project?.proj_type || "Service";
                                    const projectTypeKey = getProjectTypeKey(projectType);
                                    const clientLogoSrc = getClientLogoSrc(client.client_logo);
                                    const projectTypeIcon =
                                        projectTypeKey === "product"
                                            ? faCube
                                            : projectTypeKey === "cms"
                                                ? faTableCellsLarge
                                                : faBriefcase;

                                    return (
                                        <Stack
                                            className={Styles.clientCard}
                                            key={
                                                client.client_id
                                                    ? `client-${client.client_id}`
                                                    : `industry-${industryIndex}-client-${clientIndex}`
                                            }
                                            style={{
                                                "--backgroundColor": client.client_logo_background_color || "linear-gradient(145deg, #f7fbff 0%, #edf5ff 100%)" as string,
                                            } as ClientCardPosterStyle}
                                        >
                                            <CustomImage
                                                src={clientLogoSrc}
                                                alt={client.client_name || "Client logo"}
                                                className={Styles.clientCardPoster}
                                                width={320}
                                                height={160}
                                            />

                                            <div className={Styles.clientBody}>
                                                <div className={Styles.industryInfo}>
                                                    <span className={Styles.metaLabel}>
                                                        Industry
                                                    </span>

                                                    <span className={Styles.industryTitle}>
                                                        {industry.industry_title}
                                                    </span>
                                                </div>

                                                <div className={Styles.typeRow}>
                                                    <span className={Styles.metaLabel}>
                                                        Type
                                                    </span>

                                                    <span className={`${Styles.typeBadge} ${Styles[projectTypeKey]}`}>
                                                        <FontAwesomeIcon icon={projectTypeIcon} />
                                                        {projectType}
                                                    </span>
                                                </div>
                                            </div>
                                        </Stack>
                                    );
                                })
                            )
                        ) : (
                            [...Array(12)].map((_, index) => (
                                <Stack
                                    className={Styles.clientCard}
                                    key={`client-skeleton-${index}`}
                                >
                                    <div className={Styles.clientCardPoster}>
                                        <div
                                            className={`skeleton ${Styles.clientLogoSkeleton}`}
                                        ></div>
                                    </div>

                                    <div className={Styles.clientBody}>
                                        <div className={Styles.industryInfo}>
                                            <div
                                                className={`skeleton ${Styles.labelSkeleton}`}
                                            >
                                                &nbsp;
                                            </div>

                                            <div
                                                className={`skeleton ${Styles.titleSkeleton}`}
                                            >
                                                &nbsp;
                                            </div>
                                        </div>

                                        <div className={Styles.typeRow}>
                                            <div
                                                className={`skeleton ${Styles.labelSkeleton}`}
                                            >
                                                &nbsp;
                                            </div>

                                            <div
                                                className={`skeleton ${Styles.badgeSkeleton}`}
                                            >
                                                &nbsp;
                                            </div>
                                        </div>
                                    </div>
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
