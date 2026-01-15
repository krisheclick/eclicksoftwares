"use client";
import { Col, Modal } from 'react-bootstrap';
import Image from 'next/image';
import { useState } from 'react';
import { normalizeYouTubeUrl } from '@/utils/videoUrl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlay } from '@fortawesome/free-solid-svg-icons';
import { limitHtmlWords } from '@/utils/limitcontent';
import Styles from './style.module.css';
type Client = {
    client_logo?: string;
    client_name?: string;
    industry?: {
        industry_title?: string;
    }
}
type TestimonialData = {
    testimonial_title?: string;
    testimonial_author_name?: string;
    testimonial_designation?: string;
    testimonial_rating?: string;
    testimonial_description?: string;
    testimonial_feature_image?: string;
    testimonial_industry?: string;
    testimonial_type?: string;
    testimonial_video?: string;
    testimonial_video_poster_image?: string;
    client?: Client;
}

type CardProps = {
    cardData: TestimonialData[];
};
const Card = ({ cardData }: CardProps) => {
    const [showVideo, setShowVideo] = useState<boolean>(false);
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [videoTitle, setVideoTitle] = useState<string>("");

    // Video Type
    const [modalType, setModalType] = useState<'video' | 'content' | null>(null);
    const [fullContent, setFullContent] = useState<string>("");


    const handleOpenVideo = (url: string, title?: string) => {
        setVideoUrl(normalizeYouTubeUrl(url));
        setVideoTitle(title || "");
        setShowVideo(true);
    };

    const handleOpenContent = (title?: string, description?: string) => {
        setModalType('content');
        setVideoTitle(title || "");
        setFullContent(description || "");
        setShowVideo(true);
    };


    const handleCloseVideo = (): void => {
        setShowVideo(false);
        setTimeout(() => {
            setVideoUrl("");
            setVideoTitle("");
            setFullContent("");
            setModalType(null);
        }, 300);
    };



    return (
        <>
            {cardData?.map((userValue, useIndex) => {
                const { testimonial_title, testimonial_designation, testimonial_author_name, testimonial_description, testimonial_feature_image, testimonial_type, testimonial_video_poster_image, testimonial_video, client } = userValue;

                const videoFunction = testimonial_type === 'video';
                const testimonial_industry = client?.industry?.industry_title;
                return (
                    <Col lg={6} key={useIndex} className={Styles.cardItem}>
                        {videoFunction ? (
                            <div className={Styles.videoCard}>
                                <figure className={Styles.cardPoster}>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${videoFunction ? testimonial_video_poster_image : testimonial_feature_image}`}
                                        alt={testimonial_title ?? "testimonial image"}
                                        fill
                                        priority
                                    />
                                    <span
                                        className={Styles.icon}
                                        onClick={() =>
                                            videoFunction
                                                ? handleOpenVideo(testimonial_video ?? "", client?.client_name ?? "")
                                                : handleOpenContent(testimonial_author_name, testimonial_description)
                                        }
                                    >
                                        <FontAwesomeIcon icon={videoFunction ? faPlay : faEye} />
                                    </span>
                                </figure>
                            </div>
                        ) : (
                            <div className={Styles.card}
                                onClick={() =>
                                    videoFunction
                                        ? handleOpenVideo(testimonial_video ?? "", client?.client_name ?? "")
                                        : handleOpenContent(testimonial_author_name, testimonial_description)
                                }
                            >
                                <figcaption className={Styles.card_caption}>
                                    <div className={Styles.posterData}>
                                        <div className={Styles.industry_type}>{testimonial_industry ? testimonial_industry : 'Other'}</div>
                                        <div className={Styles.client_name}>{client?.client_name}</div>
                                        <span className={Styles.client_type}>{testimonial_designation ? <span>({testimonial_designation})</span> : ''}</span>
                                        <div className={Styles.projectName}>{testimonial_author_name}</div>
                                    </div>
                                    <figure className={Styles.cardLogo}>
                                        <Image
                                            className={!videoFunction && Styles.logo || ''}
                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${videoFunction ? testimonial_video_poster_image : testimonial_feature_image}`}
                                            alt={testimonial_title ?? "testimonial image"}
                                            fill
                                            priority
                                        />
                                    </figure>
                                </figcaption>
                                <div className={Styles.cardText}>
                                    <div className={Styles.testmonial_paragraph}>
                                        <p
                                            dangerouslySetInnerHTML={{ __html: limitHtmlWords(testimonial_description ?? '', 36) }}
                                        />
                                    </div>
                                </div>

                                {/* <figcaption className={videoFunction ? Styles.cardPosterDesign : Styles.cardPosterDesignText}>
                                    <span
                                        className={Styles.icon}
                                        onClick={() =>
                                            videoFunction
                                                ? handleOpenVideo(testimonial_video ?? "", client?.client_name ?? "")
                                                : handleOpenContent(testimonial_author_name, testimonial_description)
                                        }
                                    >
                                        <FontAwesomeIcon icon={videoFunction ? faPlay : faEye} />
                                    </span>

                                    {!videoFunction && (
                                        <div className={Styles.posterData}>
                                            <div className={Styles.industry_type}>{testimonial_industry ? testimonial_industry : 'Other'}</div>
                                            <em className={Styles.ownerName}>{client?.client_name}</em>
                                            <div className={Styles.projectName}>{testimonial_author_name}</div>
                                            <Image
                                                className={Styles.brandLogo}
                                                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/logo.png`}
                                                alt={"Eclick Softwares & Solutions"}
                                                width={90} height={36}
                                                priority
                                            />
                                        </div>
                                    )}
                                    
                                </figcaption>

                                <div className={Styles.cardText}>
                                    <div className={Styles.cardTitle}>{testimonial_author_name}</div>

                                    <div className={Styles.designation}>{client?.client_name} </div>
                                    <div className={Styles.testmonial_paragraph}>
                                        <p
                                            dangerouslySetInnerHTML={{ __html: limitHtmlWords(testimonial_description ?? '', 20) }}
                                        />
                                    </div>
                                </div> */}
                            </div>
                        )}
                    </Col>
                )
            })}

            {/* Video Modal */}
            <Modal className="customBackdrop" show={showVideo} onHide={handleCloseVideo} size="xl" centered backdrop={false}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-semibold">{videoTitle}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {modalType === 'content' ? (
                        <div
                            className={Styles.fullContent}
                            dangerouslySetInnerHTML={{ __html: fullContent }}
                        />
                    ) : (
                        <div style={{ position: "relative", paddingTop: "56.25%" }}>
                            <iframe
                                src={videoUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                            />
                        </div>
                    )}
                </Modal.Body>
            </Modal>

        </>
    )
}

export default Card
