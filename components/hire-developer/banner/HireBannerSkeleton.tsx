import { Container } from 'react-bootstrap';
import Styles from './style.module.css';
import SkeletonStyle from './style.module.css';

const HireBannerSkeleton = () => {
    return (
        <div className={`skeleton ${SkeletonStyle.skeletonBanner}`}>
            <Container>
                <div className={Styles.heroWrapper}>
                    <div className={Styles.banner_content}>
                        <div className={`mb-2 ${SkeletonStyle.banner_heading}`}>&nbsp;</div>
                        <div className={SkeletonStyle.banner_heading}>
                            <span className='skeleton'>&nbsp;</span>
                        </div>
                        <span className={`skeleton mb-3 ${SkeletonStyle.bannersubTitle}`}>&nbsp;</span>
                        <div className={Styles.bannersubTitle}>
                            <div className="skeleton skeletonText mb-2"></div>
                            <div className="skeleton skeletonText mb-2"></div>
                            <div className="skeleton skeletonText"></div>
                        </div>
                        <div className="skeleton" style={{ width: 220 }}>
                            <em className="skeleton"></em>
                            <span className="skeleton" style={{ width: 40, height: 40 }}></span>
                        </div>
                        <div className={Styles.recommend}>
                            <div className={`skeleton ${Styles.banner_rech}`}>&nbsp;</div>
                            <div className={Styles.recommendCards}>
                                {[...Array(2)].map((_, index) => (
                                    <div className={Styles.card} key={index}>
                                        <figure className={`skeleton ${SkeletonStyle.skeletonIcon}`}></figure>
                                        <div className="w-100">
                                            <strong className={`skeleton mb-2 w-75 ${SkeletonStyle.skeletonName}`}></strong>
                                            <strong className={`skeleton skeletonText w-100 ${SkeletonStyle.skeleton_designation}`}></strong>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                    <div className={Styles.right}>
                        <div className={`${Styles.floatingCard} ${SkeletonStyle.floatingCard}`}>
                            <figure>
                                <div className="skeleton skeletonFill"></div>
                            </figure>
                            <div className="w-100">
                                <strong className={`skeleton mb-2 w-75 ${SkeletonStyle.skeletonName ?? ''}`}></strong>
                                <strong className={`skeleton skeletonText w-100 ${SkeletonStyle.skeleton_designation ?? ''}`}></strong>
                                <div className={`${Styles.stars} ${SkeletonStyle.stars}`}>★★★★★</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default HireBannerSkeleton
