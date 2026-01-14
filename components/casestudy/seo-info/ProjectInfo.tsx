import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css'

interface Props {
    business_data?: string | string[];
    initial_challenges?: string | string[];
}
const ProjectInfo = ({ business_data, initial_challenges }: Props) => {
    if (!business_data && !initial_challenges) return null;
    return (
        <div className={`sectionArea ${Styles.sectionArea ?? ''}`}>
            <Container>
                <Row>
                    {business_data && (
                        <Col lg={6}>
                            <div className={Styles.business_data}>
                                <div className={Styles.caseTitle}>Business Objectives</div>
                                <div className={`noList ${Styles.case_content}`} 
                                    dangerouslySetInnerHTML={{__html: business_data || ''}}
                                />
                            </div>
                        </Col>
                    )}
                    {initial_challenges && (
                        <Col lg={6}>
                            <div className={Styles.initial_challenges}>
                                <div className={Styles.caseTitle}>Initial Challenges</div>
                                <div className={`editorText blue noList ${Styles.case_content ?? ''}`} 
                                    dangerouslySetInnerHTML={{__html: initial_challenges || ''}}
                                />
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    )
}

export default ProjectInfo
