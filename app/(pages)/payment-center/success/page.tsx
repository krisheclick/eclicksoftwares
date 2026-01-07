// app/success/page.tsx (or pages/success.tsx)
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
    const router = useRouter();

    useEffect(() => {
        const isSuccess = sessionStorage.getItem("paymentSuccess");
        if (!isSuccess) {
            // redirect to home if accessed directly
            router.replace("/");
        } else {
            // remove the flag so refresh will redirect next time
            sessionStorage.removeItem("paymentSuccess");
        }
    }, [router]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Payment Successful!</h1>
            <p>Thank you for your payment. Your transaction has been processed.</p>
        </div>
    );
}
