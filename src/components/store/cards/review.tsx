"use client";
import ColorWheel from "@/components/shared/color-wheel";
import { ReviewWithImageType } from "@/lib/types";
import { censorName } from "@/lib/utils";
import Image from "next/image";
import StarRatings from "react-star-ratings";

export default function ReviewCard({
  review,
}: {
  review: ReviewWithImageType;
}) {
  console.log(review);
  const { images, user } = review;
  const colors = review.color
    .split(",")
    .filter((color) => color.trim() !== "") // Remove any empty strings
    .map((color) => ({ name: color.trim() }));

  const { username } = user;
  const cesnoredName = `${name[0]}***${name[user.username.length - 1]}`;
  return (
    <div className="relative flex h-fit rounded-xl border border-[#d8d8d8] px-2.5 py-4">
      <div className="px- w-16 space-y-1">
        <Image
          src={user.avatarUrl}
          alt="Profile image"
          width={100}
          height={100}
          className="h-11 w-11 rounded-full object-cover"
        />
        <span className="text-xs text-main-secondary">
          {cesnoredName.toUpperCase()}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between overflow-hidden px-1.5 leading-5">
        <div className="space-y-2">
          <StarRatings
            count={5}
            size={24}
            color="#F5F5F5"
            activeColor="#FFD804"
            value={review.rating}
            isHalf
            edit={false}
          />
          <div className="flex items-center gap-x-2">
            <Image
              src={review.variantImage}
              alt=""
              width={40}
              height={40}
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="text-sm text-main-secondary">{review.variant}</div>
            <span>.</span>
            <div className="text-sm text-main-secondary">{review.size}</div>
            <span>.</span>
            <div className="text-sm text-main-secondary">
              {review.quantity} PC
            </div>
          </div>
          <p className="text-sm">{review.review}</p>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="h-20 w-20 cursor-pointer overflow-hidden rounded-xl"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    width={100}
                    height={100}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
