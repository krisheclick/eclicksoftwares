import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import Styles from "./style.module.css";
import CalltoAction from "./CalltoAction";

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
    return (
        <div className={`sectionArea ${Styles.aboutArea ?? ''}`}>
            <Container>
                <Row>
                    <Col lg={6}>

                        {!isLoading ? (
                            <div className="stickyContent">
                                <div className={Styles.about_content}>
                                    <div className={Styles.content}>
                                        <h1 className={`title ${Styles.title}`} dangerouslySetInnerHTML={{
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
                                    <div className={Styles.usp}>
                                        <ul className="noList">
                                            <li>
                                                <div className={Styles.uspBox}>
                                                    <span className={Styles.uspIcon}>
                                                        <Image
                                                            className="auto-img"
                                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${content?.c0be_usp_icon1 ?? ''}`}
                                                            alt="Clutch"
                                                            fill
                                                            priority={true}
                                                        />
                                                    </span>
                                                    <em>{content?.c0be_usp_title1 ?? ''}</em>
                                                </div>
                                            </li>
                                            <li>
                                                <div className={Styles.uspBox}>
                                                    <span className={Styles.uspIcon}>
                                                        <Image
                                                            className="auto-img"
                                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${content?.c0be_usp_icon2 ?? ''}`}
                                                            alt="Clutch"
                                                            fill
                                                            priority={true}
                                                        />
                                                    </span>
                                                    <em>{content?.c0be_usp_title2 ?? ''}</em>
                                                </div>
                                            </li>
                                            <li>
                                                <div className={Styles.uspBox}>
                                                    <span className={Styles.uspIcon}>
                                                        <Image
                                                            className="auto-img"
                                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${content?.c0be_usp_icon3 ?? ''}`}
                                                            alt="Clutch"
                                                            fill
                                                            priority={true}
                                                        />
                                                    </span>
                                                    <em>{content?.c0be_usp_title4 ?? ''}</em>
                                                </div>
                                            </li>
                                        </ul>
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
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${content?.c0be_image ?? ''}`}
                                        alt="About Poster"
                                        fill
                                        priority={true}
                                    />
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