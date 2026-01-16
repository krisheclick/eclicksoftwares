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
                            <div className={`skeleton w-50 mx-auto mb-2 ${Styles.skeletonTitle}`}></div>
                            <div className={`skeleton w-75 mx-auto ${Styles.skeletonTitle}`}></div>
                        </div>
                    </Container>
                </div>
            </Container>
        </div>
    );
};

export default BannerSkeleton;
