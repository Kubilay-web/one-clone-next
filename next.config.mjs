/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30, // Dinamik içerikler için cache süresi
    },
  },
  serverExternalPackages: ["@node-rs/argon2"], // Dış bağımlılık
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // Görseller utfs.io üzerinden yüklenecek
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`, // Pathname'ı Uploadthing app ID'ye göre yapıyoruz
      },
    ],
    unoptimized: true,
  },
  rewrites: () => {
    return [
      {
        source: "/hashtag/:tag",
        destination: "/search?q=%23:tag", // Hashtag araması için yönlendirme
      },
      {
        // UFS.sh üzerinden gelen istekleri UTFS.io'ya yönlendirmek için yeniden yazma
        source: "/a/:appId/:imagePath*",
        destination: "https://utfs.io/a/:appId/:imagePath*", // Görsel yolu utfs.io domain'ine yönlendiriyoruz
      },
    ];
  },
};

export default nextConfig;
