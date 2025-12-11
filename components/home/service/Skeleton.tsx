import { Col } from 'react-bootstrap'
import Styles from './style.module.css'

const SkeletonCard = () => {
  return (
    <Col lg={3} sm={6}>
    <div className={`text-center ${Styles.box} ${Styles.skeletonBox}`}>
      <div className={Styles.subtitle} style={{width: "100%"}}>
        <div className="skeleton" style={{width: "60%", height: "24px", marginBottom: 10}}></div>
        <div className="skeleton" style={{width: "100%", height: "24px"}}></div>        
      </div>
      <div className={`skeleton ${Styles.poster}`} style={{width: "100%"}}></div>
    </div>
    </Col>
  )
}

export default SkeletonCard
