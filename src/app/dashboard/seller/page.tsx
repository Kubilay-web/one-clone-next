import React from "react";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function SellerDashboardPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const stores = await prisma.store.findMany({
    where: {
      userId: user.id,
    },
  });

  if (stores.length === 0) {
    redirect("/dashboard/seller/stores/new");
    return;
  }

  redirect(`/dashboard/seller/stores/${stores[0].url}`);

  return <div>SellerPage</div>;
}
