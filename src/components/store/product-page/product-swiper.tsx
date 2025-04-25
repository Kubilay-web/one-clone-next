"use client";

import { cn } from "@/lib/utils";
import { ProductVariantImage } from "@prisma/client";
import React, { useState } from "react";
import ImageZoom from "react-image-zooom";
import Image from "next/image";

export default function ProductSwiper({
  images,
}: {
  images: ProductVariantImage[];
}) {
  const [activeImage, setActiveImage] = useState<ProductVariantImage>(
    images[0],
  );
  if (!images) return;

  return (
    <div className="relative">
      <div className="relative flex w-full flex-col-reverse gap-2 xl:flex-row">
        <div className="flex flex-wrap gap-3 xl:flex-col">
          {images.map((img) => (
            <div
              key={img.url}
              className={cn(
                "grid h-16 w-16 cursor-pointer place-items-center overflow-hidden rounded-md border border-gray-100 transition-all duration-75 ease-in",
                {
                  "border-main-primary": activeImage.id === img.id,
                },
              )}
              onMouseEnter={() => setActiveImage(img)}
            >
              <Image
                src={img.url}
                alt={img.alt}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="relative flex w-full rounded-lg 2xl:h-[600px] 2xl:w-[600px]">
          <ImageZoom
            src={activeImage.url}
            zoom={300}
            className="w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
