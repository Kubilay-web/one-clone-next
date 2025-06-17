import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import CandidateNav from "@/components/jobportal/nav/candidatenav/CandidateNav";
import TopNav from "@/components/jobportal/nav/TopNav";
import { Toaster } from "react-hot-toast";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user?.rolejob !== "CANDIDATE") redirect("/");

  return (
    <div>
      <TopNav />
      <CandidateNav />
      <Toaster position="top-center" />
      {children}
    </div>
  );
}
