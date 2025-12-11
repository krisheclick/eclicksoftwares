"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";
import Styles from "./style.module.css";
import Skeleton from "@/components/common/Skeleton";
type IndustryItem = {
  industry_feature_image_path?: string;
  industry_title?: string;
  industry_short_description?: string;
  project?: {
    proj_cover_image_path: string;
    proj_name: string;
    proj_slug: string;
    proj_short_desc: string;
  }
}

const HookIndustry = () => {
  const [hasLoading, setLoading] = useState(true);
  const [data, setData] = useState<IndustryItem[]>([]);
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  const fetchAPI = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}industry?is_home=10`);
      const { response_data } = await response.json();
      setData(response_data);
    } catch (err: unknown) {
      console.log('Industry API is something wrong!', (err as Error).message);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchAPI();
  }, []);

  useEffect(() => {
    if (data.length > 0 && !activeTab) {
      setActiveTab(data[0].industry_title);
    }
  }, [data, activeTab]);

  const activeItem = data.find((item) => item.industry_title === activeTab);
  return (
    <div className={Styles.sectionArea}>
      <Container className="container-full">
        <div className={`section-content text-center ${Styles.section_content ?? ""}`}>
          {!hasLoading ? <h3 className={`heading text-white ${Styles.heading ?? ""}`}>Industries We Empower</h3> : <Skeleton />}
        </div>

        <hr />

        <div className={Styles.tabWrapper}>
          <div className={Styles.navigation}>
            <ul className="noList">
              {!hasLoading ? (
                data?.map((value, index) => {
                  const { industry_title, industry_feature_image_path } = value;
                  return (
                    <li key={index}
                      className={`${Styles.navLink} ${activeTab === industry_title ? Styles.activeLink : ''}`}
                      onClick={() => setActiveTab(industry_title)}
                    >
                      <span className={Styles.navIcon}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${industry_feature_image_path}`}
                          alt={`${industry_title} Icon` || "Industry Icon"}
                          fill
                          role="presentation"
                        />
                      </span>
                      <span>{industry_title}</span>
                    </li>
                  )
                })
              ) : (
                [...Array(8)].map((_, index) => (
                  <li key={index} className={`${Styles.navLink}`}>
                    <div className={`${Styles.navIcon} skeleton`}></div>
                    <div className="skeleton skeletonText" style={{height: "32px"}}></div>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className={Styles.tabContent}>
            <Row className="align-items-center justify-content-center gx-xl-5">
              <Col md={6} xl={7}>
                {!hasLoading ? (
                  <figure className={Styles.poster}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${activeItem?.project?.proj_cover_image_path ?? ''}`}
                      alt={activeItem?.industry_title || "Industry Title"}
                      fill
                      priority
                    />
                  </figure>
                ): (
                  <div className={`skeleton ${Styles.poster}`}></div>
                )}
              </Col>
              <Col md={6} xl={5}>
              {!hasLoading ? (
                <div className="section-content text-white">
                  <figure className={Styles.icon}>
                    <Image
                      className="auto-img"
                      src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${activeItem?.industry_feature_image_path}`}
                      alt={activeItem?.industry_title || "Industry Title"}
                      fill
                      priority={true}
                    />
                  </figure>
                  <div className={`heading text-white ${Styles.heading}`}>{activeItem?.project?.proj_name ?? ''}</div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: activeItem?.project?.proj_short_desc ?? '',
                    }}
                  />
                  <div className="btn_left">
                    <Link href={`${activeItem?.project?.proj_slug}`} className={`eclick-btn-audit white-btn lg ${Styles.auditBtn}`}>Get a Free Website Audit</Link>
                  </div>
                </div>
              ) : (
                <>
                  <figure className={`skeleton ${Styles.icon}`}></figure>
                  <div className={`skeleton skeletonTitle rounded`}></div>
                  <div className={`skeleton skeletonTitle rounded-0 w-75`}></div>
                  <br />
                  <div className="skeleton skeletonText" style={{width: "100%"}}></div>
                  <div className="skeleton skeletonText" style={{width: "100%"}}></div>
                  <div className="skeleton skeletonText" style={{width: "100%"}}></div>
                  <div className="skeleton skeletonText" style={{width: "100%"}}></div>
                  <div className="skeleton skeletonText" style={{width: "100%"}}></div>
                  <div className="skeleton skeletonText" style={{width: "50%"}}></div>
                  <div className="btn_left">
                    <div className="skeleton eclick-btn-audit" style={{width: "20%"}}></div>
                  </div>
                </>
              )}
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HookIndustry;
