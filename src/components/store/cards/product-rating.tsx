"use client";

import StarRatings from "react-star-ratings";

export default function RatingCard({ rating }: { rating: number }) {
  const fixed_rating = Number(rating.toFixed(2));
  return (
    <div className="h-44 w-full flex-1">
      <div className="flex h-full flex-col justify-center overflow-hidden rounded-lg bg-[#f5f5f5] p-6">
        <div className="text-6xl font-bold">{rating}</div>
        <div className="py-1.5">
          <StarRatings
            count={5}
            value={rating}
            size={24}
            color="#e2dfdf"
            isHalf
            edit={false}
          />
        </div>
        <div className="mt-2 leading-5 text-[#03c97a]">
          All from verified purchases
        </div>
      </div>
    </div>
  );
}
