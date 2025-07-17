"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { IoMdList } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

const Header_Category = () => {
  const path = usePathname();
  const data = [
    {
      id: 1,
      name: "Sports",
    },
    {
      id: 2,
      name: "Travel",
    },
    {
      id: 3,
      name: "Education",
    },
    {
      id: 4,
      name: "National",
    },
    {
      id: 5,
      name: "Politice",
    },
    {
      id: 6,
      name: "Technology",
    },
  ];

  const [cate_show, set_cate_show] = useState(false);
  const [show, setShow] = useState(false);

  return (
    <div className="w-full">
      <div className="relative w-full bg-[#5271ff] font-semibold uppercase text-white">
        <div className="relative flex h-[50px] items-center justify-between px-8">
          <div
            onClick={() => set_cate_show(!cate_show)}
            className={`flex h-full w-[50px] cursor-pointer items-center justify-center text-3xl font-bold lg:hidden ${cate_show ? "bg-[#00000026]" : ""} hover:bg-[#00000026]`}
          >
            <IoMdList />
          </div>

          <div className="hidden flex-wrap lg:flex">
            <Link
              className={`px-6 py-[13px] font-medium ${path === "/" ? "bg-[#00000026]" : ""} `}
              href={"/"}
            >
              {" "}
              Home{" "}
            </Link>

            {data.map((c, i) => (
              <Link
                key={i}
                className={`px-6 py-[13px] font-medium ${path === c.name ? "bg-[#00000026]" : ""} `}
                href={"/"}
              >
                {" "}
                {c.name}{" "}
              </Link>
            ))}
          </div>

          <div className="h-full w-[50px]">
            <div
              onClick={() => setShow(!show)}
              className={`text-xl ${show ? "bg-[#00000026]" : ""} flex h-full w-full cursor-pointer items-center justify-center font-bold hover:bg-[#00000026]`}
            >
              {show ? <IoMdCloseCircle /> : <FaSearch />}
            </div>

            <div
              className={`absolute right-0 top-[50px] z-20 w-full text-slate-700 shadow-lg transition-all lg:right-10 lg:block lg:w-[300px] ${show ? "visible" : "invisible"} `}
            >
              <div className="bg-white p-3">
                <form className="flex">
                  <div className="h-[40px] w-[calc(100%-45px)]">
                    <input
                      type="text"
                      placeholder="Seach"
                      className="h-full w-full border border-slate-300 bg-slate-100 p-2 outline-none"
                    />
                  </div>
                  <button className="flex h-[40px] w-[45px] cursor-pointer items-center justify-center bg-blue-600 text-xl text-white outline-none hover:bg-blue-700">
                    <FaSearch />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {cate_show && (
        <div className="flex flex-wrap px-[30px] py-2 lg:hidden">
          <Link
            className={`px-4 py-[5px] font-medium ${path === "/" ? "bg-[#00000026]" : ""} `}
            href={"/"}
          >
            {" "}
            Home{" "}
          </Link>

          {data.map((c, i) => (
            <Link
              key={i}
              className={`px-4 py-[5px] font-medium ${path === c.name ? "bg-[#00000026]" : ""} `}
              href={"/"}
            >
              {" "}
              {c.name}{" "}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header_Category;
