"use client";

import React from "react";
import { DashboardSidebarMenuInterface } from "@/lib/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { icons } from "@/constants/icons";
import { usePathname } from "next/navigation";

export default function SidebarNavSeller({
  menuLinks,
}: {
  menuLinks: DashboardSidebarMenuInterface[];
}) {
  const pathname = usePathname();
  console.log("pathname", pathname);

  const storeUrlStart = pathname.split("/stores/")[1];
  const activeStore = storeUrlStart ? storeUrlStart.split("/")[0] : "";

  return (
    <nav className="relative grow">
      <Command className="overflow-visible rounded-lg bg-transparent">
        <CommandInput placeholder="Search..." />
        <CommandList className="overflow-visible py-2">
          <CommandEmpty>No Links found.</CommandEmpty>
          <CommandGroup className="relative overflow-visible pt-0">
            {menuLinks.map((link, index) => {
              let icon;
              const iconSearch = icons.find((icon) => icon.value === link.icon);
              if (iconSearch) icon = <iconSearch.path />;
              return (
                <CommandItem
                  key={index}
                  className={cn("mt-1 h-12 w-full cursor-pointer", {
                    "bg-accent text-accent-foreground":
                      link.link === ""
                        ? pathname === `/dashboard/seller/stores/${activeStore}`
                        : `/dashboard/seller/stores/${activeStore}/${link.link}` ===
                          pathname,
                  })}
                >
                  <Link
                    href={`/dashboard/seller/stores/${activeStore}/${link.link}`}
                    className="flex w-full items-center gap-2 rounded-md transition-all hover:bg-transparent"
                  >
                    {icon}
                    <span>{link.label}</span>
                  </Link>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </nav>
  );
}
