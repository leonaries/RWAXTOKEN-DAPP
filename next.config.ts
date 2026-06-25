import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /ox\/_esm\/tempo\/internal\/virtualMasterPool/,
        message: /Critical dependency/
      }
    ];

    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(@react-native-async-storage\/async-storage|pino-pretty)$/
      })
    );

    return config;
  }
};

export default nextConfig;
