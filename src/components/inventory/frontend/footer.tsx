"use client";
import Image from "next/image";
import Link from "next/link";
import ThemeButton from "./theme-button";
import { useRouter } from "next/navigation";
// import { getContactInfo } from "@/config/meta";
import Logo from "../global/Logo";

export default function Footer() {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Documentation", href: "/docs" },
    { label: "Showcase", href: "/showcase" },
    { label: "Agency Site", href: "/agency" },
    // { label: "Blog", href: "/blog" },
    { label: "Support", href: "https://wa.me/message/5USU26346OWRF1" },
  ];

  const serviceItems = [
    { label: "Next.js Starter Kit", href: "/" },
    {
      label: "Need Custom Development",
      href: "https://wa.me/message/5USU26346OWRF1",
    },
    {
      label: "Need Deployment Support",
      href: "https://wa.me/message/5USU26346OWRF1",
    },
    {
      label: "Need UI Customization",
      href: "https://wa.me/message/5USU26346OWRF1",
    },
  ];
  const router = useRouter();
  // const { email, fullAddress, mainPhone } = getContactInfo();
  return (
    <footer className="relative overflow-hidden rounded-t-[2.5rem] bg-gray-900 px-4 py-16 text-white md:px-8 lg:px-16">
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-green-500/10 blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative">
        {/* Top Section */}
        <div className="mx-auto mb-16 flex max-w-7xl flex-col items-start justify-between md:flex-row md:items-center">
          <div className="mb-8 md:mb-0">
            <h2 className="mb-4 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-2xl font-semibold text-transparent md:text-3xl">
              Manage your Inventory with Inventory Pro
            </h2>
            <p className="max-w-xl text-base text-gray-400">
              Inventory Pro offers a comprehensive solution for businesses to
              track products, manage stock levels across multiple locations,
              process sales orders, and handle supplier relationships.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <button
              onClick={() => router.push("/contact")}
              className="block rounded-full border border-gray-700 px-6 py-3 text-gray-300 transition-all duration-300 hover:border-emerald-500 hover:text-emerald-400 md:!py-1"
            >
              Get Support
            </button>
            <ThemeButton
              href="https://gmukejohnbaptist.gumroad.com/l/hubstack-simple-auth"
              title="Purchase Now"
            />
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
            {/* Logo and Social Media Section */}
            <div className="lg:col-span-4">
              <Logo variant="dark" />
              <div className="mt-6 flex flex-col">
                <h3 className="mb-4 text-base font-semibold text-gray-200">
                  Social Media Links
                </h3>
                <div className="flex gap-4">
                  {[
                    "https://cdn-icons-png.flaticon.com/128/5968/5968764.png",
                    "https://cdn-icons-png.flaticon.com/128/3670/3670151.png",
                    "https://cdn-icons-png.flaticon.com/128/145/145807.png",
                    "https://cdn-icons-png.flaticon.com/128/3670/3670176.png",
                  ].map((social) => (
                    <Link
                      key={social}
                      href="#"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition-all duration-300 hover:bg-emerald-500/20"
                    >
                      <Image
                        src={social}
                        alt={`${social} icon`}
                        width={20}
                        height={20}
                        className="opacity-75 transition-opacity hover:opacity-100"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="mb-4 text-base font-semibold text-gray-200">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {navItems.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-emerald-400"
                    >
                      <span className="h-1 w-1 rounded-full bg-emerald-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="lg:col-span-3">
              <h3 className="mb-4 text-base font-semibold text-gray-200">
                Services
              </h3>
              <ul className="space-y-3">
                {serviceItems.slice(0, 6).map((service, i) => (
                  <li key={i}>
                    <Link
                      href={service.href}
                      className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-emerald-400"
                    >
                      <span className="h-1 w-1 rounded-full bg-emerald-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-3">
              <h3 className="mb-4 text-base font-semibold text-gray-200">
                Contact Information
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  {/* Phone: {mainPhone} */}
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  {/* Email: {email} */}
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  Address:
                  <br />
                  {/* {fullAddress} */}
                  {/* <br />
                  Wellness City, 56789 */}
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()}{" "}
              <Link
                href="/"
                className="transition-colors hover:text-emerald-400"
              >
                Hubstack
              </Link>{" "}
              |
              <Link
                href="#"
                className="ml-2 transition-colors hover:text-emerald-400"
              >
                Privacy Policy
              </Link>{" "}
              |
              <Link
                href="#"
                className="ml-2 transition-colors hover:text-emerald-400"
              >
                Terms & Conditions
              </Link>{" "}
              |
              <Link
                href="#"
                className="ml-2 transition-colors hover:text-emerald-400"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
