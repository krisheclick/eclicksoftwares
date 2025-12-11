import { Col, Row } from 'react-bootstrap';
import Styles from './style.module.css';

const Tabskeleton = () => {
    return (
        <>
            <div className={Styles.tabs}>
                <ul className="noList">
                    {[...Array(6)].map((_, index) => (
                        <li key={index} className='skeleton'></li>
                    ))}
                </ul>
            </div>
            <div className={Styles.gap}>
                <Row className="rowGap">
                    {[...Array(4)].map((_, index) => (
                        <Col lg={6} key={index}>
                            <div className={Styles.rowList}>
                                <div className={Styles.card}>
                                    <figure className={`skeleton ${Styles.cardPoster}`}></figure>
                                    <aside>
                                        <div className="skeleton mb-3" style={{ width: "85%", height: 32 }}></div>
                                        <div className={"skeleton skeletonText"} style={{ width: "100%" }}></div>
                                        <div className={"skeleton skeletonText"} style={{ width: "100%" }}></div>
                                        <div className={"skeleton skeletonText"} style={{ width: "85%" }}></div>
                                        <ul className='my-4'>
                                            <li>
                                                <span className='skeleton w-75 mb-1' style={{ height: 12 }}></span>
                                                <em className='skeleton w-100 skeletonText'></em>
                                            </li>
                                            <li>
                                                <span className='skeleton w-75 mb-1' style={{ height: 12 }}></span>
                                                <em className='skeleton w-100 skeletonText'></em>
                                            </li>
                                        </ul>
                                        <div className='skeleton w-50' style={{ height: 32 }}></div>
                                    </aside>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    )
}

export default Tabskeleton
