"use client";
import { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import Styles from "./style.module.css";
import Skeleton from "@/components/common/Skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

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
    const [activeIndustry, setActiveIndustry] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const fetchAPI = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}industry?with_client=1`);
            const { response_data } = await response.json();
            
            if (response_data && response_data.length > 0) {
                setData(response_data);
                setActiveIndustry(response_data[0].industry_id);
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

    const activeIndustryData = data.find((ind, index) => index === activeIndustry);

    const handleIndustryClick = (index: number) => {
        console.log('Industry clicked:', index);
        setActiveIndustry(index);
    };

    // Draggable scroll handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
        setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2;
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const targetScroll = direction === 'left' 
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;
            
            scrollContainerRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

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

                {/* Industry Tabs/Navigation */}
                <div className={Styles.industryNav}>
                    <button 
                        className={Styles.navArrow + ' ' + Styles.leftArrow}
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <div 
                        className={Styles.industryNavScroll}
                        ref={scrollContainerRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    >
                        <ul className={`${Styles.navList} noList`}>
                            {!hasLoading ? (
                                data.map((industry, index) => (
                                    <>
                                    {industry.clients?.length != 0 && (
                                            <li key={index} className={Styles.navItem}>
                                                <button
                                                    className={`${Styles.navButton} ${
                                                        activeIndustry === index ? Styles.active : ""
                                                    }`}
                                                    onClick={() => handleIndustryClick(index)}
                                                >
                                                    <span className={Styles.iconWrapper}>
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${industry.industry_feature_image_path}`}
                                                            alt={industry.industry_title}
                                                            width={32}
                                                            height={32}
                                                        />
                                                    </span>
                                                    <span className={Styles.label}>{industry.industry_title}</span>
                                                </button>
                                            </li>
                                        )
                                    }
                                    </>                                    
                                ))
                            ) : (
                                [...Array(8)].map((_, index) => (
                                    <li key={index} className={Styles.navItem}>
                                        <div className={`skeleton ${Styles.skeletonNav}`}></div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                    <button 
                        className={Styles.navArrow + ' ' + Styles.rightArrow}
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>

                {/* Clients Grid */}
                {!hasLoading ? (
                    <div className={Styles.clientsGrid}>
                        {activeIndustryData && activeIndustryData.clients && activeIndustryData.clients.length > 0 ? (
                            <Row className="gx-3 gy-4">
                                {activeIndustryData.clients.map((client, index) => (
                                    <Col lg={2} md={3} sm={4} xs={6} key={client.client_id || client.id || index}>
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
                                            {/* <div className={Styles.clientName}>{client.client_name}</div> */}
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div className={Styles.noClients}>
                                <p>No clients found for this industry.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <Row className="gx-3 gy-4">
                        {[...Array(8)].map((_, index) => (
                            <Col lg={3} md={4} sm={6} xs={12} key={index}>
                                <div className={`skeleton ${Styles.skeletonClient}`}></div>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default IndustryWiseClients;
