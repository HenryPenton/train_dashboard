import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/departures/:station/:tiploc",
        destination:
          "http://train_dashboard_api:8000/departures/:station/:tiploc",
      },
      {
        source: "/tfl/line-status",
        destination: "http://train_dashboard_api:8000/tfl/line-status",
      },
    ];
  },
};

export default nextConfig;
