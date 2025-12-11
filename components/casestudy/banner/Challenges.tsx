import { Col, Container, Row } from "react-bootstrap";
import Styles from "../casestudy.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { faLightbulb } from "@fortawesome/free-regular-svg-icons/faLightbulb";

type Casestudy = {
    ca_std_name?: string;
    ca_std_problem_statement?: string;
    ca_std_approach?: string;
}
type Data = {
    case_study?: Casestudy[] | undefined;
}
type Props = {
    data?: Data;
}

const Challenges = ({ data }: Props) => {
    const caseStudy = data?.case_study;
    return (
        <section className={Styles.challengesSection}>
            <Container>
                <Row>
                    <Col lg={6}>
                        <h6>Challenges</h6>
                    </Col>
                    <Col lg={6}>
                        <h6>Solutions</h6>
                    </Col>
                </Row>
                {Array.isArray(caseStudy) && caseStudy.length > 0 && (
                    caseStudy?.map((value, index) => {
                        const { ca_std_name, ca_std_problem_statement, ca_std_approach } = value;
                        return (
                            <div className={Styles.challengesList} key={index}>
                                <Row>
                                    <Col lg={6}>
                                        <div className={Styles.challenges}>
                                            <div className={Styles.listIcon}>
                                                <FontAwesomeIcon icon={faFlag} />
                                            </div>
                                            <aside>
                                                <h2>{ca_std_name}</h2>
                                                <div 
                                                    dangerouslySetInnerHTML={{__html: ca_std_problem_statement || ""}}
                                                />
                                            </aside>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className={`${Styles.challenges} ${Styles.solutions}`}>
                                            <div className={Styles.listIcon}>
                                                <FontAwesomeIcon icon={faLightbulb} />
                                            </div>
                                            <aside>
                                                <div 
                                                    dangerouslySetInnerHTML={{__html: ca_std_approach || ""}}
                                                />
                                            </aside>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )
                    })
                )}

            </Container>
        </section>
    )
}

export default Challenges