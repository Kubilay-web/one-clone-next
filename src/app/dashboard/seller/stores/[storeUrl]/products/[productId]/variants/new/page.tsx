import ProductDetails from "@/components/dashboard/forms/product-details";
import db from "@/lib/db";
import { getAllCategories } from "@/queries/category";
import { getAllOfferTags } from "@/queries/offer-tag";
import { getProductMainInfo } from "@/queries/product";
import React from "react";

export default async function SellerNewProductVariantPage({
  params,
}: {
  params: { storeUrl: string; productId: string };
}) {
  const categories = await getAllCategories(params.storeUrl);
  console.log("categpries--->",categories)
  const offerTags = await getAllOfferTags();
  const product = await getProductMainInfo(params.productId);
  if (!product) return null;

  const countries = await db.country.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <ProductDetails
        categories={categories}
        storeUrl={params.storeUrl}
        data={product}
        offerTags={offerTags}
        countries={countries}
      />
    </div>
  );
}
