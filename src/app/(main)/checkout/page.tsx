"use server";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import db from "@/lib/db";
import CheckoutContainer from "@/components/store/checkout-page/container";
import { getUserShippingAddresses } from "@/queries/user";
import Header from "@/components/store/layout/header/header";

export default async function CheckoutPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/cart");

  const cart = await db.cart.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      cartItems: true,
    },
  });

  if (!cart) redirect("/cart");

  const addresses = await getUserShippingAddresses();

  const countries = await db.country.findMany({
    orderBy: { name: "desc" },
  });
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-65px)] bg-[#f4f4f4]">
        <div className="mx-auto max-w-container px-2 py-4">
          <CheckoutContainer
            cart={cart}
            countries={countries}
            addresses={addresses}
          />
        </div>
      </div>
    </>
  );
}
