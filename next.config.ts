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
            {
                source: "/api/auth/verify",
                destination: "https://bogoninja.com/auth/verify",
            },
            {
                source: "/api/auth/logout",
                destination: "https://bogoninja.com/auth/logout",
            },
            {
                source: "/api/auth/confirm-reset-password",
                destination: "https://bogoninja.com/auth/confirm-reset-password",
            },
            {
                source: "/api/auth/reset-password",
                destination: "https://bogoninja.com/auth/reset-password",
            },
            {
                source: "/api/auth/verify-attribute",
                destination: "https://bogoninja.com/auth/verify-attribute",
            },
            {
                source: "/api/auth/confirm-phone-or-email",
                destination: "https://bogoninja.com/auth/confirm-phone-or-email",
            },
            {
                source: "/api/auth/getRestaurantLocations",
                destination: "http://localhost:5000/api/restaurant/locations",
            },
            {
                source: "/api/auth/AddLocations",
                destination: "http://localhost:5000/api/locations",
            },
            {
                source: "/api/auth/deletelocation/:id",
                destination: "http://localhost:5000/api/locations/:id",
            },
            {
                source: "/api/auth/location/:id",
                destination: "http://localhost:5000/api/locations/:id",
            },
            {
                source: "/api/auth/uploadLocationImage/:id",
                destination: "http://localhost:5000/api/upload/:id",
            },
        ];
    },
};

export default nextConfig;
