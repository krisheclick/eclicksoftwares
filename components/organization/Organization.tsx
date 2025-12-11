import { Col, Container, Row } from 'react-bootstrap'
import Styles from './style.module.css'
import Card from './Card'

type ValuePoint = {
    title: string;
    filename: string;
}
type props = {
    isLoading: boolean;
    value_points: ValuePoint[];
    values_title: string;
}

const Organization = ({ isLoading, values_title, value_points }: props) => {
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
                        <Row className='justify-content-center'>
                            {!isLoading ? (
                                <Card value_points={value_points} />
                            ) : (
                                [...Array(4)].map((_, index) => (
                                    <Col lg={3} key={index} className={Styles.columnBox}>
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
        </>
    )
}

export default Organization
