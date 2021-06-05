const withAntdLess = require('next-plugin-antd-less');
const antvars = require('./antvars');
const withPlugins = require('next-compose-plugins');
const ipfsDomain = process.env.NEXT_PUBLIC_PINATA_DOMAIN;

const antdConfig = withAntdLess({
  modifyVars: antvars,

  reactStrictMode: true,
  poweredByHeader: false,

  webpack(config) {
    return config;
  }
});

const nextConfig = {
  images: {
    domains: [ipfsDomain, 'staging-flow-bucket.s3-us-west-1.amazonaws.com', 'i.picsum.photos']
  }
};

module.exports = withPlugins([[antdConfig]], nextConfig);
