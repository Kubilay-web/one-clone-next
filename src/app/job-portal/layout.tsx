import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import "./style.css";
import SessionProvider from "@/app/(main)/SessionProvider";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import NewsLetter from "@/components/jobportal/home/NewsLetter";
import Footer from "@/components/jobportal/home/Footer";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      {children}
      <NewsLetter />
      <Footer />
    </SessionProvider>
  );
}
