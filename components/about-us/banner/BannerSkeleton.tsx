import { Container } from "react-bootstrap";
import Styles from "./style.module.css";

const BannerSkeleton = () => {
    return (
        <div className={Styles.banner}>
            <Container className="container-full">
                <figure className={`skeletonPoster ${Styles.bannerPoster} ${Styles.bannerSkeleton}`}><div className="skeleton skeletonFill"></div></figure>
                <div className={Styles.bannerText}>
                    <Container>
                        <div className={Styles.bannerText_in}>
                            <div className={`title ${Styles.bannerTitle}`}>
                                <b className="skeleton mb-2">&nbsp;</b>
                                <div className="skeleton mb-2">&nbsp;</div>
                            </div>
                        </div>
                    </Container>
                </div>
            </Container>
        </div>
    );
};

export default BannerSkeleton;
