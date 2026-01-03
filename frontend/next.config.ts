import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suprimir warnings de hidratación causados por extensiones del navegador
  reactStrictMode: true,
};

export default nextConfig;
