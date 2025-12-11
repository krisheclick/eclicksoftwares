import { Container } from 'react-bootstrap';
import Styles from './Styles.module.css'
type dataType = {
    pageTitle: string;
    content: string;
}

type Props = {
    data?: dataType;
}
const Content = ({ data }: Props) => {
    return (
        <div className={Styles.sectionArea}>
            <Container>
                <div className={Styles.content}>
                    {data?.pageTitle && (
                        <h2 className={`title fw-semibold ${Styles.pageTitle}`}>{data?.pageTitle}</h2>
                    )}
                    <div className={`editorText ${Styles.editorText}`}>
                        <div dangerouslySetInnerHTML={{__html: data?.content ?? ''}} />
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Content
