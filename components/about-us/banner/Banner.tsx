import Image from "next/image";
import Styles from "./style.module.css";
import { Container } from "react-bootstrap";

interface BannerItem {
    h6xu_image?: string;
    h6xu_title?: string;
    banner?: BannerItem;
}
interface BannerProps {
    data: BannerItem;
}

const Banner = ({ data }: BannerProps) => {
    const banner = data?.banner;

    if (!banner) return null;

    return (
        <div className={Styles.banner}>
            <figure>
                <Image
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${banner.h6xu_image}`}
                    alt={banner.h6xu_title || "Banner Poster"}
                    width={1920}
                    height={620}
                />
            </figure>
            <div className="">
                <Container>
                    {banner.h6xu_title && (
                        <h1 dangerouslySetInnerHTML={{ __html: banner.h6xu_title }} />
                    )}
                </Container>
            </div>

        </div>
    );
};

export default Banner;
