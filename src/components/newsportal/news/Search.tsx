"use client";
import React from "react";
import { IoSearch } from "react-icons/io5";

const Search = () => {
  return (
    <div className="bg-white p-4">
      <form className="flex">
        <div className="h-[45px] w-[calc(100%-45px)]">
          <input
            type="text"
            required
            value=""
            onChange={() => {}}
            className="h-full w-full border border-l-slate-300 bg-slate-100 p-2 outline-none"
          />
        </div>
        <button className="flex h-[45px] w-[45px] items-center justify-center bg-blue-600 text-xl text-white outline-none hover:bg-blue-800">
          <IoSearch />
        </button>
      </form>
    </div>
  );
};

export default Search;
