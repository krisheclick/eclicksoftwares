"use client";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Styles from "./style.module.css";
import Card from "./Card";
import Skeleton from "@/components/common/Skeleton";
import SkeletonBox from "./Skeleton";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type Client = {
  client_logo?: string;
  client_name?: string;
}
type TestimonialItem = {
  testimonial_title?: string;
  testimonial_author_name?: string;
  testimonial_designation?: string;
  testimonial_rating?: string;
  testimonial_description?: string;
  testimonial_feature_image?: string;
  testimonial_type?: string;
  testimonial_video?: string;
  testimonial_video_poster_image?: string;
  client?: Client;
}
const Clients = () => {
  const [hasLoading, setLoading] = useState(true);
  const [data, setData] = useState<TestimonialItem[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const fetchAPI = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}testimonial?is_home=1`);
      const { response_data } = await response.json();
      setData(response_data);
    } catch (err: unknown) {
      console.log('Testimonials API is something wrong!', (err as Error).message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAPI();
  }, []);

  useEffect(() => {
    if (data.length > 0 && !activeTab) {
      setActiveTab(data[0]?.testimonial_title ?? null);
    }
  }, [data, activeTab]);

  // const activeData = data.find(item => item?.testimonial_title === activeTab);

  return (
    <div className={`sectionArea ${Styles.sectionArea ?? ''}`}>
      <Container>
        <div className={`section-content d-lg-flex align-items-start justify-content-between gap-3 ${Styles.section_content ?? ''}`}>
          {hasLoading ? <Skeleton /> : <h2 className="heading">Hear From Our Clients</h2>}
          <div className="mt-2 pt-1">
            <Link className={`eclick-btn-viewBtn ${Styles.viewBtn ?? ''}`} href={`${process.env.NEXT_PUBLIC_ENV_URL}/testimonials`}>
              <span className={Styles.icon}>
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
              <em>View All Client</em>
            </Link>
          </div>
        </div>
        <div className={Styles.cardWrapper}>
          <hr />
          {hasLoading ? <SkeletonBox /> : <Card data={data} />}
        </div>
      </Container>
    </div>
  )
}

export default Clients
