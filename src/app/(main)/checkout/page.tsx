"use server";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import db from "@/lib/db";
import CheckoutContainer from "@/components/store/checkout-page/container";
import { getUserShippingAddresses } from "@/queries/user";

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
    <div className="min-h-screen bg-[#f4f4f4]">
      <div className="max-w-container mx-auto px-2 py-5">
        <CheckoutContainer
          cart={cart}
          countries={countries}
          addresses={addresses}
        />
      </div>
    </div>
  );
}
