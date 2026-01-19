import { Container } from 'react-bootstrap'
import Styles from './style.module.css';
import CustomImage from '@/utils/CustomImage';


type Technology = {
    technology_feature_image_path: string;
    technology_title: string;
    technology_feature_image: string;
}

type props = {
    technologies: Technology[];
    title?: string;
}

const Technologies = ({ title, technologies }: props) => {
    return (
        // technologies.length > 0 &&(
        <div className={Styles.technologiesArea}>
            <Container>
                <div className={`section-content full text-center ${Styles.section_content ?? ''}`}>
                    <h3 className={`title ${Styles.title ?? ''}`}>{title}</h3>
                </div>
                <div className={Styles.brands}>
                    <ul className='noList'>
                        {technologies.slice(0, 10)?.map((value, index) => {
                            return (
                                <li key={index}>
                                    <CustomImage
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${value?.technology_feature_image_path}`}
                                        alt={value?.technology_title}
                                        className={Styles.brandLogo}
                                    />
                                    <span>{value?.technology_title}</span>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </Container>
        </div>
        // )
    )
}

export default Technologies
