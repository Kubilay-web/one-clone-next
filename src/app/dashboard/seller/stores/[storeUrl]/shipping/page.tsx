import StoreDefaultShippingDetails from "@/components/dashboard/forms/store-default-shipping-details";
import DataTable from "@/components/ui/data-table";
import {
  getStoreDefaultShippingDetails,
  getStoreShippingRates,
} from "@/queries/store";
import { redirect } from "next/navigation";
import React from "react";
import { columns } from "./columns";

export default async function SellerStoreShippingPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  const shippingDetails = await getStoreDefaultShippingDetails(params.storeUrl);
  if (!shippingDetails) return redirect("/");
  const shippingRates = await getStoreShippingRates(params.storeUrl);
  console.log(shippingRates);
  return (
    <div>
      <StoreDefaultShippingDetails
        data={shippingDetails}
        storeUrl={params.storeUrl}
      />
      <DataTable
        filterValue="countryName"
        data={shippingRates}
        columns={columns}
        searchPlaceholder="Search by country name.."
      />
    </div>
  );
}
