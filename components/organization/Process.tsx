import { Container } from 'react-bootstrap'
import Styles from './style.module.css'
import List from './List'

type ProcessStep = {
    filename: string;
    name: string;
    title: string;
    description: string;
}
type props = {
    isLoading: boolean;
    process_steps: ProcessStep[];
    process_title: string;
}

const Process = ({ isLoading, process_title, process_steps }: props) => {
    return (
        <div className={`sectionArea ${Styles.processSection ?? ''}`}>
            <Container>
                <div className={`section-content full text-center ${Styles.section_content ?? ''}`}>
                    {!isLoading ? (
                        <h3 className={`title fw-normal ${Styles.title ?? ''}`} 
                            dangerouslySetInnerHTML={{__html: process_title ? process_title : 'Our Process'}}
                        />
                    ) : (
                        <div className="skeleton w-100 skeletonTitle"></div>
                    )}
                </div>
                <List isLoading={isLoading} process_steps={process_steps} />
            </Container>
        </div>
    )
}

export default Process
