import React from "react";
import Title from "../Title";
import SimpleDetailsNewCard from "./item/SimpleDetailsNewCard";

const PopularNews = ({ type }) => {
  return (
    <div className="mt-5 w-full pb-8">
      <div className="flex w-full flex-col gap-y-[14px]">
        <Title title="Popular News" />
        <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4 lg:gap-x-3">
          {[1, 2, 3, 4].map((item, i) => (
            <SimpleDetailsNewCard
              type={type}
              item={item}
              key={i}
              height={230}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularNews;
