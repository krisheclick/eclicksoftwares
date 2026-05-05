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
                <div className={`section-content max-content text-center ${Styles.section_content ?? ''}`}>

                    {!hasLoading ? (
                        <h2 className={Styles.hdtilte}>
                            hire remote developers
                            <strong>facilities</strong>
                        </h2>
                    ) : (
                        <>
                            <div className={`skeleton mb-2 w-75 ${Styles.hdtilte}`}>&nbsp;</div>
                            <div className={Styles.hdtilte}>
                                <strong className="skeleton w-50">&nbsp;</strong>
                            </div>
                        </>
                    )}
                </div>
                <div className={Styles.mainboxhiretableResponsive}>
                    <div className={Styles.mainboxhiretable}>
                        {!hasLoading ? (
                            data.map((item, index) => (
                                <div key={index} className={Styles.singleboxhiretable}>
                                    <h3 className={Styles.tablehireheading}>
                                        {item.title}
                                    </h3>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: item.description || '' }}
                                    />
                                </div>
                            ))
                        ) : (
                            [...Array(4)].map((_, index) => (
                                <div key={index} className={Styles.singleboxhiretable}>
                                    <h3 className={Styles.tablehireheading}>
                                        <div className="skeleton w-75">&nbsp;</div>
                                    </h3>
                                    <ul>
                                        {[...Array(7)].map((_, subindex) => (
                                            <li key={subindex}>
                                                <div className="skeleton w-50 skeletonText mx-auto"></div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Content
