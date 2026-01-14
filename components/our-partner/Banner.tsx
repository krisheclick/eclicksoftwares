import Image from "next/image";
import { Container } from "react-bootstrap";
import Styles from "./bannerstyle.module.css";

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
        <div className={Styles.banner}> 
            <figure className={Styles.partnerabnrmain}>
                {!hasLoading ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${data?.z6hd_image}`}
                        alt={data?.z6hd_title || "Banner Poster"}
                        fill
                        priority
                    />
                ) : (
                    <div className="skeleton skeletonFill"></div>
                )}
            </figure>
            <div className={Styles.bannerTextPartner}>
                <Container>
                    <div className={Styles.bannerTextpartner}>
                        {!hasLoading ? (
                            <>
                            {
                                data?.z6hd_title && (
                                    <h1 dangerouslySetInnerHTML={{ __html: data?.z6hd_title }} className={`title ${Styles.bannerTitle}`} />
                                )
                            }
                            {data?.z6hd_short_description && (
                                <div className={Styles.banerparaul}><div dangerouslySetInnerHTML={{ __html: data.z6hd_short_description }}/></div>
                            )}
                            </>
                        ) : (
                            <>
                                <div className={`skeleton w-50 mx-auto mb-2 ${Styles.skeletonTitle}`}></div>
                                <div className={`skeleton w-75 mx-auto ${Styles.skeletonTitle}`}></div>
                            </>
                        )}
                    </div>
                </Container>
            </div> 
        </div>
    );
};

export default Banner;
