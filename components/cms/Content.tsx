import { Container } from 'react-bootstrap';
import Styles from './Styles.module.css'
type DataType = {
    page_title: string;
    heading: string;
    description: string;
}

type Props = {
    data: DataType | null;
};

const Content = ({ data }: Props) => {
    return (
        <div className={Styles.sectionArea}>
            <Container>
                <div className={Styles.content}>
                    {data?.heading && (
                        <h2 className={`title fw-semibold ${Styles.pageTitle}`}>{data?.heading}</h2>
                    )}
                    <div className={`editorText ${Styles.editorText}`}>
                        <div dangerouslySetInnerHTML={{__html: data?.description ?? ''}} />
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Content
