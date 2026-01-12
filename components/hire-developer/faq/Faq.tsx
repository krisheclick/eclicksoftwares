import { Accordion } from 'react-bootstrap';
import Styles from './style.module.css';

interface FaqItem {
    faq_title?: string;
    faq_description?: string;
}
interface Props {
    hasLoading?: boolean;
    data?: FaqItem[];
}
const Faq = ({hasLoading, data}: Props) => {
    return (
        <Accordion
            className={Styles.customAccordion}
            defaultActiveKey="0"
        >
            {data?.map((faq, index) => (
                <Accordion.Item
                    eventKey={String(index)}
                    key={index}
                    className={Styles.accordionItem}
                >
                    <Accordion.Header className={Styles.accHeader}>
                        <span className={Styles.icon} aria-hidden="true"></span>
                        <span className={Styles.faqhtilte}>
                            {faq.faq_title}
                        </span>
                    </Accordion.Header>

                    <Accordion.Body>
                        <div
                            className={Styles.faqbpara}
                            dangerouslySetInnerHTML={{ __html: faq.faq_description ?? '' }}
                        />
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    )
}

export default Faq;
