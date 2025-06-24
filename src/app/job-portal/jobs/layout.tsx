import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "@/app/(main)/SessionProvider";
import TopNav from "@/components/jobportal/home/TopNav";
import NewsLetter from "@/components/jobportal/home/NewsLetter";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <TopNav />
      {children}
      <NewsLetter />
    </SessionProvider>
  );
}
