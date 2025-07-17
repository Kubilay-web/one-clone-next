import React from "react";
import Title from "../Title";
import SimpleDetailsNewCard from "./item/SimpleDetailsNewCard";
import NewsCard from "./item/NewsCard";

const DetailsNewsRow = ({ category, type }) => {
  return (
    <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-6 shadow-md">
      <Title title={category} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SimpleDetailsNewCard type={type} height={300} />

        <div className="grid grid-cols-1 gap-2">
          {[1, 2, 3].map((item, i) => (
            <NewsCard item={item} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailsNewsRow;
