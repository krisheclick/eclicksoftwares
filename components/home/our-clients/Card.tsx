"use client";
import { useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import Image from "next/image";
import Styles from "./style.module.css";
import { limitHtmlWords } from "@/utils/limitcontent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { normalizeYouTubeUrl } from '@/utils/videoUrl';

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

type Props = {
  data?: TestimonialItem[];
};

const Card = ({ data = [] }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = data[activeIndex];

  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");

  const handleOpenVideo = (url: string, title?: string) => {
    setVideoUrl(normalizeYouTubeUrl(url));
    setVideoTitle(title || "");
    setShowVideo(true);
  };

  const handleCloseVideo = (): void => {
    setShowVideo(false);
    setTimeout(() => {
      setVideoUrl("");
      setVideoTitle("");
    }, 300);
  };

  if (!data.length) {
    return <p>No testimonials available.</p>;
  }
  return (
    <>
      <Row className="gx-5 align-items-center">
        <Col lg={6}>
          <div className={Styles.cardLogo}>
            {data.slice(0, 8).map((value, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`${Styles.item} ${activeIndex === index ? Styles.active : ""
                    }`}
                >
                  <div className={Styles.box}>
                    {value?.client?.client_logo && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${value?.client?.client_logo}`}
                        alt={value.testimonial_author_name || "Client logo"}
                        fill
                        priority
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Col>

        <Col lg={6}>
          <div className={Styles.card}>

            {activeItem?.testimonial_type === 'video' ? (
              <figure className={Styles.content} onClick={() => activeItem?.testimonial_video && handleOpenVideo(activeItem?.testimonial_video, activeItem?.client?.client_name ?? "")}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${activeItem?.testimonial_video_poster_image}`}
                  alt=""
                  fill
                />
                <span className={Styles.videoIcon}><FontAwesomeIcon icon={faPlay} /></span>
              </figure>
            ) : (
              <div className={Styles.content}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: limitHtmlWords(activeItem?.testimonial_description || "", 80)
                  }}
                />
              </div>

            )}
            <div className={`subtitle ${Styles.title}`}>
              {activeItem?.testimonial_author_name}
            </div>
            <div className={Styles.designation}>{activeItem?.client?.client_name} {activeItem?.testimonial_designation ? <span>({activeItem?.testimonial_designation})</span> : ''}</div>

          </div>
        </Col>
      </Row>

      {/* Video Modal */}
      <Modal className="customBackdrop" show={showVideo} onHide={handleCloseVideo} size="xl" centered backdrop={false}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold">{videoTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 0 }}>
          <div style={{ position: "relative", paddingTop: "56.25%" /* 16:9 aspect ratio */ }}>
            <iframe width="100%" height="100%" src={videoUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
              style={{ position: "absolute", top: 0, left: 0 }}></iframe>
          </div>
        </Modal.Body>
      </Modal></>
  );
};

export default Card;
