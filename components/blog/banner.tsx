import { Container } from 'react-bootstrap'
import Styles from './style.module.css'

const BlogBanner = () => {
    return (
        <div className={Styles.banner}>
            <Container>
                <div className={Styles.bannertext}>
                    <h1 className={Styles.heading}>Ideas Are the New Fuel.</h1>
                    <div className={Styles.bannerContent}><p>Are you starting a brand, campaign, blog, or just exploring ideas?</p></div>
                </div>
            </Container>
        </div>
    )
}

export default BlogBanner
