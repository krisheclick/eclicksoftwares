import { Container, Stack } from 'react-bootstrap';
import Styles from './style.module.css';
import TeamCardSkeleton from './TeamCardSkeleton';

const TeamSkeleton = () => {
    return (
        <div className={Styles.sectionArea}>
            <Container>
                <div className={`section-content text-center full ${Styles.section_content ?? ''}`}>
                    <div className="skeleton skeletonSmallTitle"></div>
                    <div className="skeleton skeletonTitle" />
                </div>
                <div className={Styles.cardList}>
                    <div className={Styles.cardRow}>
                        {[...Array(10)]?.map((value, index) => (
                            <Stack className={Styles.cardItem} key={index}>
                                <TeamCardSkeleton />
                            </Stack>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default TeamSkeleton
