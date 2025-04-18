import Link from "next/link";
import UserMenu from "./user-menu/user-menu";
import Cart from "./cart";
import DownloadApp from "./download-app";
import Search from "./search/search";

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-slate-500 to-slate-800">
      <div className="h-full w-full px-4 text-white lg:flex lg:px-12">
        <div className="flex flex-col gap-3 py-3 lg:w-full lg:flex-1 lg:flex-row">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="font-mono text-3xl font-extrabold">GoShop</h1>
            </Link>
            <div className="flex lg:hidden">
              <UserMenu />
              <Cart />
            </div>
          </div>
          <Search />
        </div>
        <div className="mt-1.5 hidden w-full justify-end pl-6 lg:mt-2 lg:flex lg:w-fit">
          <div className="lg:flex">
            <DownloadApp />
          </div>
          <UserMenu />
          <Cart />
        </div>
      </div>
    </div>
  );
}
