import Image from "next/image";
import { Container } from "react-bootstrap";
import Styles from "./style.module.css";

interface BannerItem {
    h6xu_image?: string;
    h6xu_title?: string;
    banner?: BannerItem;
}

interface BannerProps {
    hasLoading: boolean;
    data: BannerItem | null;
}

const Banner = ({ hasLoading, data }: BannerProps) => {
    return (
        <div className={Styles.banner}>
            <Container className="container-full">
                <figure>
                    {!hasLoading ? (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${data?.h6xu_image}`}
                            alt={data?.h6xu_title || "Banner Poster"}
                            fill
                            priority
                        />
                    ) : (
                        <div className="skeleton skeletonFill"></div>
                    )}
                </figure>
                <div className={Styles.bannerText}>
                    <Container>
                        <div className={Styles.bannerText_in}>
                            {!hasLoading ? (
                                data?.h6xu_title && (
                                    <h1 dangerouslySetInnerHTML={{ __html: data?.h6xu_title }} className={`title ${Styles.bannerTitle}`} />
                                )
                            ) : (
                                <>
                                    <div className={`skeleton w-50 mx-auto mb-2 ${Styles.skeletonTitle}`}></div>
                                    <div className={`skeleton w-75 mx-auto ${Styles.skeletonTitle}`}></div>
                                </>
                            )}
                        </div>
                    </Container>
                </div>
            </Container>
        </div>
    );
};

export default Banner;
