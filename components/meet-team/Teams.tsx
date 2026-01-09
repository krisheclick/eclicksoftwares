import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import Card from './Card';

type TeamMember = {
    team_feature_image_path: string;
    team_title: string;
    team_rating: string;
    team_designation: string;
    team_description: string;
    team_feature_image: string;
}

type Content = {
    hnd4_title?: string;
    hnd4_heading?: string;
    team?: Content;
}

interface Props {
    hasLoading?: boolean;
    content?: Content;
    data?: TeamMember[];
}

const Teams = ({ hasLoading, content, data }: Props) => {
    const team = content?.team;
    return (
        <div className={Styles.sectionArea}>
            <Container>
                <div className={`section-content text-center full ${Styles.section_content ?? ''}`}>
                    {!hasLoading ? (
                        <>
                            {team?.hnd4_title && (
                                <div className="small_title">{team.hnd4_title}</div>
                            )}
                            <div className={`title fw-bold text-black ${Styles.title ?? ''}`}
                                dangerouslySetInnerHTML={{ __html: team?.hnd4_heading || '' }}
                            />
                        </>
                    ) : (
                        <>
                            {team?.hnd4_title && (
                                <div className="skeleton skeletonSmallTitle"></div>
                            )}
                            <div className="skeleton skeletonTitle" />
                        </>
                    )}
                </div>
                <div className={Styles.cardList}>
                    <Row className={`rowGap2 ${Styles.cardRow ?? ''}`}>
                        {data?.map((value, index) => (
                            <Col xl={3} lg={4} sm={6} key={index} className={Styles.cardItem}>
                                <Card
                                    poster={value?.team_feature_image_path}
                                    name={value?.team_title}
                                    designation={value?.team_designation}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default Teams
