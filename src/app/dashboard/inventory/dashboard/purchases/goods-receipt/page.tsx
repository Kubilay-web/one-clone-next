import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
// import { getAuthenticatedUser } from "@/config/useAuth";
// import GoodsReceiptList from "./components/GoodsReceiptList";
import GoodsReceiptListSkeleton from "./components/LoadingSkeleton";
import { validateRequest } from "@/auth";

export default async function GoodsReceiptsPage() {
  const user = await validateRequest();
  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Goods Receipts</h1>
        <Link href="/dashboard/purchases/purchase-orders">
          <Button>View Purchase Orders</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-[350px_1fr]">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search receipt number or supplier"
              className="pl-8"
            />
          </div>

          {/* <Suspense fallback={<GoodsReceiptListSkeleton />}>
            <GoodsReceiptList orgId={user.orgId} />
          </Suspense> */}
        </div>

        <div className="rounded-lg border shadow-sm">
          <div className="p-6 text-center text-muted-foreground">
            Select a goods receipt to view details
          </div>
        </div>
      </div>
    </div>
  );
}
