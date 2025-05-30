import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

import SessionProvider from "./SessionProvider";
import Header from "@/components/store/layout/header/header";
import CategoriesHeader from "@/components/store/layout/categories-header/categories-header";
import Footer from "@/components/store/layout/footer/footer";
import { Toaster } from "react-hot-toast";

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
        <div>{children}</div>
        <Footer />
        <Toaster position="top-center" />
      </div>
    </SessionProvider>
  );
}
