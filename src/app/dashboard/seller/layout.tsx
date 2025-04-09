import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

export default async function SellerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await validateRequest();

  if (user?.role !== "SELLER") redirect("/");
  return <div>{children}</div>;
}
