import { Container } from "react-bootstrap";
import Styles from "./style.module.css";

const BannerSkeleton = () => {
    return (
        <div className={Styles.banner}>
            <Container className="container-full">
                <figure className={`skeletonPoster ${Styles.bannerPoster} ${Styles.bannerSkeleton}`}></figure>
                <div className={Styles.bannerText}>
                    <Container>
                        <div className={Styles.bannerText_in}>
                            <div className={`title ${Styles.bannerTitle}`}>
                                <b className="skeleton mx-auto mb-2 w-75 w-lg-50">&nbsp;</b>
                                <div className="skeleton mx-auto  w-100 w-lg-75">&nbsp;</div>
                            </div>
                        </div>
                    </Container>
                </div>
            </Container>
        </div>
    );
};

export default BannerSkeleton;
