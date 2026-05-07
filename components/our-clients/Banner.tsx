import { Container } from "react-bootstrap";
import Link from "next/link";
import Styles from "./banner.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface BannerItem {
    name: string;
    is_compoment: string;
    d05d_title: string;
    d05d_description: string;
    d05d_button_name: string;
    d05d_button_link: string;
    d05d_image: string;
}

interface BannerProps {
    hasLoading: boolean;
    data: BannerItem | null;
}

const Banner = ({ hasLoading, data }: BannerProps) => {
    return (
        !hasLoading ? (
            <div className={Styles.heroSection} style={{ background: `url(${`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${data?.d05d_image}`}) no-repeat top center / cover` }}>
                <div className={Styles.bannerText}>
                    <Container>
                        <div className={Styles.bannerText_in}>
                            {
                                data?.d05d_title && (
                                    <h1 dangerouslySetInnerHTML={{ __html: data?.d05d_title }} className={`${Styles.bannerTitle}`} />
                                )
                            }
                            {data?.d05d_description && (
                                <div className={Styles.banerparaul}>
                                    <div dangerouslySetInnerHTML={{ __html: data.d05d_description }} className="editorText" />
                                </div>
                            )}
                            {data?.d05d_button_name && data?.d05d_button_link && (
                                <div className={`btn_wrap btn_left ${Styles.btnbanner}`}>
                                    <Link href={data.d05d_button_link} className={`eclick-btn-journey`}>
                                        <em>{data.d05d_button_name}</em>
                                        <span className={Styles.icon}>
                                            <FontAwesomeIcon icon={faArrowRight} />
                                        </span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Container>
                </div>
            </div>
        ) : (
            <div className={Styles.heroSection}>
                <div className="skeleton skeletonFill"></div>
            </div>
        )
    );
};

export default Banner;
