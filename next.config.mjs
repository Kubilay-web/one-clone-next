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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${uploadthingAppId}/**`,
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh",
        pathname: "/a/**",
      },
    ],
    // Tüm yaygın device ve image boyutları
    deviceSizes: [
      320, 375, 414, 480, 640, 768, 828, 1024, 1080, 1200, 1280, 1366, 1440,
      1536, 1600, 1920, 2048, 2560, 3840,
    ],
    imageSizes: [
      16, 24, 32, 48, 64, 96, 128, 256, 384, 512, 640, 768, 1024, 1280, 1600,
      1920, 2048, 2560, 3840,
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
