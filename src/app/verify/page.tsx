"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function VerifyPage() {
    const router = useRouter();
    const [verificationCode, setVerificationCode] = useState("");
    const [isResending, setIsResending] = useState(false);
    const searchParams = useSearchParams();

    const email = searchParams.get("email") || "";

    const handleVerify = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!verificationCode) {
            alert("Please enter the verification code.");
            return;
        }

        try {
            const response = await fetch("/api/auth/confirm-signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, groupName: 'Restaurant', code: verificationCode }),
            });

            if (!response.ok) {
                const errorData: { message?: string } = await response.json();
                throw new Error(errorData.message || "Verification failed");
            }

            const data = await response.json();
            console.log("Verification successful:", data);

            alert("Verification successful! Please sign in again.");

            // Redirect to login page
            router.push("/auth");
        } catch (error) {
            console.error("Error verifying code:", error);
            alert((error as Error).message);
        }
    };

    const handleResend = async (): Promise<void> => {
        if (!email) {
            alert("Invalid email. Please try again.");
            return;
        }

        setIsResending(true);
        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData: { message?: string } = await response.json();
                throw new Error(errorData.message || "Failed to resend code");
            }

            alert("Verification code resent successfully!");
        } catch (error) {
            console.error("Error resending code:", error);
            alert((error as Error).message);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-500 text-white">
            <h1 className="text-4xl font-bold mb-6">BOGO NINJA</h1>
            <div className="bg-white text-black p-8 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-2xl font-bold mb-4">Verify Your Account</h2>
                <p className="mb-4">Enter the verification code sent to your email.</p>
                <form onSubmit={handleVerify}>
                    <input
                        type="number"
                        placeholder="Enter Verification Code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full p-2 mb-4 border rounded text-center"
                        required
                    />
                    <button className="w-full p-2 bg-green-500 text-white rounded" type="submit">
                        Verify
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Didn't receive the code?
                    <span
                        className={`text-blue-500 cursor-pointer ${isResending ? 'opacity-50' : ''}`}
                        onClick={isResending ? undefined : handleResend}
                    >
                        {isResending ? " Resending..." : " Resend"}
                    </span>
                </p>
            </div>
        </div>
    );
}

const Loading = () => <div>Loading...</div>;

// VerifyPage wrapped with Suspense boundary
export default function VerifyPageWrapper() {
    return (
        <Suspense fallback={<Loading />}>
            <VerifyPage />
        </Suspense>
    );
}
