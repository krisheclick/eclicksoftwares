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
                        <h3 className={`title fw-normal ${Styles.title ?? ''}`}>
                            <div className='skeleton w-75 w-lg-50'>&nbsp;</div>
                            <b className='skeleton mt-1 w-100 w-lg-75'>&nbsp;</b>
                            <b className='skeleton d-sm-none mt-1'>&nbsp;</b>
                        </h3>
                    )}
                </div>
                <List isLoading={isLoading} process_steps={process_steps} />
            </Container>
        </div>
    )
}

export default Process
