import Image from "next/image";
import { Container } from "react-bootstrap";
import Link from "next/link";
import Styles from "./bannerstyle.module.css";
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
        <div className={Styles.banner}> 
            <figure className={Styles.bannerImageWrapper}>
                {!hasLoading ? (
                    <>
                        <Image
                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${data?.d05d_image}`}
                            alt={data?.d05d_title || "Banner Poster"}
                            fill
                            priority
                            className={Styles.bannerImage}
                        />
                        <div className={Styles.overlayGradient}></div>
                    </>
                ) : (
                    <div className="skeleton skeletonFill"></div>
                )}
            </figure>
            <div className={Styles.bannerContent}>
                <Container>
                    <div className={Styles.contentInnerr}>
                        {!hasLoading ? (
                            <>
                                <div className={Styles.contentWrappere}>
                                    {data?.d05d_title && (
                                        <h1 dangerouslySetInnerHTML={{ __html: data?.d05d_title }} className={`title ${Styles.bannerTitle}`}/>
                                    )}
                                    {data?.d05d_description && (
                                        <div className={Styles.bannerDescriptioen}>
                                            <div dangerouslySetInnerHTML={{ __html: data.d05d_description }}/>
                                        </div>
                                    )}
                                    {data?.d05d_button_name && data?.d05d_button_link && (
                                        <div className={Styles.bannerButton}>
                                            <Link href={data.d05d_button_link} className={Styles.ctaButton}>
                                                {data.d05d_button_name}
                                                <FontAwesomeIcon icon={faArrowRight} className={Styles.buttonIcon} />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={`skeleton w-50 mx-auto mb-3 ${Styles.skeletonTitle}`}></div>
                                <div className={`skeleton w-75 mx-auto mb-3 ${Styles.skeletonDesc}`}></div>
                                <div className={`skeleton w-40 mx-auto ${Styles.skeletonButton}`}></div>
                            </>
                        )}
                    </div>
                </Container>
            </div> 
        </div>
    );
};

export default Banner;
