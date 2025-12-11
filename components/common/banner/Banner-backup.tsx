import { Container, Col, Row } from "react-bootstrap";
import Styles from "./style.module.css";
import Image from "next/image";
import Link from "next/link";

type props = {
    isLoading: boolean;
    title?: string | null;
    subtitle?: string | null;
    image?: string | null;
    short_description?: string | null;
}
const Banner = ({isLoading, title, subtitle, image, short_description}:props) => {

    if (isLoading) {
        return (
            <div className={`${Styles.sliderBanner} ${Styles.skeletonBanner}`}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} xl={5}>
                            <div className={Styles.content}>
                                <div className={Styles.bannerText}>
                                    <div className={`${Styles.skeleton} ${Styles.titleSkeleton}`}></div>
                                    <div className={`${Styles.skeleton} ${Styles.textSkeleton}`}></div>
                                    <div className={`${Styles.skeleton} ${Styles.textSkeleton}`}></div>
                                </div>
                                <div className={Styles.btn_wrap}>
                                    <div className={`${Styles.skeleton} ${Styles.btnSkeleton}`}></div>
                                </div>
                                <div className="d-none">
                                    <div className={Styles.usp}>
                                        <Row className={Styles.row}>
                                            {[1, 2, 3].map((i) => (
                                                <Col lg={4} xxl={4} key={i}>
                                                    <div className={Styles.uspBox}>
                                                        <div className={`${Styles.skeleton} ${Styles.iconSkeleton}`}></div>
                                                        <div className={`${Styles.skeleton} ${Styles.textSmallSkeleton}`}></div>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6} xl={7}>
                            <figure className={Styles.poster}>
                                <div className={`${Styles.skeleton} ${Styles.imageSkeleton}`}></div>
                            </figure>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
    return (
        <div className={Styles.sliderBanner}>
            <Container>
                <Row className="align-items-center">
                    <Col lg={6} xl={5}>
                        <div className={Styles.content}>
                            <div className={Styles.bannerText}>
                                <div className={Styles.subtitle} dangerouslySetInnerHTML={{
                                    __html: title??'Custom Software <br /> Development'
                                    .replace(/Â+/g, "")
                                    .replace(/\s+/g, " ")
                                    .trim(),
                                }}/>
                                <div className={`title ${Styles.bannerTitle}`} dangerouslySetInnerHTML={{
                                     __html: subtitle??'Custom Software <br /> Development'
                                    .replace(/Â+/g, "")
                                    .replace(/\s+/g, " ")
                                    .trim(),
                                }} />
                                <div className={Styles.bannerContent} dangerouslySetInnerHTML={{
                                    __html: short_description ?? '<p>We help entrepreneurs and business leaders build and launch innovative custom software solutions. </p>'
                                    .replace(/Â+/g, "")
                                    .replace(/\s+/g, " ")
                                    .trim(),
                                }}/>                                    
                            </div>
                            <div className={Styles.btn_wrap}>
                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}`} className={`eclick-btn-connect ${Styles.bannerBtn ?? ''}`}>
                                    <span className={Styles.phoneIcon}>
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
                                            alt="Conversation"
                                            width={22} height={21}
                                            loading="lazy"
                                        />
                                    </span>
                                    <em>Schedule a Call</em>
                                </Link>
                            </div>
                            <div className="d-none">
                                <div className={Styles.usp}>
                                    <Row className={Styles.row}>
                                        <Col lg={4} xxl={4}>
                                            <div className={Styles.uspBox}>
                                                <Image
                                                    className={`auto-img ${Styles.icon}`}
                                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/cluth.png`}
                                                    alt="Clutch"
                                                    width={50} height={50}
                                                    priority={true}
                                                />
                                                <p>Global Leaderss</p>
                                            </div>
                                        </Col>
                                        <Col lg={4} xxl={4}>
                                            <div className={Styles.uspBox}>
                                                <Image
                                                    className={`auto-img ${Styles.icon}`}
                                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/ui-ux.png`}
                                                    alt="UI UX"
                                                    width={50} height={50}
                                                    priority={true}
                                                />
                                                <p>Ux, Ui, Innovation</p>
                                            </div>
                                        </Col>
                                        <Col lg={4} xxl={4}>
                                            <div className={Styles.uspBox}>
                                                <Image
                                                    className={`auto-img ${Styles.icon}`}
                                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/android-app.png`}
                                                    alt="Android app development"
                                                    width={50} height={50}
                                                    priority={true}
                                                />
                                                <p>App Development</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} xl={7}>
                        <figure className={Styles.poster}>
                            <Image
                                src={image?`${process.env.NEXT_PUBLIC_MEDIA_URL}${image}`:`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/laptop.png`}
                                alt="Laptop"
                                fill
                                priority={true}
                            />
                        </figure>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Banner;