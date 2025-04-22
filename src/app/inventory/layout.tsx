import { validateRequest } from "@/auth";
import Footer from "../../components/inventory/frontend/footer";
import SiteHeader from "../../components/inventory/frontend/site-header";
// import { authOptions } from "@/config/auth";
// import { getServerSession } from "next-auth";
import React, { ReactNode } from "react";
export default async function HomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  // const session = await getServerSession(authOptions);

  const session = await validateRequest();
  return (
    <div className="bg-white">
      {/* <PromoBanner /> */}
      <SiteHeader session={undefined} />
      {children}
      <Footer />
    </div>
  );
}
