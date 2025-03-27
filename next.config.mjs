/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
      },
    ],
    unoptimized: true, // Unoptimized for images
  },
  rewrites: () => {
    return [
      {
        source: "/hashtag/:tag",
        destination: "/search?q=%23:tag",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/a/:appId/:slug*",
        destination: "https://utfs.io/a/:appId/:slug*", // redirect to the new clean URL
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
