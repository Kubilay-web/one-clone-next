import prisma from "@/lib/db"; // If you exported directly from db.ts
import StoreDetails from "@/components/dashboard/forms/store-details";

export default async function SellerStoreSettingsPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  // Log the params for debugging
  console.log("params", params);

  // Fetch store details based on storeUrl
  const storeDetails = await prisma.store.findUnique({
    where: { url: params.storeUrl },
  });

  if (!storeDetails) {
    return <div>No store found with this URL</div>;
  }

  return (
    <div>
      {/* Pass the fetched store details to the StoreDetails component */}
      <StoreDetails data={storeDetails} />
    </div>
  );
}
