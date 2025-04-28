import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface SimplifiedSize {
  id: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;
}

interface Props {
  sizeId?: string | undefined;
  sizes: SimplifiedSize[];
  isCard?: boolean;
}

const ProductPrice: FC<Props> = ({ sizeId, sizes, isCard }) => {
  if (!sizes || sizes.length === 0) {
    return;
  }

  if (!sizeId) {
    const discountedPrices = sizes.map(
      (size) => size.price * (1 - size.discount / 100),
    );

    const totalQuantity = sizes.reduce(
      (total, size) => total + size.quantity,
      0,
    );

    const minPrice = Math.min(...discountedPrices).toFixed(2);
    const maxPrice = Math.max(...discountedPrices).toFixed(2);

    const priceDisplay =
      minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;

    let discount = 0;
    if (minPrice === maxPrice) {
      let check_discount = sizes.find((s) => s.discount > 0);
      if (check_discount) {
        discount = check_discount.discount;
      }
    }

    return (
      <div>
        <div className="mr-2.5 inline-block font-bold leading-none text-orange-primary">
          <span
            className={cn("inline-block text-nowrap text-4xl", {
              "text-lg": isCard,
            })}
          >
            {priceDisplay}
          </span>
        </div>
        {!sizeId && !isCard && (
          <div className="mt-1 text-xs leading-4 text-orange-background">
            <span>Note : Select a size to see the exact price.</span>
          </div>
        )}
        {!sizeId && !isCard && (
          <p className="mt-2 text-xs">{totalQuantity} pieces</p>
        )}
      </div>
    );
  }

  const selectedSize = sizes.find((size) => size.id === sizeId);

  if (!selectedSize) {
    return <></>;
  }

  const discountedPrice =
    selectedSize.price * (1 - selectedSize.discount / 100);

  return (
    <div>
      <div className="mr-2.5 inline-block font-bold leading-none text-orange-primary">
        <span className="inline-block text-4xl">
          ${discountedPrice.toFixed(2)}
        </span>
      </div>
      {selectedSize.price !== discountedPrice && (
        <span className="mr-2 inline-block text-xl font-normal leading-6 text-[#999] line-through">
          ${selectedSize.price.toFixed(2)}
        </span>
      )}
      {selectedSize.discount > 0 && (
        <span className="inline-block text-xl leading-6 text-orange-seconadry">
          {selectedSize.discount}% off
        </span>
      )}
      <p className="mt-2 text-xs">{selectedSize.quantity} pieces</p>
    </div>
  );
};

export default ProductPrice;
