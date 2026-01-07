import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Styles from './style.module.css';
import { faCreditCard, faMoneyBill, faUniversity, faWallet } from '@fortawesome/free-solid-svg-icons';

const PaymentInformation = () => {
    const accounts = [
        {
            currency: "AUD",
            bankName: "Wise Australia Pty Ltd",
            name: "Eclick Softwares and Solutions Pvt Ltd",
            bsbCode: "774001",
            accountNumber: "209986554",
            swift: "TRWIAUS1XXX",
            icon: faUniversity
        },
        {
            currency: "EUR",
            bankName: "Wise Europe SA",
            name: "Eclick Softwares and Solutions Pvt Ltd",
            iban: "BE18 9672 9084 1234",
            bic: "TRWIBEB1XXX",
            icon: faCreditCard
        },
        {
            currency: "GBP",
            bankName: "Wise Payments Limited",
            name: "Eclick Softwares and Solutions Pvt Ltd",
            sortCode: "23-14-70",
            accountNumber: "12345678",
            icon: faMoneyBill
        },
        {
            currency: "USD",
            bankName: "Wise",
            name: "Eclick Softwares and Solutions Pvt Ltd",
            routingNumber: "084106768",
            accountNumber: "8310157968",
            accountType: "Checking",
            icon: faWallet
        }
    ];

    return (
        <div className={Styles.information}>
            <div className="stickyContent">
                <div className={Styles.informationContent}>
                    <ul className="noList">
                        {accounts.map((account, index) => (
                            <li key={index}>
                                <span className={Styles.icon}><FontAwesomeIcon icon={account.icon} /></span>
                                <div className={Styles.subtitle}>Payment in {account.currency}</div>
                                <div className={Styles.accountInfo}>
                                    <p><strong>Bank:</strong> {account.bankName}</p>
                                    <p><strong>Account:</strong> {account.accountNumber}</p>
                                    {account.bsbCode && <p><strong>BSB:</strong> {account.bsbCode}</p>}
                                    {account.sortCode && <p><strong>Sort Code:</strong> {account.sortCode}</p>}
                                    {account.routingNumber && <p><strong>Routing:</strong> {account.routingNumber}</p>}
                                    {account.swift && <p><strong>SWIFT:</strong> {account.swift}</p>}
                                    {account.bic && <p><strong>BIC:</strong> {account.bic}</p>}
                                    {account.iban && <p><strong>IBAN:</strong> {account.iban}</p>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={Styles.videoSection}>
                    <div className={Styles.subtitle}>Secure Payment Processing</div>
                    <p>Your payments are processed securely through our trusted payment partners. All transactions are encrypted and protected.</p>
                </div>
            </div>
        </div>
    )
}

export default PaymentInformation