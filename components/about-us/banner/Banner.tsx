import { Container } from "react-bootstrap";
import CustomImage from "@/utils/CustomImage";
import Styles from "./style.module.css";

interface BannerItem {
    h6xu_image?: string;
    h6xu_title?: string;
    banner?: BannerItem;
}

interface BannerProps {
    data: BannerItem | null;
}

const Banner = ({ data }: BannerProps) => {
    return (
        <div className={Styles.banner}>
            <Container className="container-full">
                <CustomImage
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${data?.h6xu_image}`}
                    alt={data?.h6xu_title || "Banner Poster"}
                    className={Styles.bannerPoster}
                />
                <div className={Styles.bannerText}>
                    <Container>
                        <div className={Styles.bannerText_in}>
                            {data?.h6xu_title && (
                                <h1 dangerouslySetInnerHTML={{ __html: data?.h6xu_title }} className={`title ${Styles.bannerTitle}`} />
                            )}
                        </div>
                    </Container>
                </div>
            </Container>
        </div>
    );
};

export default Banner;
