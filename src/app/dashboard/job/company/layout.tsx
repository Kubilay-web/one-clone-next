import { validateRequest } from "@/auth";
import CompanyNav from "@/components/jobportal/nav/company/CompanyNav";
import TopNav from "@/components/jobportal/nav/TopNav";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user?.rolejob !== "COMPANY") redirect("/");

  return (
    <div>
      <TopNav />
      <CompanyNav />
      <Toaster position="top-center" />
      {children}
    </div>
  );
}
