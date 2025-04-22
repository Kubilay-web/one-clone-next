import { Suspense } from "react";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import ItemListSkeleton from "./components/ItemListSkeleton";
import ItemDetailsSkeleton from "./components/ItemDetailSkeleton";
// import { getAuthenticatedUser } from "@/config/useAuth";
// import { InventoryItemList } from "./components/inventory-item-list";
// import { InventoryItemDetails } from "./components/inventory-item-details";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function InventoryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // const user = await getAuthenticatedUser();
  // if (!user?.orgId) {
  //   return <div>Not authenticated</div>;
  // }

  const search = (await searchParams).search || "";
  const selectedItemId = (await searchParams).itemId || "";

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">
          View and manage your inventory across all locations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <Suspense fallback={<ItemListSkeleton />}>
            {/* <InventoryItemList
              orgId={user.orgId}
              selectedItemId={selectedItemId as string}
            /> */}
          </Suspense>
        </div>

        <div>
          {selectedItemId ? (
            <Suspense fallback={<ItemDetailsSkeleton />}>
              {/* <InventoryItemDetails
                itemId={selectedItemId as string}
                orgId={user.orgId}
              /> */}
            </Suspense>
          ) : (
            <div className="rounded-lg border p-8 text-center">
              <h3 className="mb-2 text-lg font-medium">
                Select an item to view inventory details
              </h3>
              <p className="text-muted-foreground">
                Click on an item from the list to view its stock levels across
                all locations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
