import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
    allowedDevOrigins: ['http://localhost:3000','10.243.165.43:3000'],
    // allowedDevOrigins: ["*"],


  /* config options here */
};

export default nextConfig;
