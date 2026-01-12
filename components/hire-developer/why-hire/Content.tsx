import { Container } from "react-bootstrap";
import Styles from "./style.module.css";

interface RepeaterItem {
    title?: string;
    description?: string;
}
interface Props {
    hasLoading: boolean;
    data: RepeaterItem[];
}
const Content = ({ hasLoading, data }: Props) => {
    return (
        <div className={Styles.hiredevsec}>
            <Container>
                <h2 className={Styles.hdtilte}>
                    hire remote developers
                    <strong>facilities</strong>
                </h2>
                <div className={Styles.mainboxhiretable}>
                    {data.map((item, index) => (
                        <div key={index} className={Styles.singleboxhiretable}>
                            <h3 className={Styles.tablehireheading}>
                                {item.title}
                            </h3>
                            <div
                                dangerouslySetInnerHTML={{ __html: item.description || ''}}
                            />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Content
