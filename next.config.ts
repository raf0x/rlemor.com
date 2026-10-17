import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/work/mypepprotocol",
        destination: "/projects/mypepprotocol",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
