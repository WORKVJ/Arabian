import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/portal",
        destination: "/admin",
      },
    ];
  },
  async redirects() {
    return [
      // Old category and product URLs indexed in Google
      {
        source: "/product",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/grp-manhole-covers",
        destination: "/products/grp-frp-manhole-covers",
        permanent: true,
      },
      {
        source: "/frp-manhole-covers",
        destination: "/products/grp-frp-manhole-covers",
        permanent: true,
      },
      {
        source: "/manhole-covers",
        destination: "/products/manhole",
        permanent: true,
      },
      {
        source: "/products/gratings",
        destination: "/products/steel-gratings",
        permanent: true,
      },
      {
        source: "/products/ss-gratings",
        destination: "/products/stainless-steel-products",
        permanent: true,
      },
      {
        source: "/products/category/gratings",
        destination: "/products/steel-gratings",
        permanent: true,
      },
      {
        source: "/products/category/ss-gratings",
        destination: "/products/stainless-steel-products",
        permanent: true,
      },
      {
        source: "/products/category/grp-products",
        destination: "/products/frp-grp-products",
        permanent: true,
      },
      {
        source: "/products/category/:slug",
        destination: "/products/:slug",
        permanent: true,
      },
      {
        source: "/product-category/:slug",
        destination: "/products/:slug",
        permanent: true,
      },
      {
        source: "/category/:slug",
        destination: "/products/:slug",
        permanent: true,
      },
      {
        source: "/product/:slug",
        destination: "/products/:slug",
        permanent: true,
      },
      {
        source: "/gratings",
        destination: "/products/steel-gratings",
        permanent: true,
      },
      {
        source: "/ss-gratings",
        destination: "/products/stainless-steel-products",
        permanent: true,
      },
      {
        source: "/grp-products",
        destination: "/products/frp-grp-products",
        permanent: true,
      },
      {
        source: "/steel-gratings",
        destination: "/products/steel-gratings",
        permanent: true,
      },
      {
        source: "/stainless-steel-products",
        destination: "/products/stainless-steel-products",
        permanent: true,
      },
      {
        source: "/aluminium",
        destination: "/products/aluminium",
        permanent: true,
      },
      {
        source: "/manhole",
        destination: "/products/manhole",
        permanent: true,
      },
      {
        source: "/ss-gi-grating-clamps",
        destination: "/products/ss-gi-grating-clamps",
        permanent: true,
      },
      {
        source: "/step-iron",
        destination: "/products/step-iron",
        permanent: true,
      },
      {
        source: "/stud-products",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/about/company",
        destination: "/about#company",
        permanent: true,
      },
      {
        source: "/about/manufacturing",
        destination: "/about#manufacturing",
        permanent: true,
      },
      {
        source: "/about/quality",
        destination: "/about#quality",
        permanent: true,
      },
      {
        source: "/about/certifications",
        destination: "/about#certifications",
        permanent: true,
      },
      {
        source: "/service",
        destination: "/services",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
