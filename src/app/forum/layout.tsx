import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css"; // stackoverflow → app → globals.css
import { redirect } from "next/navigation";
import SessionProvider from "../(main)/SessionProvider";
import { validateRequest } from "@/auth";
import Navbar from "@/components/stackoverflow/navigation/navbar/page";
import { ThemeProvider } from "next-themes";
import LeftSidebar from "@/components/stackoverflow/LeftSidebar";
import RightSidebar from "@/components/stackoverflow/RightSidebar";

const inter = localFont({
  src: "../fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 600 700 800 900",
});

const grotesk = localFont({
  src: "../fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "300 400 500 600 700",
});

export const metadata: Metadata = {
  title: {
    template: "StackOverFlow",
    default: "StackOverFlow",
  },
  description: "StackOverFlow Project",
  icons: "/assets/stackoverflow/images/site-logo.svg",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <div className={`${grotesk.variable} ${inter.className} antialiased`}>
      <div>
        <SessionProvider value={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="background-light850_dark100 relative">
              <Navbar />
              <div className="flex">
                <LeftSidebar />

                <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
                  <div className="mx-auto w-full max-w-5xl">{children}</div>
                </section>
                <RightSidebar />
                <Toaster position="top-right" />
              </div>
            </main>
          </ThemeProvider>
        </SessionProvider>
      </div>
    </div>
  );
}
