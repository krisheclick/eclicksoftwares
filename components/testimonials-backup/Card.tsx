"use client";
import { Col, Modal } from 'react-bootstrap';
import Styles from './style.module.css';
import Image from 'next/image';
import { useState } from 'react';
import { normalizeYouTubeUrl } from '@/utils/videoUrl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { limitHtmlWords } from '@/utils/limitcontent';
type Client = {
  client_logo?: string;
  client_name?: string;
}
type TestimonialData = {
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

type CardProps = {
    cardData: TestimonialData[];
};
const Card = ({cardData} : CardProps) => {
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


    return (
        <>
            {cardData?.map((userValue, useIndex) => {
                const {testimonial_title, testimonial_designation, testimonial_author_name, testimonial_description, testimonial_feature_image, testimonial_type, testimonial_video_poster_image, testimonial_video, client} = userValue;
                let colDefine: number = 4;
                let cardRow: string = "";
                let newTag: React.ReactNode = null;

                if (useIndex === 0) {
                    colDefine = 12;
                    cardRow = Styles.cardRow;
                    newTag = <div className={Styles.tag}>New</div>;
                }
                const videoFunction = testimonial_type === 'video';
                return(
                    <Col lg={colDefine} key={useIndex}>
                        <div
                            className={
                                useIndex === 0
                                    ? `${Styles.card} ${Styles.cardRow}`
                                    : Styles.card
                            }
                        >
                            <figure
                                className={Styles.cardPoster}
                                onClick={() => videoFunction && handleOpenVideo(testimonial_video ?? "", client?.client_name ?? "")}
                                style={{ cursor: videoFunction ? "pointer" : "default" }}
                            >
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${videoFunction ? testimonial_video_poster_image : testimonial_feature_image}`}
                                    alt={testimonial_title ?? "testimonial image"}
                                    fill
                                    priority={true}
                                />
                                {videoFunction ? <span className={Styles.videoIcon}><FontAwesomeIcon icon={faPlay} /></span> : ''}
                            </figure>

                            <div className={Styles.cardText}>
                                {newTag}
                                <div className={Styles.cardTitle}>{testimonial_author_name}</div>
                                
                                <div className={Styles.designation}>{client?.client_name} {testimonial_designation ? <span>({testimonial_designation})</span> : ''}</div>
                                <div className={Styles.testmonial_paragraph}>
                                    <p
                                        dangerouslySetInnerHTML={{ __html: limitHtmlWords(testimonial_description ?? '', 50)}}
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                )
            })}

            {/* Video Modal */}
            <Modal className="customBackdrop" show={showVideo} onHide={handleCloseVideo} size="xl" centered backdrop={false}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-semibold">{videoTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                <div style={{ position: "relative", paddingTop: "56.25%" }}>
                    <iframe width="100%" height="100%" src={videoUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen 
                        style={{ position: "absolute", top: 0, left: 0 }}></iframe>
                </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Card
