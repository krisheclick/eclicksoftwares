'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Col, Row } from 'react-bootstrap';
import Styles from './style.module.css';

type SlideItem = {
    title: string;
    shortContent: string;
    comments: number;
    thumbnail: string;
    publishdate: string;
    permalink: string;
};

const BlogList = () => {
    const slides: SlideItem[] = [
        {
            title: 'How to Optimize Your Landing Page to Grab More Leads?',
            shortContent: 'Get more leads from your landing pages. Learn about the actionable steps for better conversions',
            comments: 5,
            thumbnail: '/blog-1.png',
            publishdate: '15 Jan 2020',
            permalink: '/how-to-optimize-your-landing-page-to-grab-more-leads'
        },
        {
            title: 'Most effective digital marketing strategies for real estate',
            shortContent: 'Real estate professionals need robust digital marketing strategy. It  helps them to engage with...',
            comments: 3,
            thumbnail: '/blog-2.png',
            publishdate: '16 Jan 2020',
            permalink: '/most-effective-digital-marketing-strategies-for-real-estate'
        },
        {
            title: 'Why does your business require custom websites over templates?',
            shortContent: 'Custom websites offer flexibility, scalability, and a tailored user experience.',
            comments: 11,
            thumbnail: '/blog-4.png',
            publishdate: '17 Jan 2020',
            permalink: '/why-does-your-business-require-custom-websites-over-templates'
        },
        {
            title: 'How to Optimize Your Landing Page to Grab More Leads?',
            shortContent: 'Get more leads from your landing pages. Learn about the actionable steps for better conversions',
            comments: 27,
            thumbnail: '/blog-5.jpg',
            publishdate: '15 Jan 2020',
            permalink: '/how-to-optimize-your-landing-page-to-grab-more-leads'
        },
        {
            title: 'Most effective digital marketing strategies for real estate',
            shortContent: 'Real estate professionals need robust digital marketing strategy. It  helps them to engage with...',
            comments: 3,
            thumbnail: '/blog-6.png',
            publishdate: '16 Jan 2020',
            permalink: '/most-effective-digital-marketing-strategies-for-real-estate'
        },
        {
            title: 'Why does your business require custom websites over templates?',
            shortContent: 'Custom websites offer flexibility, scalability, and a tailored user experience.',
            comments: 0,
            thumbnail: '/detailsimg.jpg',
            publishdate: '29 Jan 2020',
            permalink: '/why-does-your-business-require-custom-websites-over-templates'
        },
        {
            title: 'How to Optimize Your Landing Page to Grab More Leads?',
            shortContent: 'Get more leads from your landing pages. Learn about the actionable steps for better conversions',
            comments: 5,
            thumbnail: '/blog-1.png',
            publishdate: '15 Jan 2020',
            permalink: '/how-to-optimize-your-landing-page-to-grab-more-leads'
        },
        {
            title: 'Most effective digital marketing strategies for real estate',
            shortContent: 'Real estate professionals need robust digital marketing strategy. It  helps them to engage with...',
            comments: 3,
            thumbnail: '/blog-2.png',
            publishdate: '16 Jan 2020',
            permalink: '/most-effective-digital-marketing-strategies-for-real-estate'
        },
        {
            title: 'Why does your business require custom websites over templates?',
            shortContent: 'Custom websites offer flexibility, scalability, and a tailored user experience.',
            comments: 11,
            thumbnail: '/blog-3.png',
            publishdate: '17 Jan 2020',
            permalink: '/why-does-your-business-require-custom-websites-over-templates'
        },
        {
            title: 'How to Optimize Your Landing Page to Grab More Leads?',
            shortContent: 'Get more leads from your landing pages. Learn about the actionable steps for better conversions',
            comments: 27,
            thumbnail: '/image 34.png',
            publishdate: '15 Jan 2020',
            permalink: '/how-to-optimize-your-landing-page-to-grab-more-leads'
        },
        {
            title: 'Most effective digital marketing strategies for real estate',
            shortContent: 'Real estate professionals need robust digital marketing strategy. It  helps them to engage with...',
            comments: 3,
            thumbnail: '/blog-2.png',
            publishdate: '16 Jan 2020',
            permalink: '/most-effective-digital-marketing-strategies-for-real-estate'
        },
        {
            title: 'Why does your business require custom websites over templates?',
            shortContent: 'Custom websites offer flexibility, scalability, and a tailored user experience.',
            comments: 0,
            thumbnail: '/detailsimg.jpg',
            publishdate: '29 Jan 2020',
            permalink: '/why-does-your-business-require-custom-websites-over-templates'
        },
    ];

    return (
        <Row className='rowGap'>
            {slides?.map((item, index) => {
                return (
                    <Col lg={4} sm={6} key={index}>
                        <div className={Styles.card}>
                            <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/blog${item.permalink}`} className={Styles.imageWrapper}>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/${item.thumbnail}`}
                                    alt={item.title}
                                    fill
                                    className={Styles.cardImage}
                                />
                            </Link>
                            <div className={Styles.cardBody}>
                                <div className={Styles.meta}>
                                    <span>{item.publishdate}</span>
                                    <span>Share with</span>
                                </div>
                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/blog${item.permalink}`} className={Styles.cardTitle}>{item.title}</Link>
                            </div>
                        </div>
                    </Col>
                )
            })}
        </Row>
    );
};

export default BlogList;
