import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import Styles from "./style.module.css";
import CalltoAction from "./CalltoAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStar } from "@fortawesome/free-solid-svg-icons";

type Content = {
    c0be_title?: string;
    c0be_description?: string;
    c0be_usp_icon1?: string;
    c0be_usp_title1?: string;
    c0be_usp_icon2?: string;
    c0be_usp_title2?: string;
    c0be_usp_icon3?: string;
    c0be_usp_title4?: string;
    c0be_image?: string;
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
    const mediaUrl = `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images`;
    return (
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
                                    <div className={Styles.supportRow}>
                                        <div className={Styles.supportBox}>
                                            <div>
                                                <div className={Styles.review}>
                                                    4.5
                                                    <Image
                                                        className="flex-shrink-0"
                                                        src={`${mediaUrl}/star-icon.png`}
                                                        alt="clutch"
                                                        width={22} height={22}
                                                        priority
                                                        style={{objectFit: "contain"}}
                                                    />
                                                </div>
                                                <div className={`d-flex align-items-start gap-2${Styles.supportBoxText ?? ''}`}>
                                                    <Image
                                                        className="flex-shrink-0"
                                                        src={`${mediaUrl}/clutch-icon.png`}
                                                        alt="clutch"
                                                        width={26} height={26}
                                                        priority
                                                    />
                                                    <span>Clutch Verified</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={Styles.supportBox}>
                                            <div>
                                                <div className={Styles.review}>
                                                    4.5
                                                    <Image
                                                        className="flex-shrink-0"
                                                        src={`${mediaUrl}/star-icon.png`}
                                                        alt="clutch"
                                                        width={22} height={22}
                                                        priority
                                                        style={{objectFit: "contain"}}
                                                    />
                                                </div>
                                                <div className={`d-flex align-items-start gap-2${Styles.supportBoxText ?? ''}`}>
                                                    <Image
                                                        className="flex-shrink-0"
                                                        src={`${mediaUrl}/google-icon.png`}
                                                        alt="Google"
                                                        width={26} height={26}
                                                        priority
                                                    />
                                                    <span>Google Rating</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={Styles.supportBox}>
                                            <div>
                                                <div className={Styles.review}>
                                                    4.5
                                                    <em>+</em>
                                                </div>
                                                <div className={`d-flex align-items-start gap-2${Styles.supportBoxText ?? ''}`}>
                                                    <span>Tech supported</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                <div className={Styles.usp}>
                                    <ul className="noList">
                                        {[...Array(3)].map((_, index) => (
                                            <li key={index} style={{flex: 1}}>
                                                <div className={Styles.uspBox}>
                                                    <span className={Styles.uspIcon}></span>
                                                    <em className="skeleton skeletonText" style={{height: "26px"}}></em>
                                                </div>
                                            </li>                                            
                                        ))}
                                    </ul>
                                </div>
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
                                            style={{objectFit: "cover"}}
                                        />
                                        <span className={Styles.weAreBrand}>
                                            <Image
                                                className="auto-img"
                                                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/we-are-eclick.png`}
                                                alt="We Are Brand"
                                                width={309} height={74}
                                                priority
                                                style={{objectFit: "cover"}}
                                            />
                                        </span>
                                        <em className={Styles.videoPopup}>
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
    )
}

export default Aboutcomponent;