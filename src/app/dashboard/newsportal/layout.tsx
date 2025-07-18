"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "react-hot-toast";
import { UserInfo } from "@/queries/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // İstemci tarafında kullanmak için useRouter'ı import et

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter(); // useRouter'ı buraya alıyoruz

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await UserInfo();
      setUser(userData);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.role === "WRITER") {
      router.push("/dashboard/newsportal/writer");
    } else if (user?.role === "ADMIN") {
      router.push("/dashboard/newsportal");
    }
  }, [user, router]); // user veya router değiştiğinde yönlendirme yap

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
