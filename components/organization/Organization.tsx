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
                            <h2 className={`title fw-normal ${Styles.title ?? ''}`}
                                dangerouslySetInnerHTML={{__html: values_title ? values_title : 'Custom Software Brings Value To Your Organization'}}
                            />
                        ) : (
                            <div className={`title fw-normal ${Styles.title ?? ''}`}>
                                <div className='skeleton w-75'>&nbsp;</div>
                                <b className='skeleton mt-1'>&nbsp;</b>
                                <b className='skeleton d-sm-none mt-1'>&nbsp;</b>
                            </div>
                        )}
                    </div>
                    <div className={Styles.cardList}>
                        <Row className={`rowGap gx-2 gx-sm-3 gx-xl-4 justify-content-center ${Styles.cardsRow}`}>
                            {!isLoading ? (
                                <Card value_points={value_points} />
                            ) : (
                                [...Array(4)].map((_, index) => (
                                    <Col xs={6} lg={3} key={index}>
                                        <div className={Styles.box}>
                                            <figure className={`skeleton ${Styles.icon}`}></figure>
                                            <div className={`${Styles.boxtitle} skeleton w-75`}>&nbsp;</div>
                                            <div className={`${Styles.boxtitle} skeleton w-75 d-xl-none mt-1`}>&nbsp;</div>
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
