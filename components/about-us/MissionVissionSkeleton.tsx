import { Container } from 'react-bootstrap';
import Styles from './style.module.css';
const MissionVissionSkeleton = () => {
    return (
        <div className={Styles.mission_vission}>
            <Container>
                <div className={`row rowGap ${Styles.missionVisionRow}`}>
                    <div className="col-lg-6 col-md-6">
                        <div className={Styles.contentCard}>
                            <div className={`skeleton ${Styles.topLine}`}>&nbsp;</div>
                            <span className={`skeleton ${Styles.mission_subtitle}`}>&nbsp;</span>
                            <span className={`skeleton ${Styles.mission_subtitle}`}>&nbsp;</span>
                            <h2 className={`heading ${Styles.mission_title}`}>
                                <div className="skeleton skeletonText d-sm-none"></div>
                                <div className="skeleton skeletonText"></div>
                                <div className="skeleton skeletonText w-75"></div>
                                <div className="skeleton skeletonText w-50"></div>
                            </h2>
                            <div className={Styles.description}>
                                <div className="skeleton skeletonText"></div>
                                <div className="skeleton skeletonText"></div>
                                <div className="skeleton skeletonText"></div>
                                <div className="skeleton skeletonText"></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className={Styles.contentCard}>
                            <div className={`skeleton ${Styles.topLine}`}>&nbsp;</div>
                            <span className={`skeleton ${Styles.mission_subtitle}`}>&nbsp;</span>
                            <span className={`skeleton ${Styles.mission_subtitle}`}>&nbsp;</span>
                            <h2 className={`heading ${Styles.mission_title}`}>
                                <div className="skeleton skeletonText d-sm-none"></div>
                                <div className="skeleton skeletonText"></div>
                                <div className="skeleton skeletonText w-75"></div>
                                <div className="skeleton skeletonText w-50"></div>
                            </h2>
                            <div className={Styles.description}>
                                <div className="skeleton skeletonText"></div>
                                <div className="skeleton skeletonText"></div>
                                <div className="skeleton skeletonText"></div>
                                <div className="skeleton skeletonText"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default MissionVissionSkeleton;