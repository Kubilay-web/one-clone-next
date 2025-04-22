"use client";

// import { getDashboardOverview } from "@/actions/analytics";
import DashboardMain from "../../../../components/inventory/dashboard/DashboardMain";
import DefaultUserDashboard from "../../../../components/inventory/dashboard/DefaultUserDashboard";
import { Layers } from "lucide-react";
import { validateRequest } from "@/auth";

export default function Dashboard() {
  // const analytics = (await getDashboardOverview()) || [];
  // const { user } = await validateRequest();

  return (
    <main>
      <div className="space-y-6">
        <div className="mb-4 space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {/* Org Name: {user.username ?? ""} */}
          </h2>
          {/* <p className="text-sm text-muted-foreground">Org ID : {user.id}</p> */}
        </div>

        {/* <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {analytics.map((item, i) => (
            <OverViewCard item={item} key={i} />
          ))}
        </div> */}
      </div>
      <DashboardMain />
    </main>
  );
}
