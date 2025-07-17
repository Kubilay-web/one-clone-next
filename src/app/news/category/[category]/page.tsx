import Breadcrumb from "@/components/newsportal/Breadcrumb";
import Category from "@/components/newsportal/Category";
import SimpleDetailsNewCard from "@/components/newsportal/news/item/SimpleDetailsNewCard";
import PopularNews from "@/components/newsportal/news/PopularNews";
import RecentNews from "@/components/newsportal/news/RecentNews";
import Search from "@/components/newsportal/news/Search";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="bg-white py-4 shadow-sm">
        <div className="w-full px-4 md:px-8">
          <Breadcrumb one="Category" two="Sports" />
        </div>
      </div>

      <div className="w-full bg-slate-200">
        <div className="w-full px-4 py-8 md:px-8">
          <div className="flex flex-wrap">
            <div className="w-full xl:w-8/12">
              <div className="w-full pr-0 xl:pr-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((item, i) => (
                    <SimpleDetailsNewCard
                      news={item}
                      type="details_news"
                      height={200}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full xl:w-4/12">
              <div className="w-full pl-0 xl:pl-4">
                <div className="flex flex-col gap-y-8">
                  <Search />
                  <RecentNews />
                  <div className="bg-white p-4">
                    <Category titleStyle={"text-gray-700 font-bold"} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <PopularNews />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
