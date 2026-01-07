import { Container, Row, Col } from "react-bootstrap";
import styles from "./account.module.css";

const AccountDetails = () => {
    const accounts = [
        {
            currency: "AUD",
            bankName: "Wise Australia Pty Ltd",
            name: "Eclick Softwares and Solutions Pvt Ltd",
            bsbCode: "774001",
            bankAddress: "Suite 1, Level 11, 66 Goulburn Street, Sydney, NSW, 2000, Australia",
            accountNumber: "209986554",
            swift: "TRWIAUS1XXX"
        },
        {
            currency: "EUR",
            bankName: "Wise Europe SA",
            name: "Eclick Softwares and Solutions Pvt Ltd",
            iban: "BE18 9672 9084 1234",
            bic: "TRWIBEB1XXX"
        },
        {
            currency: "GBP",
            bankName: "Wise Payments Limited",
            name: "Eclick Softwares and Solutions Pvt Ltd",
            sortCode: "23-14-70",
            accountNumber: "12345678"
        },
        {
            currency: "USD",
            bankName: "Wise",
            name: "Eclick Softwares and Solutions Pvt Ltd",
            routingNumber: "084106768",
            accountNumber: "8310157968",
            accountType: "Checking"
        }
    ];

    return (
        <div className={styles.accountDetails}>
            <h2>Our Account Details</h2>
            {accounts.map((account, index) => (
                <div key={index} className={styles.accountSection}>
                    <h3>For {account.currency}</h3>
                    <div className={styles.details}>
                        <p><strong>Bank Name:</strong> {account.bankName}</p>
                        <p><strong>Name:</strong> {account.name}</p>
                        {account.bsbCode && <p><strong>BSB Code:</strong> {account.bsbCode}</p>}
                        {account.bankAddress && <p><strong>Bank Address:</strong> {account.bankAddress}</p>}
                        {account.accountNumber && <p><strong>Account Number:</strong> {account.accountNumber}</p>}
                        {account.swift && <p><strong>Swift/BIC:</strong> {account.swift}</p>}
                        {account.iban && <p><strong>IBAN:</strong> {account.iban}</p>}
                        {account.bic && <p><strong>BIC:</strong> {account.bic}</p>}
                        {account.sortCode && <p><strong>Sort Code:</strong> {account.sortCode}</p>}
                        {account.routingNumber && <p><strong>Routing Number:</strong> {account.routingNumber}</p>}
                        {account.accountType && <p><strong>Account Type:</strong> {account.accountType}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AccountDetails;