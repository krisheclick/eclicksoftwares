"use client";

import { Modal, Button, Table } from "react-bootstrap";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

interface Props {
    show: boolean;
    onClose: () => void;
    formData: any;
}

const PaymentCenterModal = ({ show, onClose, formData }: Props) => {
    const router = useRouter();
    if (!show) return null;

    return (
        <PayPalScriptProvider
            options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                currency: formData.currency,
                intent: "capture",
            }}
        >
            <Modal show={show} onHide={onClose} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Payment</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h5 className="mb-3">Billing Details</h5>
                    <Table bordered responsive>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <td>{formData.name}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>{formData.email}</td>
                            </tr>
                            <tr>
                                <th>Phone</th>
                                <td>{formData.phone_number}</td>
                            </tr>
                            <tr>
                                <th>Country</th>
                                <td>{formData.country}</td>
                            </tr>
                            <tr>
                                <th>Project Name</th>
                                <td>{formData.project_name}</td>
                            </tr>
                            <tr>
                                <th>Payment For</th>
                                <td>{formData.paymentFor}</td>
                            </tr>
                        </tbody>
                    </Table>
                    {/* Order Summary */}
                    {/* <div className="mb-3">
                        <p><strong>Name:</strong> {formData.name}</p>
                        <p><strong>Payment For:</strong> {formData.paymentFor}</p>
                        <p><strong>Project:</strong> {formData.project_name}</p>
                    </div> */}
                    <div className="border p-3 mb-4 bg-light">
                        <h5>Payable Amount</h5>
                        <p className="mb-1">
                            <strong>Amount:</strong> {formData.amount} {formData.currency}
                        </p>
                        <p className="mb-0">
                            <strong>Payment Method:</strong> PayPal
                        </p>
                    </div>

                    {/* PayPal Inline */}
                    <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={(data, actions) =>
                            actions.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            value: formData.amount,
                                            currency_code: formData.currency,
                                        },
                                    },
                                ],
                                payer: {
                                    name: {
                                        given_name: formData.first_name || formData.name.split(" ")[0],
                                        surname: formData.last_name || formData.name.split(" ")[1] || "",
                                    },
                                    email_address: formData.email,
                                    phone: {
                                        phone_number: {
                                            national_number: formData.phone_number.replace(/\D/g, ""), // digits only
                                            country_code: formData.country_code || "91",
                                        },
                                    },
                                    address: {
                                        address_line_1: formData.address || "",
                                        admin_area_2: formData.city || "",
                                        admin_area_1: formData.state || "",
                                        postal_code: formData.postal_code || "",
                                        country_code: formData.country_code || "US",
                                    },
                                },
                            })
                        }
                        onApprove={async (data, actions) => {
                            try {
                                if (!actions.order) return;
                                const details = await actions.order.capture();
                                const payload = {
                                    order_id:formData.order_id,
                                    capture_details: details,
                                    payment_status:details.status,
                                };
                                const res = await fetch(
                                    `${process.env.NEXT_PUBLIC_API_URL}payment/charge/complete`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Accept: "application/json",
                                        },
                                        body: JSON.stringify(payload),
                                    }
                                );

                                if (!res.ok) throw new Error("API failed");

                                const apiResponse = await res.json();
                                onClose();
                                if(details.status == 'COMPLETED'){
                                    sessionStorage.setItem("paymentSuccess", "true");
                                    router.push("/payment-center/success");
                                }else{
                                    router.push("/payment-center/failed");
                                }
                            } catch (captureError) {
                                await fetch(`${process.env.NEXT_PUBLIC_API_URL}payment/charge/failed`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        order_id: formData.order_id,
                                        payment_status: "FAILED",
                                        capture_details: captureError,
                                    }),
                                });
                                console.error("Payment capture error", captureError);
                                onClose();
                                alert("Payment succeeded but confirmation failed. Contact support.");
                                router.push("/payment-center/failed");
                            }
                        }}
                        onCancel={async (data) => {
                            try {
                                await fetch(
                                    `${process.env.NEXT_PUBLIC_API_URL}payment/charge/failed`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Accept: "application/json",
                                        },
                                        body: JSON.stringify({
                                            order_id: formData.order_id,
                                            payment_status: "CANCELLED",
                                            capture_details: {
                                                event: "CANCELLED",
                                                paypal_order_id: data?.orderID || null,
                                                reason: "User cancelled PayPal checkout",
                                                timestamp: new Date().toISOString(),
                                            },
                                        }),
                                    }
                                );
                            } catch (err) {
                                console.error(err);
                            }

                            onClose();
                            router.push("/payment-center/cancel");
                        }}
                        onError={async (err) => {
                            console.error(err);
                            try {
                                await fetch(`${process.env.NEXT_PUBLIC_API_URL}payment/charge/failed`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        order_id: formData.order_id,
                                        payment_status: "FAILED",
                                        capture_details: err,
                                    }),
                                });
                            } catch (err) {
                                console.error(err);
                            }
                            onClose();
                            router.push("/payment-center/failed");
                        }}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </PayPalScriptProvider>
    );
};

export default PaymentCenterModal;
