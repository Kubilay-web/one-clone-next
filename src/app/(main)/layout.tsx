import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

import SessionProvider from "./SessionProvider";
import Header from "@/components/store/layout/header/header";
import CategoriesHeader from "@/components/store/layout/categories-header/categories-header";
import Footer from "@/components/store/layout/footer/footer";

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
        <CategoriesHeader />
        <div>{children}</div>
        <div className="h-96"></div>
        <Footer />
      </div>
    </SessionProvider>
  );
}
