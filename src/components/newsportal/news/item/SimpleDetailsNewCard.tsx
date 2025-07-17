import React from "react";
import Image from "next/image";
import Link from "next/link";

const SimpleDetailsNewCard = ({ news, type }) => {
  return (
    <div className="bg-white shadow">
      <div className="group relative overflow-hidden">
        <div className="duration-[1s] h-[250px] w-full transition-all group-hover:scale-[1.1]">
          <Image
            className=""
            layout="fill"
            src={
              "https://res.cloudinary.com/dbxtifnah/image/upload/v1726961431/news_images/r3ecljivitfbqwmmutov.png"
            }
            alt="images"
          />
        </div>

        <div className="invisible absolute left-0 top-0 block h-full w-full cursor-pointer bg-white opacity-5 transition-all duration-300 group-hover:visible"></div>

        <div className="absolute bottom-4 left-5 flex flex-col items-start justify-start gap-y-2 font-semibold text-white">
          <div className="rounded-md bg-[#c80000] px-[6px] py-[2px] text-[13px]">
            Category
          </div>
        </div>
      </div>

      <div className="p-5">
        <Link
          href={"/"}
          className="text-[15px] font-semibold text-[#333333] hover:text-[#c80000]"
        >
          What puzzles reveal about the depths of our own
        </Link>
        <div className="flex gap-x-2 text-xs font-normal text-slate-600">
          <span className="font-semibold">25-09-2024</span>
          <span className="font-semibold">By Ariyan</span>
        </div>
        {type === "details_news" && (
          <p className="pt-3 text-sm text-slate-600">
            The news that Margot Robbie and Jacob Elordi are starring in Emerald
            Fennell's take on Emily Brontë's romance has caused a storm – no
            surprise in an age of increased casting scrutiny.
          </p>
        )}
      </div>
    </div>
  );
};

export default SimpleDetailsNewCard;
