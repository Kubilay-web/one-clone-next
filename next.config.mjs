/** @type {import('next').NextConfig} */
const uploadthingAppId = process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID;

if (!uploadthingAppId) {
  throw new Error(
    "NEXT_PUBLIC_UPLOADTHING_APP_ID environment variable is not defined",
  );
}

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
        pathname: `/a/${uploadthingAppId}/*`, // burası artık sabit string
      },
    ],
  },
  rewrites: () => {
    return [
      {
        source: "/hashtag/:tag",
        destination: "/search?q=%23:tag",
      },
    ];
  },
};

export default nextConfig;
