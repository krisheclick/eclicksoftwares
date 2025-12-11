import { Container, Col, Row } from "react-bootstrap";
import Styles from "./sliderbanner.module.css";
import Image from "next/image";
import Link from "next/link";
type Props = {
    isLoading: boolean;
    banner:  Project | undefined;
    bannerdata: BannerData;
}
type Project = {
    proj_name: string;
    proj_slug: string;
    proj_banne_image: string;
    proj_banne_image_path: string | null;
    proj_responsive_image_1_path: string | null;
    proj_responsive_image_2_path: string | null;
    proj_tools_used: string;
}
type BannerData = {
  joza_title: string;
  title_tag: string;
  joza_description: string;
}
const SliderBanner = ({ isLoading, banner, bannerdata}: Props) => {
    return (
        <div className={Styles.sliderBanner}>
            <Container>
                <Row className="gx-xl-0">
                    <Col lg={6} xxl={5}>
                        <div className={Styles.content}>
                            <div className={Styles.bannerText}>
                                <div className={`titleTag ${Styles.titleTag}`}>{bannerdata?.title_tag}</div>
                                <div className={`title`} dangerouslySetInnerHTML={{
                                    __html: bannerdata?.joza_title
                                    .replace(/Â+/g, "")
                                    .replace(/\s+/g, " ")
                                    .trim(),
                                }} />
                                <div className={Styles.bannerContent} dangerouslySetInnerHTML={{
                                    __html: bannerdata?.joza_description
                                    .replace(/Â+/g, "")
                                    .replace(/\s+/g, " ")
                                    .trim(),
                                }} />
                            </div>
                            <div className={Styles.usp}>
                                <Row className={Styles.row}>
                                    <Col lg={4} xxl={4}>
                                        <div className={Styles.uspBox}>
                                            <Image
                                                className="auto-img"
                                                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/cluth.png`}
                                                alt="Clutch"
                                                width={50} height={50}
                                                priority={true}
                                            />
                                            <p>global leaders, top b2b companies, top developers</p>
                                        </div>
                                    </Col>
                                    <Col lg={4} xxl={4}>
                                        <div className={Styles.uspBox}>
                                            <Image
                                                className="auto-img"
                                                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/ui-ux.png`}
                                                alt="UI UX"
                                                width={50} height={50}
                                                priority={true}
                                            />
                                            <p>ux, ui, innovation, special kudos css design awards</p>
                                        </div>
                                    </Col>
                                    <Col lg={4} xxl={4}>
                                        <div className={Styles.uspBox}>
                                            <Image
                                                className="auto-img"
                                                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/android-app.png`}
                                                alt="Android app development"
                                                width={50} height={50}
                                                priority={true}
                                            />
                                            <p>top android app development company</p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="mt-5">
                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}`} className={`eclick-btn-connect lg ${Styles.bannerBtn ?? ''}`}>
                                    <span className={Styles.phoneIcon}>
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/chat.png`}
                                            alt="Conversation"
                                            width={23} height={22}
                                            loading="lazy"
                                        />
                                    </span>
                                    <em>Let’s Connect</em>
                                </Link>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} xxl={7}>
                        <div className={Styles.mixinDassboard}>
                            <div className={Styles.imagePart}>
                                <figure className={Styles.big_img}>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${banner?.proj_banne_image_path}`}
                                        alt="Dashboard"
                                        width={584} height={556}
                                        priority={true}
                                    />
                                </figure>
                                <figure className={Styles.small_img}>
                                    <Image
                                        className="auto-img"
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${banner?.proj_responsive_image_1_path}`}
                                        alt="Dashboard Mobile 1"
                                        width={127} height={250}
                                        priority={true}
                                    />
                                    <Image
                                        className="auto-img"
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${banner?.proj_responsive_image_2_path}`}
                                        alt="Dashboard Mobile 2"
                                        width={122} height={220}
                                        priority={true}
                                    />
                                </figure>
                                <div className={Styles.slogan_list}>
                                    <ul>
                                        {banner?.proj_tools_used && JSON.parse(banner?.proj_tools_used).map((tool: { value: string }, index: number) => (
                                            <li key={index}>{tool?.value}</li>
                                        ))}
                                        {/* <li>Custom Software</li>
                                        <li>Cloud Services</li>
                                        <li>UI/UX Analysis</li>
                                        <li>Web & Mobile Apps</li> */}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default SliderBanner;