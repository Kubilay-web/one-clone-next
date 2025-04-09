import { validateRequest } from "@/auth";
import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function SellerStoreDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
    return;
  }

  const stores = await prisma.store.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="flex h-full w-full">
      <Sidebar stores={stores} />
      <div className="ml-[300px] w-full">
        <Header />
        <div className="mt-[75px] w-full p-4">{children}</div>
      </div>
    </div>
  );
}
