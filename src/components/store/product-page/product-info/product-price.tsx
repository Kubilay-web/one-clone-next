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
  sizeId: string | undefined;
  sizes: SimplifiedSize[];
  isCard?: boolean;
}

const ProductPrice: FC<Props> = ({ sizeId, sizes, isCard }) => {
  const pathname = usePathname();

  const { replace } = useRouter();

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
  }

  return <div></div>;
};

export default ProductPrice;
