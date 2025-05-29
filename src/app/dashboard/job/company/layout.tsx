import { validateRequest } from "@/auth";
import CompanyNav from "@/components/nav/company/CompanyNav";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user?.rolejob !== "COMPANY") redirect("/");

  return (
    <div>
      <CompanyNav />

      {children}
    </div>
  );
}
