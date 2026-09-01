import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  async redirects() {
    return [
      {
        source: "/grp-products",
        destination: "/products/category/frp-grp-products",
        permanent: true,
      },
      {
        source: "/steel-gratings",
        destination: "/products/category/steel-gratings",
        permanent: true,
      },
      {
        source: "/stainless-steel-products",
        destination: "/products/category/stainless-steel-products",
        permanent: true,
      },
      {
        source: "/aluminium",
        destination: "/products/category/aluminium",
        permanent: true,
      },
      {
        source: "/manhole",
        destination: "/products/category/manhole",
        permanent: true,
      },
      {
        source: "/ss-gi-grating-clamps",
        destination: "/products/category/ss-gi-grating-clamps",
        permanent: true,
      },
      {
        source: "/step-iron",
        destination: "/products/category/step-iron",
        permanent: true,
      },
      {
        source: "/stud-products",
        destination: "/products/category/stud-products",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/about",
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
