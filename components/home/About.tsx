"use client";
import { Col, Container, Modal, Row } from "react-bootstrap";
import Image from "next/image";
import Styles from "./style.module.css";
import CalltoAction from "./CalltoAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import Review_rating, { RatingItem } from "../about-us/Review_rating";
import { normalizeYouTubeUrl } from "@/utils/videoUrl";
import { useState } from "react";

type Content = {
    c0be_title?: string;
    c0be_description?: string;
    c0be_image?: string;
    c0be_video_link?: string;

    c0be_ratting1?: string;
    c0be_icon1?: string;
    c0be_title1?: string;

    c0be_ratting2?: string;
    c0be_icon2?: string;
    c0be_title2?: string;

    c0be_ratting3?: string;
    c0be_icon3?: string;
    c0be_title3?: string;
};

type CallToAction = {
    tpdc_title?: string;
}
type Props = {
    isLoading: boolean;
    content: Content;
    calltoaction: CallToAction;
}

const Aboutcomponent = ({ isLoading, content, calltoaction }: Props) => {
    const ratingData: RatingItem = {
        jrne_ratting1: content.c0be_ratting1 ?? "",
        jrne_icon_1: content.c0be_icon1 ?? "",
        jrne_title1: content.c0be_title1 ?? "",

        jrne_ratting2: content.c0be_ratting2 ?? "",
        jrne_icon_2: content.c0be_icon2 ?? "",
        jrne_title2: content.c0be_title2 ?? "",

        jrne_ratting3: content.c0be_ratting3 ?? "",
        jrne_icon_3: content.c0be_icon3 ?? "",
        jrne_title3: content.c0be_title3 ?? "",
    };


    const [showVideo, setShowVideo] = useState<boolean>(false);
    const [videoUrl, setVideoUrl] = useState<string>("");

    const handleOpenVideo = (url: string, title?: string) => {
        setVideoUrl(normalizeYouTubeUrl(url));
        setShowVideo(true);
    };

    const handleCloseVideo = (): void => {
        setShowVideo(false);
        setTimeout(() => {
            setVideoUrl("");
        }, 300);
    };

    return (
        <>
            <div className={`sectionArea ${Styles.aboutArea ?? ''}`}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>

                            {!isLoading ? (
                                <div className="stickyContent">
                                    <div className={Styles.about_content}>
                                        <div className={Styles.content}>
                                            <h1 className={Styles.aboutTitle} dangerouslySetInnerHTML={{
                                                __html: content?.c0be_title ?? ''
                                                    .replace(/Â+/g, "")
                                                    .replace(/\s+/g, " ")
                                                    .trim(),
                                            }} />
                                            <div className="editor_text" dangerouslySetInnerHTML={{
                                                __html: content?.c0be_description ?? ''
                                                    .replace(/Â+/g, "")
                                                    .replace(/\s+/g, " ")
                                                    .trim(),
                                            }} />
                                        </div>
                                        <Review_rating
                                            hasLoading={isLoading}
                                            data={{ ratting: ratingData }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className={Styles.skeltonTitle}>
                                        <div className="skeleton"></div>
                                        <div className="skeleton"></div>
                                        <div className="skeleton"></div>
                                    </div>
                                    <div className="skeleton skeletonText"></div>
                                    <div className="skeleton skeletonText"></div>
                                    <div className="skeleton skeletonText"></div>
                                    <div className="skeleton skeletonText"></div>
                                    <div className="skeleton skeletonText"></div>
                                    <div className="skeleton skeletonText" style={{ width: "72%" }}></div>
                                    <div className="skeleton skeletonText" style={{ width: "45%" }}></div>
                                    <br />
                                    <div className="skeleton skeletonText"></div>
                                    <div className="skeleton skeletonText"></div>
                                    <div className="skeleton skeletonText"></div>
                                    <div className="skeleton skeletonText" style={{ width: "35%" }}></div>
                                </>
                            )}
                        </Col>
                        <Col lg={6}>
                            <div className="stickyContent">
                                <figure className={Styles.aboutPoster}>
                                    {!isLoading ? (
                                        <>
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${content?.c0be_image ?? ''}`}
                                                alt="About Poster"
                                                fill
                                                priority
                                                style={{ objectFit: "cover" }}
                                            />
                                            <span className={Styles.weAreBrand}>
                                                <Image
                                                    className="auto-img"
                                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/we-are-eclick.png`}
                                                    alt="We Are Brand"
                                                    width={309} height={74}
                                                    priority
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </span>
                                            <em className={Styles.videoPopup}
                                                onClick={() => handleOpenVideo(content?.c0be_video_link ?? '')}
                                            >
                                                <FontAwesomeIcon icon={faPlay} />
                                            </em>
                                        </>
                                    ) : (
                                        <div className={`${Styles.skeletonPoster ?? ''} skeleton skeletonFill`}></div>
                                    )}
                                </figure>
                            </div>
                        </Col>
                    </Row>
                    <CalltoAction spaceClass={Styles.spaceAdd} content={calltoaction} isLoading={isLoading} />
                </Container>
            </div>

            <Modal className="customBackdrop" show={showVideo} onHide={handleCloseVideo} size="xl" centered backdrop={false}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-semibold"></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    <div style={{ position: "relative", paddingTop: "56.25%" /* 16:9 aspect ratio */ }}>
                        <iframe width="100%" height="100%" src={videoUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
                            style={{ position: "absolute", top: 0, left: 0 }}></iframe>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Aboutcomponent;