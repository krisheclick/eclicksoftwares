'use client';
import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import Styles from './style.module.css';

type ServiceItem = {
  title: string;
  image: string;
};

type TabKey =
  | 'Web & App Development'
  | 'Digital Marketing'
  | 'AI & Automation'
  | 'UI / UX Service'
  | 'Web Hosting';

const services: Record<TabKey, ServiceItem[]> = {
  'Web & App Development': [
    { title: 'Custom Web Development', image: '/Rectangle 26.png' },
    { title: 'E-commerce Development', image: '/Rectangle 2.png' },
    { title: 'Mobile App Development', image: '/Rectangle 3.png' },
    { title: 'SaaS & PaaS Solutions', image: '/Rectangle 4.png' },
  ],
  'Digital Marketing': [
    { title: 'Search Engine Optimization', image: '/seo.jpg' },
    { title: 'Social Media Marketing', image: '/social-media-marketing.jpg' },
    { title: 'Pay Per Click', image: '/ppc.jpg' },
    { title: 'Content Writing', image: '/content-writing.jpg' },
  ],
  'AI & Automation': [
    { title: 'AI Chatbots', image: '/AI Chatbots.jpg' },
    { title: 'Workflow Automation', image: '/Workflow Automation.jpg' },
    { title: 'Intelligent Automation', image: '/Intelligent Automation.jpg' },
    { title: 'Machine Learning', image: '/Machine Learning.jpg' },
  ],
  'UI / UX Service': [
    { title: 'UI Graphics', image: '/Rectangle 3.png' },
    { title: 'Typography', image: '/Typography.jpg' },
    { title: 'User Analytics', image: '/analytics.jpg' },
    { title: 'User Experience', image: '/User Experience.jpg' },
  ],
  'Web Hosting': [
    { title: 'Cloud Hosting', image: '/cloud-hosting.jpg' },
    { title: 'VPS (Virtual Private Server) Hosting', image: '/VPS-Hosting.jpg' },
    { title: 'Managed Hosting', image: '/managed-hosting.jpg' },
    { title: 'Shared Hosting', image: '/shared-hosting.jpg' },
  ],
};

export default function CoreServices() {
  const tabs: TabKey[] = [
    'Web & App Development',
    'Digital Marketing',
    'AI & Automation',
    'UI / UX Service',
    'Web Hosting',
  ];

  const [activeTab, setActiveTab] = useState<TabKey>('Web & App Development');

  return (
    <div className={`sectionArea ${Styles.core_service ?? ''}`}>
      <Container>
        <div className={`section-content text-center ${Styles.section_content ?? ''}`}>
          <h2 className="heading">Our Core Services</h2>
        </div>

        <div className={Styles.serviceTab}>
          <ul className="noList d-flex flex-wrap gap-2">
            {tabs.map(tab => (
              <li
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? Styles.active : ''}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="container-full">
        <div className={Styles.serviceContent}>
          <Row>
            {services[activeTab]?.map((service, index) => (
              <Col lg={4} xl={3} key={index}>
                <div className={`${Styles.box} ${index === 1 ? Styles.active : ''}`}>
                  <div className={Styles.boxText}>
                    <div className={`subheading ${Styles.subheading}`}>
                      {service.title}
                    </div>
                    <Link href="#" className={`learnMore ${Styles.learnMore}`}>Learn More</Link>
                  </div>
                  <figure className='mt-auto'>
                    <Image
                      className="auto-img"
                      src={service.image}
                      alt={service.title}
                      width={384} height={255}
                      priority={true}
                    />
                  </figure>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
}
