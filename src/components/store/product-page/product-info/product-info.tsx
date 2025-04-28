"use client";

import { ProductPageDataType } from "@/lib/types";
import Link from "next/link";
import { FC, useState } from "react";
import Image from "next/image";
import { CopyIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import StarRatings from "react-star-ratings";
import ProductPrice from "./product-price";
import Countdown from "../../shared/countdown";
import { Separator } from "@/components/ui/separator";
import ColorWheel from "@/components/shared/color-wheel";
import ProductVariantSelector from "./variant-selector";

interface Props {
  productData: ProductPageDataType;
  quantity?: number;
  sizeId: string | undefined;
}

const ProductInfo: FC<Props> = ({ productData, quantity, sizeId }) => {
  const [currentRating, setCurrentRating] = useState(productData?.rating ?? 0);

  if (!productData) return null;

  const {
    productId,
    name,
    sku,
    colors,
    variantImages,
    sizes,
    isSale,
    saleEndDate,
    variantName,
    store,
    rating,
    numReviews,
  } = productData;

  const copySkuToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sku);
      toast.success("Kopyalandı!");
    } catch (error) {
      toast.error("Kopyalanamadı!");
    }
  };

  // Kullanıcı yıldızlara tıklayınca çalışır
  const handleRatingChange = (newRating: number) => {
    setCurrentRating(newRating);
    toast.success(`Rating: ${newRating}`);
    // TODO: İsteğe bağlı olarak backend'e gönderilebilir
  };

  return (
    <div className="relative w-full xl:w-[540px]">
      <div>
        <h1 className="inline font-bold leading-5 text-main-primary">
          {name} {variantName}
        </h1>
      </div>

      <div className="mt-2 flex items-center text-xs">
        <Link
          href={`/store/${store.url}`}
          className="mr-2 hidden hover:underline sm:inline-block md:hidden lg:inline-block"
        >
          <div className="flex w-full items-center gap-x-1">
            <Image
              src={store.logo}
              alt={store.name}
              width={100}
              height={100}
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
        </Link>

        <div className="whitespace-nowrap">
          <span className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-gray-500">
            SKU: {sku}
          </span>
          <span
            onClick={copySkuToClipboard}
            className="mx-1 inline-block cursor-pointer align-middle text-[#2F68A8]"
          >
            <CopyIcon />
          </span>
        </div>

        <div className="ml-4 flex flex-1 items-center gap-x-2 whitespace-nowrap">
          <StarRatings
            rating={currentRating}
            starRatedColor="#FFD804"
            starEmptyColor="#F5F5F5"
            changeRating={handleRatingChange}
            numberOfStars={5}
            name="rating"
            starDimension="16px"
            starSpacing="2px"
            isAggregateRating={false} // Kullanıcı puanı
          />
          <Link href="#reviews" className="text-[#ffd804] hover:underline">
            (
            {numReviews === 0
              ? "No reviews"
              : numReviews === 1
                ? "1 yorum"
                : `${numReviews} reviews`}
            )
          </Link>
        </div>
      </div>
      <div className="relative my-2 flex flex-col justify-between sm:flex-row">
        <ProductPrice sizeId={sizeId} sizes={sizes} />
        {isSale && saleEndDate && (
          <div className="mt-4 pb-2">
            <Countdown targetDate={saleEndDate} />
          </div>
        )}
      </div>

      <Separator className="mt-2" />

      <div className="mt-4 space-y-2">
        <div className="relative flex items-center justify-between font-bold text-main-primary">
          <span className="flex items-center gap-x-2">
            {colors.length > 1 ? "Colors" : "Color"}
            <ColorWheel colors={colors} size={25} />
          </span>
        </div>
        {variantImages.length > 0 && (
          <ProductVariantSelector
            variants={variantImages}
            slug={productData.variantSlug}
          />
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
