"use client";
import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
interface PortfolioInterface {
    title?: string;
    slug?: string;
    image?: string;
    backgroundColor?: string;
}
const GridList = () => {
    const [portfoiloData, setPortfolio] = useState<PortfolioInterface[] | []>([]);
    useEffect(() => {
        const allPortfolio = [
            {
                "title": "Logo Design",
                "slug": "logo-design",
                "image": "/logo-design.png",
                "backgroundColor": "#f44336",
            },
            {
                "title": "Website Design",
                "slug": "website-design",
                "image": "/website-design.png",
                "backgroundColor": "#03a9f4",
            },
            {
                "title": "T-Shirt Design",
                "slug": "tshirt-design",
                "image": "/tshirt-design.png",
                "backgroundColor": "#4caf50",
            },
            {
                "title": "Mobile App Design",
                "slug": "mobile-app-design",
                "image": "/mobile-app-design.png",
                "backgroundColor": "#ff7961",
            },
            {
                "title": "Business Card",
                "slug": "business-card",
                "image": "/business-card-design.png",
                "backgroundColor": "#673ab7",
            },
            {
                "title": "Packaging Design",
                "slug": "packaging-design",
                "image": "/packaging-design.png",
                "backgroundColor": "#e91e63",
            },
            {
                "title": "Flyer Design",
                "slug": "flyer-design",
                "image": "/flyer-design.png",
                "backgroundColor": "#ffb300",
            },
            {
                "title": "Illustration",
                "slug": "illustration",
                "image": "/illustration.png",
                "backgroundColor": "#d81b60",
            },
            // {
            //     "title": "AI Interface",
            //     "slug": "ai-interface",
            //     "image": "/website-design.png",
            //     "backgroundColor": "#03a9f4",
            // },
            // {
            //     "title": "Eclick Web",
            //     "slug": "eclick-web",
            //     "image": "/packaging-design.png",
            //     "backgroundColor": "#E5F1FF",
            // },
        ];
        setPortfolio(allPortfolio);
    }, [])
    return (
        <div className={`sectionArea ${Styles.portfoli_section ?? ''}`}>
            <Container>
                <div className={Styles.portfoiloList}>
                    <Row className='rowGap'>
                        {portfoiloData && portfoiloData.length > 0 && (
                            portfoiloData?.map((value, index) => {
                                const {title, slug, image, backgroundColor} = value;
                                const mediaUrl = process.env.NEXT_PUBLIC_assetPrefix;
                                const poster = image ? image : "/noimage.jpg";
                                return (
                                    <Col key={index} lg={4} xl={3} className={Styles.columnBox}>
                                        <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/portfolio/${slug}`}
                                            className={Styles.portfolioBox}
                                            style={{background: backgroundColor}}
                                        >
                                            <div className={Styles.posterTitle}>{title}</div>
                                            <figure className={Styles.portfolioPoster}>
                                                <Image
                                                    src={`${mediaUrl}/assets/images${poster}`}
                                                    alt={title || "Poster Title"}
                                                    fill
                                                />
                                            </figure>
                                        </Link>
                                    </Col>
                                )
                            })
                        )}
                        {/* <Col lg={4} xl={3} className={Styles.columnBox}>
                            <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/portfolio/website-design`}
                                className={Styles.portfolioBox}
                            >
                                <Image
                                    className={Styles.poster}
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/navigation/Maintenance-Support.png`}
                                    alt={`Portfolio image`}
                                    fill
                                />
                            </Link>
                        </Col>
                        <Col lg={4} xl={3} className={Styles.columnBox}>
                            <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/portfolio/mobile-app-development`}
                                className={Styles.portfolioBox}
                            >
                                <Image
                                    className={Styles.poster}
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/navigation/Ecommerce-Development.png`}
                                    alt={`Portfolio image`}
                                    fill
                                />
                            </Link>
                        </Col>
                        <Col lg={4} xl={3} className={Styles.columnBox}>
                            <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/portfolio/graphics-design`}
                                className={Styles.portfolioBox}
                            >
                                <Image
                                    className={Styles.poster}
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/navigation/Customized-website.png`}
                                    alt={`Portfolio image`}
                                    fill
                                />
                            </Link>
                        </Col>
                        <Col lg={4} xl={3} className={Styles.columnBox}>
                            <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/portfolio/digital-marketing`}
                                className={Styles.portfolioBox}
                            >
                                <Image
                                    className={Styles.poster}
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/navigation/content-based.png`}
                                    alt={`Portfolio image`}
                                    fill
                                />
                            </Link>
                        </Col>
                        <Col lg={4} xl={3} className={Styles.columnBox}>
                            <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/portfolio/managed-service`}
                                className={Styles.portfolioBox}
                            >
                                <Image
                                    className={Styles.poster}
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/navigation/API-Integration.png`}
                                    alt={`Portfolio image`}
                                    fill
                                />
                            </Link>
                        </Col>
                        <Col lg={4} xl={3} className={Styles.columnBox}>
                            <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/portfolio/website-design`}
                                className={Styles.portfolioBox}
                            >
                                <Image
                                    className={Styles.poster}
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/navigation/Search Engine Optimization.png`}
                                    alt={`Portfolio image`}
                                    fill
                                />
                            </Link>
                        </Col>
                        <Col lg={4} xl={3} className={Styles.columnBox}>
                            <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/portfolio/mobile-app-development`}
                                className={Styles.portfolioBox}
                            >
                                <Image
                                    className={Styles.poster}
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/navigation/Social  Media Marketing.png`}
                                    alt={`Portfolio image`}
                                    fill
                                />
                            </Link>
                        </Col>
                        <Col lg={4} xl={3} className={Styles.columnBox}>
                            <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/portfolio/graphics-design`}
                                className={Styles.portfolioBox}
                            >
                                <Image
                                    className={Styles.poster}
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/navigation/Mobile-App-Development.png`}
                                    alt={`Portfolio image`}
                                    fill
                                />
                            </Link>
                        </Col>
                        <Col lg={4} xl={3} className={Styles.columnBox}>
                            <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/portfolio/digital-marketing`}
                                className={Styles.portfolioBox}
                            >
                                <Image
                                    className={Styles.poster}
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/navigation/digital.jpg`}
                                    alt={`Portfolio image`}
                                    fill
                                />
                            </Link>
                        </Col>
                        <Col lg={4} xl={3} className={Styles.columnBox}>
                            <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/portfolio/managed-service`}
                                className={Styles.portfolioBox}
                            >
                                <Image
                                    className={Styles.poster}
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/navigation/mad.jpg`}
                                    alt={`Portfolio image`}
                                    fill
                                />
                            </Link>
                        </Col> */}
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default GridList
