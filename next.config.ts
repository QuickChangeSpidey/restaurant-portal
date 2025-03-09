import { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/auth/signin",
                destination: "http://api.bogoninja.com/auth/signin",
            },
            {
                source: "/api/auth/reset-password",
                destination: "http://api.bogoninja.com/auth/reset-password",
            },
            {
                source: "/api/auth/signup",
                destination: "http://api.bogoninja.com/auth/signup",
            },
            {
                source: "/api/auth/confirm-signup",
                destination: "http://api.bogoninja.com/auth/confirm-signup",
            },
            {
                source: "/api/auth/verify",
                destination: "http://api.bogoninja.com/auth/verify",
            },
            {
                source: "/api/auth/logout",
                destination: "http://api.bogoninja.com/auth/logout",
            },
            {
                source: "/api/auth/confirm-reset-password",
                destination: "http://api.bogoninja.com/auth/confirm-reset-password",
            },
            {
                source: "/api/auth/verify-attribute",
                destination: "http://api.bogoninja.com/auth/verify-attribute",
            },
            {
                source: "/api/auth/confirm-phone-or-email",
                destination: "http://api.bogoninja.com/auth/confirm-phone-or-email",
            },
            {
                source: "/api/auth/getRestaurantLocations",
                destination: "http://api.bogoninja.com/api/restaurant/locations",
            },
            {
                source: "/api/auth/AddLocations",
                destination: "http://api.bogoninja.com/api/locations",
            },
            {
                source: "/api/auth/deletelocation/:id",
                destination: "http://api.bogoninja.com/api/locations/:id",
            },
            {
                source: "/api/auth/location/:id",
                destination: "http://api.bogoninja.com/api/locations/:id",
            },
            {
                source: "/api/auth/location/:id/upload",
                destination: "http://api.bogoninja.com/api/location/:id/upload",
            },
            {
                source: "/api/auth/menu-item/:id/upload",
                destination: "http://api.bogoninja.com/api/menu-item/:id/upload",
            },
            {
                source: "/api/auth/coupon/:id/upload",
                destination: "http://api.bogoninja.com/api/coupon/:id/upload",
            },
            {
                source: "/api/auth/addMenuItem",
                destination: "http://api.bogoninja.com/api/menu-items",
            },
            {
                source: "/api/auth/locations/:locationId/menu-items",
                destination: "http://api.bogoninja.com/api/locations/:locationId/menu-items",
            },
            {
                source: "/api/auth/menuItems/:id",
                destination: "http://api.bogoninja.com/api/menu-items/:id",
            },
            {
                source: "/api/auth/coupons/:id",
                destination: "http://api.bogoninja.com/api/coupons/:id",
            },
            {
                source: "/api/auth/coupons",
                destination: "http://api.bogoninja.com/api/coupons",
            },
            {
                source: "/api/auth/coupons/:id/activate",
                destination: "http://api.bogoninja.com/api/coupons/:id/activate",
            },
            {
                source: "/api/auth/coupons/:id/deactivate",
                destination: "http://api.bogoninja.com/api/coupons/:id/deactivate",
            },
        ];
    },
};

export default nextConfig;
