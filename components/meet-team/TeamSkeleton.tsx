import { Col, Container, Row } from 'react-bootstrap';
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
                    <Row className={`rowGap2 ${Styles.cardRow ?? ''}`}>
                        {[...Array(10)]?.map((value, index) => (
                            <Col xl={3} lg={4} sm={6} key={index} className={Styles.cardItem}>
                                <TeamCardSkeleton />
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default TeamSkeleton
