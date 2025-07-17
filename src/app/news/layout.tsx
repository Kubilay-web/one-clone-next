import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "@/app/(main)/SessionProvider";
import Header from "@/components/newsportal/Header";
import Footer from "@/components/newsportal/Footer";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div>
        <Header />
        {children}
        <Footer />
      </div>
    </SessionProvider>
  );
}
