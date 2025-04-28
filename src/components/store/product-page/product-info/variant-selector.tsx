"use client";
import { CartProductType, ProductVariantDataType } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, FC, SetStateAction } from "react";

interface Variant {
  url: string;
  img: string;
  slug: string;
}

interface Props {
  variants: Variant[];
  slug: string;
}

const ProductVariantSelector: FC<Props> = ({ variants, slug }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant, i) => (
        <Link href={variant.slug} key={i}>
          <div
            key={i}
            onMouseEnter={() => {
              //  setVariantImages(variant.images);
              // setActiveImage(variant.images[0]);
            }}
            onMouseLeave={() => {
              //   setVariantImages(activeVariant?.images || []);
              // setActiveImage(activeVariant?.images[0] || null);
            }}
          >
            <div
              className={cn(
                "grid h-12 max-h-12 w-12 cursor-pointer place-items-center overflow-hidden rounded-full outline-dashed outline-[1px] outline-offset-2 outline-transparent transition-all duration-75 ease-in hover:outline-main-primary",
                {
                  "outline-main-primary": slug ? slug === variant.slug : i == 0,
                },
              )}
            >
              <Image
                src={variant.img}
                alt={`product variant `}
                width={60}
                height={60}
                className="h-12 w-12 rounded-full object-cover object-center"
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductVariantSelector;
