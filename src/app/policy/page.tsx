"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PolicyPage() {
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    const searchParams = useSearchParams();

    const email = searchParams.get("email") || "";

    const handleAcceptPolicy = () => {
        // Store policy acceptance status
        localStorage.setItem("policyAccepted", "true");

        // Redirect to Verify Page with email
        router.push(`/verify?email=${encodeURIComponent(email)}`);
    };

    const handleAccept = () => {
        if (checked) {
            // Store policy acceptance status
            localStorage.setItem("policyAccepted", "true");

            // Redirect to Verify Page with email
            router.push(`/verify?email=${encodeURIComponent(email)}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-500 text-white p-6">
            <h1 className="text-4xl font-bold mb-6">BOGO NINJA - Privacy Policy</h1>
            <div className="bg-white text-black p-8 rounded-lg shadow-lg w-96 max-h-[70vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
                <p className="text-sm mb-4">
                    Welcome to BOGO Ninja! By signing up as a restaurant partner, you agree to this Privacy Policy, which describes how we collect, use, and protect your data. Your privacy is important to us, and we are committed to ensuring transparency and security in handling your information.
                </p>
                <h3 className="text-lg font-bold">Information We Collect</h3>
                <ul className="text-sm list-disc pl-5 mb-4">
                    <li><strong>Account Information:</strong> Name, email address, phone number, and business address.</li>
                    <li><strong>Business Data:</strong> Restaurant name, location details, menu items, deals/coupons you create.</li>
                    <li><strong>User Interaction Data:</strong> Engagement analytics, deal/coupon performance, and customer redemption behavior.</li>
                    <li><strong>Technical Data:</strong> Device information, IP address, and browser type.</li>
                    <li><strong>Communication Data:</strong> Messages and responses exchanged between you and app users.</li>
                </ul>
                <h3 className="text-lg font-bold">How We Use Your Data</h3>
                <ul className="text-sm list-disc pl-5 mb-4">
                    <li>Provide and manage your account on the BOGO Ninja platform.</li>
                    <li>Help you create and manage deals, discounts, and loyalty programs.</li>
                    <li>Analyze customer engagement and improve marketing strategies.</li>
                    <li>Deliver notifications via email, SMS, and push notifications.</li>
                    <li>Ensure platform security and compliance with legal obligations.</li>
                </ul>
                <h3 className="text-lg font-bold">Data Sharing and Third Parties</h3>
                <ul className="text-sm list-disc pl-5 mb-4">
                    <li>We do not sell or rent your personal information.</li>
                    <li>We may share data with service providers such as payment processors, analytics providers, and marketing tools.</li>
                    <li>We may share information with legal authorities if required by law for fraud prevention, security, or regulatory compliance.</li>
                </ul>
                <h3 className="text-lg font-bold">Data Retention</h3>
                <p className="text-sm mb-4">We retain your data for as long as your account is active or as required by applicable law. You can request deletion of your data by contacting <a href="mailto:support@bogoninja.com" className="text-blue-500">support@bogoninja.com</a>.</p>
                <h3 className="text-lg font-bold">Your Rights</h3>
                <ul className="text-sm list-disc pl-5 mb-4">
                    <li>Access, update, or delete your data.</li>
                    <li>Withdraw consent for marketing communications.</li>
                    <li>Request a copy of the data we hold about you.</li>
                </ul>
                <h3 className="text-lg font-bold">Consent and Agreement</h3>
                <p className="text-sm mb-4">By signing up and using the BOGO Ninja platform, you acknowledge and agree to this Privacy Policy. You must accept these terms before proceeding with your account.</p>
                <div className="flex items-center mb-4">
                    <input type="checkbox" id="acceptPolicy" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="mr-2" />
                    <label htmlFor="acceptPolicy" className="text-sm">I have read and agree to the Privacy Policy.</label>
                </div>
                <button className="w-full p-2 bg-green-500 text-white rounded disabled:opacity-50" onClick={handleAccept} disabled={!checked}>
                    I Accept
                </button>
            </div>
        </div>
    );
}