import Styles from './style.module.css';
import Form from './Form';

const Contact = () => {
    return (
        <div className={`stickyContent ${Styles.contentArea}`}>
            <div className={`section-content ${Styles.sectionContent ?? ''}`}>
                <h1 className="heading">Talk To Our Experts</h1>
                <p>Tell us about your inquiry and we’ll get back to you as soon as we can.</p>
            </div>
            <Form />
        </div>

    )
}

export default Contact
