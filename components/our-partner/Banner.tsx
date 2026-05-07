import Image from "next/image";
import { Container } from "react-bootstrap";
import Styles from "./style.module.css";

interface BannerItem {
    name: string;
    is_compoment: string;
    z6hd_title: string;
    z6hd_short_description: string;
    z6hd_button_name: string;
    z6hd_button_link: string;
    z6hd_image: string;
}

interface BannerProps {
    hasLoading: boolean;
    data: BannerItem | null;
}

const Banner = ({ hasLoading, data }: BannerProps) => {
    return (
        !hasLoading ? (
            <div className={Styles.heroSection} style={{ background: `url(${`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${data?.z6hd_image}`}) no-repeat top center / cover` }}>
                <div className={Styles.bannerText}>
                    <Container>
                        <div className={Styles.bannerText_in}>
                            {
                                data?.z6hd_title && (
                                    <h1 dangerouslySetInnerHTML={{ __html: data?.z6hd_title }} className={`${Styles.bannerTitle}`} />
                                )
                            }
                            {data?.z6hd_short_description && (
                                <div className={Styles.banerparaul}>
                                    <div dangerouslySetInnerHTML={{ __html: data.z6hd_short_description }} className="editorText" />
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
