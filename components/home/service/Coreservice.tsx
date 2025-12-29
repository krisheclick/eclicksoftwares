'use client';
import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import Styles from './style.module.css';
import Skeleton from '@/components/common/Skeleton';
import SkeletonCard from './Skeleton';

type ServiceItem = {
  service_feature_image_path?: string;
  service_title?: string;
  service_slug?: string;
  service_feature_image?: string;
  service_text_color?: string;
};

type ServiceData = {
  service_category_title: string;
  service_category_slug: string;
  services?: ServiceItem[];
};

export default function CoreServices() {
  const [isLoading, setLoading] = useState(true);
  const [getData, setData] = useState<ServiceData[]>([]);
  const [activeData, setActive] = useState<string | null>(null);

  useEffect(() => {
    const APIresponse = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/with-service`);
        const { response_data } = await res.json();
        setData(response_data || []);
      } catch (err) {
        console.error('Services API error:', (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => {
      APIresponse();
    }, 1000);
  }, []);

  const activeCategory = getData.find(
    (item) => item.service_category_slug === activeData
  );
  const activeServices = activeCategory?.services || [];

  useEffect(() => {
    if (getData.length > 0 && !activeData) {
      setActive(getData[0].service_category_slug);
    }
  }, [getData, activeData]);

  return (
    <div className={`sectionArea ${Styles.core_service ?? ''}`}>
      <Container className="container-full">
        {!isLoading ? (
          <>
            <div className={`section-content text-center ${Styles.section_content ?? ''}`}>
              <h2 className="heading">Our Core Services</h2>
            </div>

            <div className={Styles.serviceTab}>
              <ul className="noList d-flex gap-2">
                {getData.slice(0, 6).map(({ service_category_title, service_category_slug }, index) => (
                  <li
                    key={index}
                    onClick={() => setActive(service_category_slug)}
                    className={activeData === service_category_slug ? Styles.active : ''}
                  >
                    {service_category_title}
                  </li>
                ))}
              </ul>
            </div>
            <div className={Styles.serviceContent}>
              {activeServices.length > 0 ? (
                <Row>
                  {activeServices.slice(0, 4).map((service, index) => {
                    const textColor = service?.service_text_color ? service?.service_text_color : '#000000';
                    return (
                      <Col lg={4} xl={3} key={index} className={Styles.item}>
                        <Link
                          href={`/solutions/${activeData}/${service.service_slug}`}
                          className={Styles.box}
                          style={{ '--text-color': textColor } as React.CSSProperties}
                        >
                          <div className={Styles.subtitle}>{service?.service_title}</div>
                          <figure className={Styles.poster}>
                            <Image
                              src={
                                service?.service_feature_image_path
                                  ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${service.service_feature_image_path}`
                                  : '/Rectangle 2.png'
                              }
                              alt={service?.service_title || 'Service Image'}
                              fill
                              priority
                              style={{ objectFit: 'cover' }}
                            />
                          </figure>
                        </Link>
                      </Col>
                    )
                  })}
                </Row>
              ) : (
                <p className='text-center notFound lg'>Service Not Found</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className={`section-content text-center ${Styles.section_content ?? ''}`}>
              <Skeleton />
            </div>
            <div className={Styles.serviceTab}>
              <ul className="noList d-flex flex-wrap gap-2">
                {[...Array(6)].map((_, index) => (
                  <li className={`skeleton ${Styles.tabSkeleton}`} key={index}></li>
                ))}
              </ul>
            </div>
            <Row className="rowGap">
              {[...Array(4)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
}
