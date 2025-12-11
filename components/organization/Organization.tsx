import { Col, Container, Row } from 'react-bootstrap'
import Styles from './style.module.css'
import Card from './Card'
import List from './List'

type ValuePoint = {
    title: string;
    filename: string;
}

type ProcessStep = {
    filename: string;
    name: string;
    title: string;
    description: string;
}

type props = {
    isLoading: boolean;
    value_points: ValuePoint[];
    process_steps: ProcessStep[];
    values_title: string;
    process_title: string;
}

const Organization = ({ isLoading, values_title, value_points, process_title, process_steps }: props) => {
    return (
        <>
            <div className={`sectionArea ${Styles.valuesArea}`}>
                <Container>
                    <div className={`section-content full text-center ${Styles.section_content ?? ''}`}>
                        {!isLoading ? (
                            <h2 className={`title fw-normal ${Styles.title ?? ''}`}>{values_title ? values_title : 'Custom Software Brings Value To Your Organization'}</h2>
                        ) : (
                            <div className="skeleton w-100 skeletonTitle"></div>
                        )}
                    </div>
                    <div className={Styles.cardList}>
                        <Row>
                            {!isLoading ? (
                                <Card value_points={value_points} />
                            ) : (
                                [...Array(4)].map((_, index) => (
                                    <Col lg={3} key={index}>
                                        <div className={Styles.box}>
                                            <figure className={`skeleton ${Styles.icon}`}></figure>
                                            <div className="skeleton w-100" style={{ height: 22, marginBottom: 4 }}></div>
                                            <div className="skeleton w-75 m-auto" style={{ height: 22 }}></div>
                                        </div>
                                    </Col>
                                ))
                            )}
                        </Row>
                    </div>

                </Container>
            </div>

            <div className={Styles.processSection}>
                <Container>
                    <div className={`section-content full text-center ${Styles.section_content ?? ''}`}>
                        {!isLoading ? (
                            <h3 className={`title fw-normal ${Styles.title ?? ''}`}>{process_title ? process_title : 'Our Process'}</h3>
                        ) : (
                            <div className="skeleton w-100 skeletonTitle"></div>
                        )}
                    </div>
                    <List isLoading={isLoading} process_steps={process_steps} />
                </Container>
            </div>
        </>
    )
}

export default Organization
