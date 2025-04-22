import Navbar from "../../../components/inventory/dashboard/Navbar";
import Sidebar from "../../../components/inventory/dashboard/Sidebar";
import type { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full">
      {/* <Sidebar session={undefined} /> */}
      <div className="md:ml-[220px] lg:ml-[280px]">
        {/* <Navbar session={undefined} /> */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
