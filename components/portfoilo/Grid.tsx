"use client";
import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
interface PortfolioInterface {
    portfolio_group_title?: string;
    portfolio_group_slug?: string;
    portfolio_group_feature_image_path?: string;
    portfolio_group_bg_color?: string;
    portfolio_group_text_color?: string;
}
const GridList = () => {
    const [hasLoading, setLoading] = useState(true);
    const [portfoiloData, setPortfolio] = useState<PortfolioInterface[] | []>([]);
    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}group`);
            const { response_data } = await response.json();
            setPortfolio(response_data);
        } catch (err: unknown) {
            console.log('Portfolio API is something wrong:', (err as Error).message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className={`sectionArea ${Styles.portfoli_section ?? ''}`}>
            <Container>
                <div className={Styles.portfoiloList}>
                    <Row className='rowGap'>
                        {!hasLoading ? (
                            portfoiloData && portfoiloData.length > 0 && (
                                portfoiloData?.map((value, index) => {
                                    const { portfolio_group_title: title, portfolio_group_slug: slug, portfolio_group_feature_image_path: image, portfolio_group_text_color: text_color } = value;
                                    const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;

                                    // const blackTextSlugs = [
                                    //     'graphics-design',
                                    //     'packaging-design',
                                    //     't-shirt-design',
                                    //     'illustration',
                                    // ];

                                    // const textColor = blackTextSlugs.includes(slug ?? '')
                                    //     ? '#000000'
                                    //     : '#ffffff';

                                    const textColor = text_color ? text_color : '#000000';
                                    return (
                                        <Col key={index} lg={4} xl={3} className={Styles.columnBox}>
                                            <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/portfolio/${slug}`}
                                                className={Styles.portfolioBox}
                                                style={{ '--text-color': textColor } as React.CSSProperties}
                                            >
                                                <div className={Styles.posterTitle}>{title}</div>
                                                <figure className={Styles.portfolioPoster}>
                                                    <Image
                                                        src={`${mediaUrl}${image}`}
                                                        alt={title || "Poster Title"}
                                                        fill
                                                        style={{ objectFit: "cover" }}
                                                    />
                                                </figure>
                                            </Link>
                                        </Col>
                                    )
                                })
                            )
                        ) : (
                            Array.from({ length: 8 }).map((_, index) => (
                                <Col key={index} lg={4} xl={3}>
                                    <div className={`${Styles.portfolioBox} skeleton text-center p-2`}>
                                        <div className="skeleton w-80" style={{ height: 32 }}></div>
                                        <div className={`${Styles.portfolioPoster} skeleton w-100`}></div>
                                    </div>
                                </Col>
                            ))

                        )}
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default GridList
