/** @type {import('next').NextConfig} */

// Ortam değişkeni kontrolü
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
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${uploadthingAppId}/**`, // Yerel ortam için
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh", // Vercel'deki domain
        pathname: "/a/**", // Tüm alt yolları kapsar
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: "/hashtag/:tag",
        destination: "/search?q=%23:tag",
      },
    ];
  },
};

export default nextConfig;
