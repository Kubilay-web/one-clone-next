"use client";
import { StatisticsCardType } from "@/lib/types";
import StarRatings from "react-star-ratings";
export default function RatingStatisticsCard({
  statistics,
}: {
  statistics: StatisticsCardType;
}) {
  return (
    <div className="h-44 w-full flex-1">
      <div className="flex h-full flex-col justify-center gap-y-2 overflow-hidden rounded-lg bg-[#f5f5f5] px-7 py-5">
        {statistics
          ?.slice()
          .reverse()
          .map((rating) => (
            <div key={rating.rating} className="flex h-4 items-center">
              <StarRatings
                count={5}
                value={rating.rating}
                size={15}
                color="#e2dfdf"
                isHalf
                edit={false}
              />
              <div className="relative mx-2.5 h-1.5 w-full flex-1 rounded-full bg-[#e2dfdf]">
                <div
                  className="absolute left-0 h-full rounded-full bg-[#ffc50A]"
                  style={{ width: `${rating.percentage}%` }}
                />
              </div>
              <div className="w-12 text-xs leading-4">{rating.numReviews}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
