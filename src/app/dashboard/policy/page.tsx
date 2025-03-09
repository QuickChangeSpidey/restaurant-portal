"use client";

import { useRouter } from "next/navigation";

export default function PolicyPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-6">
            <h1 className="text-5xl font-extrabold mb-6 text-green-600">BOGO NINJA - Privacy Policy</h1>

            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>

                <p className="text-lg mb-6">
                    Welcome to BOGO Ninja! By signing up as a restaurant partner, you agree to this Privacy Policy, which describes how we collect, use, and protect your data. Your privacy is important to us, and we are committed to ensuring transparency and security in handling your information.
                </p>

                <h3 className="text-2xl font-semibold mt-6 mb-2">Information We Collect</h3>
                <ul className="list-disc pl-6 text-lg mb-6">
                    <li><strong>Account Information:</strong> Name, email address, phone number, and business address.</li>
                    <li><strong>Business Data:</strong> Restaurant name, location details, menu items, deals/coupons you create.</li>
                    <li><strong>User Interaction Data:</strong> Engagement analytics, deal/coupon performance, and customer redemption behavior.</li>
                    <li><strong>Technical Data:</strong> Device information, IP address, and browser type.</li>
                    <li><strong>Communication Data:</strong> Messages and responses exchanged between you and app users.</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-2">How We Use Your Data</h3>
                <ul className="list-disc pl-6 text-lg mb-6">
                    <li>Provide and manage your account on the BOGO Ninja platform.</li>
                    <li>Help you create and manage deals, discounts, and loyalty programs.</li>
                    <li>Analyze customer engagement and improve marketing strategies.</li>
                    <li>Deliver notifications via email, SMS, and push notifications.</li>
                    <li>Ensure platform security and compliance with legal obligations.</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-2">Data Sharing and Third Parties</h3>
                <ul className="list-disc pl-6 text-lg mb-6">
                    <li>We do not sell or rent your personal information.</li>
                    <li>We may share data with service providers such as payment processors, analytics providers, and marketing tools.</li>
                    <li>We may share information with legal authorities if required by law for fraud prevention, security, or regulatory compliance.</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-2">Data Retention</h3>
                <p className="text-lg mb-6">
                    We retain your data for as long as your account is active or as required by applicable law. You can request deletion of your data by contacting <a href="mailto:support@bogoninja.com" className="text-blue-600">support@bogoninja.com</a>.
                </p>

                <h3 className="text-2xl font-semibold mt-6 mb-2">Your Rights</h3>
                <ul className="list-disc pl-6 text-lg mb-6">
                    <li>Access, update, or delete your data.</li>
                    <li>Withdraw consent for marketing communications.</li>
                    <li>Request a copy of the data we hold about you.</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-2">Consent and Agreement</h3>
                <p className="text-lg mb-6">
                    By signing up and using the BOGO Ninja platform, you acknowledge and agree to this Privacy Policy. You must accept these terms before proceeding with your account.
                </p>
            </div>
        </div>
    );
}
