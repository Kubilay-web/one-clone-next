import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import CandidateNav from "@/components/nav/candidatenav/CandidateNav";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user?.rolejob !== "CANDIDATE") redirect("/");

  return (
    <div>
      <CandidateNav />
      {children}
    </div>
  );
}
