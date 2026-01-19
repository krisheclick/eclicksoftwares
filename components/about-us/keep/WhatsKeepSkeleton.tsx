import { Container, Row } from 'react-bootstrap';
import Styles from './style.module.css'
import SkeletonKeepCard from './SkeletonKeepCard';

const WhatsKeepSkeleton = () => {
    return (
        <div className={`sectionArea ${Styles.whatsKeep ?? ''}`}>
            <Container>
                <div className={`section-content text-center full ${Styles.section_content ?? ''}`}>
                    <div className="skeleton skeletonTitle" />
                </div>
                <div className={Styles.cardList}>
                    <Row className={`gx-0 ${Styles.cardRow ?? ''}`}>
                        {[...Array(4)].map((_, index) => (
                            <SkeletonKeepCard key={index} />
                        ))}
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default WhatsKeepSkeleton;