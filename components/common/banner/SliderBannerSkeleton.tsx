import { Container, Row, Col } from "react-bootstrap";
import Styles from "./sliderbanner.module.css";

const SliderBannerSkeleton = () => {
    return (
        <div className={`${Styles.sliderBanner}`}>
            <Container>
                <Row className="gx-xl-0">
                    {/* Left Side */}
                    <Col lg={6} xxl={5}>
                        <div className={Styles.content}>
                            <div className="placeholder col-5 bg-secondary rounded-1 mb-3" style={{height:'20px'}}></div>
                            <div className="placeholder col-10 bg-secondary rounded-1 mb-2" style={{height:'50px'}}></div>
                            <div className="placeholder col-8 bg-secondary rounded-1 mb-2" style={{height:'50px'}}></div>
                            <div className="placeholder col-6 bg-secondary rounded-1 mb-4" style={{height:'50px'}}></div>

                            <div className="placeholder col-9 bg-secondary rounded-1 mb-3"></div>
                            <div className="placeholder col-7 bg-secondary rounded-1 mb-5"></div>

                            <Row className={Styles.row}>
                                {[...Array(3)].map((_, i) => (
                                    <Col lg={4} xxl={4} key={i}>
                                        <div className={`${Styles.uspBox}`}>
                                            <div
                                                className="placeholder bg-secondary rounded-circle d-block mx-auto mb-2"
                                                style={{ width: "50px", height: "50px" }}
                                            ></div>
                                            <div className="placeholder col-10 bg-secondary rounded-pill mx-auto"></div>
                                            <div className="placeholder col-10 bg-secondary rounded-pill mx-auto"></div>
                                            <div className="placeholder col-10 bg-secondary rounded-pill mx-auto w-50"></div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>

                            <div className="mt-5">
                                <div className="placeholder col-5 btn btn-secondary disabled rounded-pill py-3"></div>
                            </div>
                        </div>
                    </Col>

                    <Col lg={6} xxl={7}>
                        <div className={Styles.imagePart}>
                            <figure
                                className={`${Styles.big_img} placeholder bg-secondary d-flex align-items-center justify-content-center`}
                                style={{ height: "556px" }}
                            >
                                <div className="placeholder col-6 bg-light rounded-1"></div>
                            </figure>

                            <figure
                                className={`${Styles.small_img} placeholder bg-light d-flex align-items-center justify-content-center`}
                            >
                                <div className="placeholder bg-secondary rounded-3 mx-1" style={{ width: "100px", height: "200px" }}></div>
                                <div className="placeholder bg-secondary rounded-3 mx-1" style={{ width: "100px", height: "200px" }}></div>
                            </figure>

                            <div className={Styles.slogan_list}>
                                <ul>
                                    {[...Array(4)].map((_, i) => (
                                        <li key={i} className="placeholder bg-secondary rounded-pill col-3"></li>
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
