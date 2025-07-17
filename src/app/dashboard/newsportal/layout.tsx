import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "@/app/(main)/SessionProvider";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "react-hot-toast";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (!user) redirect("/login");

  return (
    <div className="min-w-screen min-h-screen bg-slate-400">
      <Sidebar user={user} />
      <div className="ml-[250px] min-h-[100vh] w-[calc(100vw-268px)]">
        <Header />
        <div className="p-4">
          <div className="pt-[85px]">{children}</div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
