import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/nav/candidatenav/CandidateNav";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user?.rolejob !== "ADMIN") redirect("/");

  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
}
