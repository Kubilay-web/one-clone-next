"use server";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import db from "@/lib/db";
import CheckoutContainer from "@/components/store/checkout-page/container";
import { getUserShippingAddresses } from "@/queries/user";
import Header from "@/components/store/layout/header/header";
import { cookies } from "next/headers";
import { Country } from "@prisma/client";

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

  const cookieStore = cookies();
  const userCountryCookie = cookieStore.get("userCountry");

  let userCountry: Country = {
    name: "United States",
    city: "",
    code: "US",
    region: "",
  };

  if (userCountryCookie) {
    userCountry = JSON.parse(userCountryCookie.value) as Country;
  }

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-65px)] bg-[#f4f4f4]">
        <div className="mx-auto max-w-container px-2 py-4">
          <CheckoutContainer
            cart={cart}
            countries={countries}
            addresses={addresses}
            userCountry={userCountry}
          />
        </div>
      </div>
    </>
  );
}
