import Link from "next/link";
import React from "react";

const Category = ({ titleStyle }) => {
  return (
    <div className="flex w-full flex-col gap-y-[14px]">
      <div
        className={`text-xl font-bold ${titleStyle} relative pl-3 before:absolute before:-left-0 before:h-full before:w-[4px] before:bg-[#5271ff]`}
      >
        Category
      </div>

      <div
        className={`flex flex-col items-start justify-start gap-y-3 text-sm ${titleStyle} pt-1`}
      >
        {[1, 2, 3, 4, 5, 6].map((item, i) => (
          <li className="list-none font-semibold" key={i}>
            <Link href={`/`}> Category (5)</Link>
          </li>
        ))}
      </div>
    </div>
  );
};

export default Category;
