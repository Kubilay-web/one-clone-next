import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

import SessionProvider from "./SessionProvider";
import Header from "@/components/store/layout/header/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div>
        <Header />
        <div>{children}</div>
      </div>
    </SessionProvider>
  );
}
