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
                <Row className={`rowGap gx-2 gx-sm-3 gx-xl-4 ${Styles.mobileNone}`}>
                    <Col sm={6}>
                        <h6>Challenges</h6>
                    </Col>
                    <Col sm={6}>
                        <h6>Solutions</h6>
                    </Col>
                </Row>
                {Array.isArray(caseStudy) && caseStudy.length > 0 && (
                    caseStudy?.map((value, index) => {
                        const { ca_std_name, ca_std_problem_statement, ca_std_approach } = value;
                        return (
                            <div className={Styles.challengesList} key={index}>
                                <Row className="rowGap gx-2 gx-sm-3 gx-xl-4">
                                    <Col sm={6}>
                                        <div className={Styles.challenges}>
                                            <div className={`${Styles.headWrap} d-flex align-items-center gap-2`}>
                                                <div className={Styles.listIcon}>
                                                    <FontAwesomeIcon icon={faFlag} />
                                                </div>
                                                <h6 className={Styles.mobileBlock}>Challenges</h6>
                                            </div>
                                            <aside>
                                                <h2>{ca_std_name}</h2>
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: ca_std_problem_statement || "" }}
                                                />
                                            </aside>
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className={`${Styles.challenges} ${Styles.solutions}`}>
                                            <div className={`${Styles.headWrap} d-flex align-items-center gap-2`}>
                                                <div className={Styles.listIcon}>
                                                    <FontAwesomeIcon icon={faLightbulb} />
                                                </div>
                                                <h6 className={Styles.mobileBlock}>Solutions</h6>
                                            </div>
                                            <aside>
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: ca_std_approach || "" }}
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