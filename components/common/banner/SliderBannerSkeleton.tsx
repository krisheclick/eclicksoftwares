import { Container, Row, Col } from "react-bootstrap";
import Styles from "./sliderbanner.module.css";

const SliderBannerSkeleton = () => {
    return (
        <div className={`${Styles.sliderBanner}`}>
            <Container>
                <Row className={`gx-xl-0 justify-content-between ${Styles.row}`}>
                    <Col lg={5} xl={6} xxl={5}>
                        <div className={Styles.content}>
                            <div className={Styles.bannerText}>
                                <div className={`skeleton titleTag col-5 bg-secondary ${Styles.titleTag}`}>&nbsp;</div>
                                <div className={`skeleton title mb-2 ${Styles.title}`}>&nbsp;</div>
                                <div className={`skeleton title mb-2 d-sm-none d-lg-block ${Styles.title}`}>&nbsp;</div>
                                <div className={`skeleton title w-75 ${Styles.title}`}>&nbsp;</div>
                                <div className={`skeleton skeletonText`}></div>
                                <div className={`skeleton skeletonText w-75`}></div>
                                <div className={`skeleton skeletonText w-50`}></div>
                            </div>

                            <div className={Styles.usp}>
                                <Row className={Styles.row}>
                                    {[...Array(3)].map((_, i) => (
                                        <Col lg={4} xxl={4} key={i}>
                                            <div className={`${Styles.uspBox}`}>
                                                <div
                                                    className="placeholder bg-secondary rounded-circle d-block mb-2"
                                                    style={{ width: "50px", height: "50px" }}
                                                ></div>
                                                <div className="placeholder col-10 bg-secondary rounded-pill"></div>
                                                <div className="placeholder col-10 bg-secondary rounded-pill"></div>
                                                <div className="placeholder col-10 bg-secondary rounded-pill w-50"></div>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>

                            <div className={`btn_left ${Styles.buttonWrap ?? ''}`}>
                                <span className={`placeholder eclick-btn-connect lg disabled bg-secondary ${Styles.bannerBtn ?? ''}`}>&nbsp;</span>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} xl={6} xxl={7}>
                        <div className={Styles.imagePart}>
                            <figure className={`${Styles.big_img} skeleton`}></figure>

                            <figure
                                className={`${Styles.small_img} placeholder bg-light d-flex align-items-center justify-content-center`}
                                style={{width: "100%"}}
                            >
                                <div className="placeholder bg-secondary rounded-3 mx-1"></div>
                                <div className="placeholder bg-secondary rounded-3 mx-1"></div>
                            </figure>

                            <div className={Styles.slogan_list}>
                                <ul>
                                    {[...Array(4)].map((_, i) => (
                                        <li key={i} className="skeleton placeholder bg-secondary rounded-pill col-3"></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SliderBannerSkeleton;
