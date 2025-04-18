"use client";

import { validateRequest } from "@/auth";
import { MessageIcon, OrderIcon, WishlistIcon } from "@/components/store/icons";
import { Button } from "@/components/store/ui/button";
import { Separator } from "@/components/ui/separator";
import UserButton from "@/components/UserButton";
import { cn } from "@/lib/utils";
import { ChevronDown, LogOutIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query"; // Burada doğru import
import Link from "next/link";
import { logout } from "@/app/(auth)/actions";
import { useSession } from "@/app/(main)/SessionProvider";

export default function UserMenu() {
  // Get the current user
  const { user } = useSession();
  const queryClient = useQueryClient(); // Burada useQueryClient doğru şekilde kullanılıyor

  return (
    <div className="group relative px-2">
      {/* Trigger */}
      <div>
        {user ? (
          <Image
            src={user.avatarUrl}
            alt={user.username}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="mx-2 flex h-11 cursor-pointer items-center py-0">
            <span className="text-2xl">
              <UserIcon />
            </span>
            <div className="ml-1">
              <span className="block text-xs leading-3 text-white">
                Welcome
              </span>
              <b className="text-xs font-bold leading-4 text-white">
                <span>Sign in / Register</span>
                <span className="inline-block scale-[60%] align-middle text-white">
                  <ChevronDown />
                </span>
              </b>
            </div>
          </div>
        )}
      </div>
      {/* Content */}
      <div
        className={cn(
          "absolute -left-20 top-0 hidden cursor-pointer group-hover:block",
          {
            "-left-[200px] lg:-left-[138px]": user,
          },
        )}
      >
        <div className="relative bottom-auto left-2 right-auto z-40 mt-10 p-0 pt-2.5 text-sm text-[#222]">
          {/* Triangle */}
          <div className="absolute left-[149px] right-24 top-1 h-0 w-0 !border-b-[10px] !border-l-[10px] !border-r-[10px] !border-l-transparent !border-r-transparent border-b-white"></div>
          {/* Menu */}
          <div className="rounded-3xl bg-white text-sm text-[#222] shadow-lg">
            <div className="w-[305px]">
              <div className="px-6 pb-0 pt-5">
                {user ? (
                  <div className="user-avatar flex flex-col items-center justify-center">
                    <Image
                      src={user.avatarUrl}
                      alt={user.username}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link href="/sign-in">
                      <Button>Sign in</Button>
                    </Link>
                    <Link
                      href="/sign-up"
                      className="text-main-primary flex h-10 cursor-pointer items-center justify-center text-sm hover:underline"
                    >
                      Register
                    </Link>
                  </div>
                )}
                {user && (
                  <p className="text-main-primary my-3 cursor-pointer text-center text-sm">
                    <Button
                      onClick={() => {
                        queryClient.clear();
                        logout();
                      }}
                    >
                      Sign Out
                    </Button>
                  </p>
                )}
                <Separator />
              </div>
              {/* Links */}
              <div className="text-main-secondary max-w-[calc(100vh-180px)] overflow-y-auto overflow-x-hidden px-2 pb-4 pt-0">
                <ul className="^px-4 grid w-full grid-cols-3 gap-2 py-2.5">
                  {links.map((item) => (
                    <li key={item.title} className="grid place-items-center">
                      <Link href={item.link} className="space-y-2">
                        <div className="grid h-14 w-14 place-items-center rounded-full bg-gray-100 p-2 hover:bg-gray-200">
                          <span className="text-gray-500">{item.icon}</span>
                        </div>
                        <span className="block text-xs">{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Separator className="mx-auto !max-w-[257px]" />
                <ul className="w-[288px] pb-1 pl-4 pr-4 pt-2.5">
                  {extraLinks.map((item, i) => (
                    <li key={i}>
                      <Link href={item.link} legacyBehavior>
                        <a className="text-main-primary block py-1.5 text-sm hover:underline">
                          {item.title}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const links = [
  {
    icon: <OrderIcon />,
    title: "My Orders",
    link: "/profile/orders",
  },
  {
    icon: <MessageIcon />,
    title: "Messages",
    link: "/profile/messages",
  },
  {
    icon: <WishlistIcon />,
    title: "WishList",
    link: "/profile/wishlist",
  },
];
const extraLinks = [
  {
    title: "Profile",
    link: "/profile",
  },
  {
    title: "Settings",
    link: "/",
  },
  {
    title: "Become a Seller",
    link: "/become-seller",
  },
  {
    title: "Help Center",
    link: "",
  },
  {
    title: "Return & Refund Policy",
    link: "/",
  },
  {
    title: "Legal & Privacy",
    link: "",
  },
  {
    title: "Discounts & Offers",
    link: "",
  },
  {
    title: "Order Dispute Resolution",
    link: "",
  },
  {
    title: "Report a Problem",
    link: "",
  },
];
