import Styles from './style.module.css';
import PaymentForm from './PaymentForm';

const PaymentContact = () => {
    return (
        <>
            <div className={`section-content ${Styles.sectionContent ?? ''}`}>
                <h1 className="heading">Payment Center</h1>
                <p>Submit your payment details and we&apos;ll process your request securely.</p>
            </div>
            <PaymentForm />
        </>
    )
}

export default PaymentContact