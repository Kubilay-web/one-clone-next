import HeadLines from "@/components/newsportal/Headlines";
import DetailsNews from "@/components/newsportal/news/DetailsNews";
import DetailsNewsCol from "@/components/newsportal/news/DetailsNewsCol";
import DetailsNewsRow from "@/components/newsportal/news/DetailsNewsRow";
import NewsCard from "@/components/newsportal/news/item/NewsCard";
import SimpleNewsCard from "@/components/newsportal/news/item/SimpleNewsCard";
import LatestNews from "@/components/newsportal/news/LatestNews";
import PopularNews from "@/components/newsportal/news/PopularNews";
import Title from "@/components/newsportal/Title";

export default function Home() {
  return (
    <div>
      <main>
        <HeadLines />
        <div className="bg-slate-100">
          <div className="px-4 py-8 md:px-8">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12">
                <LatestNews />
              </div>

              <div className="mt-5 w-full lg:mt-5 lg:w-6/12">
                <div className="flex w-full flex-col gap-y-[14px] pl-0 lg:pl-2">
                  <Title title="Technology" />
                  <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
                    {[1, 2, 3, 4].map((item, i) => (
                      <SimpleNewsCard item={item} key={i} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <PopularNews type="Popular News" />

            {/* first Section  */}
            <div className="w-full">
              <div className="flex flex-wrap">
                <div className="w-full lg:w-8/12">
                  <DetailsNewsRow category="Sports" type="details_news" />
                  <DetailsNews category="Health" />
                </div>

                <div className="w-full lg:w-4/12">
                  <DetailsNewsCol category="Education" />
                </div>
              </div>
            </div>

            {/* 2nd Section  */}
            <div className="w-full">
              <div className="flex flex-wrap">
                <div className="w-full lg:w-4/12">
                  <div className="pl-3">
                    <DetailsNewsCol category="Politics" />
                  </div>
                </div>

                <div className="w-full lg:w-8/12">
                  <div className="pl-3">
                    <DetailsNewsRow category="Travel" type="details_news" />
                    <DetailsNews category="International" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3nd Section  */}
            <div className="w-full">
              <div className="flex flex-wrap">
                <div className="w-full lg:w-8/12">
                  <DetailsNewsRow category="Technology" type="details_news" />
                </div>

                <div className="w-full lg:w-4/12">
                  <div className="pl-3">
                    <Title title="Recent News" />
                    <div className="mt-2 grid grid-cols-1 gap-y-[8px]">
                      {[1, 2, 3, 4].map((item, i) => (
                        <NewsCard item={item} key={i} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
