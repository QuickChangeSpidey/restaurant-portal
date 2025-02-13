import { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/auth/signin",
                destination: "https://bogoninja.com/auth/signin",
            },
            {
                source: "/api/auth/reset-password",
                destination: "https://bogoninja.com/auth/reset-password",
            },
            {
                source: "/api/auth/signup",
                destination: "https://bogoninja.com/auth/signup",
            },
            {
                source: "/api/auth/confirm-signup",
                destination: "https://bogoninja.com/auth/confirm-signup",
            },
        ];
    },
};

export default nextConfig;
