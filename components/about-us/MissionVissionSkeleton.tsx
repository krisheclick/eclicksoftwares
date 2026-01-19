import { Container } from 'react-bootstrap';
import Styles from './style.module.css';
import SkeletonCard from '../common/postercard/SkeletonCard';
const MissionVissionSkeleton = () => {
    return (
        <div className={Styles.mission_vission}>
            <Container>
                <div className={`rowCard ${Styles.row}`}>
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </Container>
        </div>
    );
};

export default MissionVissionSkeleton;