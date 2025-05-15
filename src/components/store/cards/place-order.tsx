import { ShippingAddress } from "@prisma/client";
import { FC } from "react";
import { Button } from "../ui/button";
import FastDelivery from "./product/fast-delivery";
import { SecurityPrivacyCard } from "../product-page/returns-security-privacy-card";
import toast from "react-hot-toast";
import { emptyUserCart, placeOrder } from "@/queries/user";
import { useCartStore } from "@/cart-store/useCartStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  shippingFees: number;
  subTotal: number;
  total: number;
  shippingAddress: ShippingAddress | null;
  cartId: string;
}

const PlaceOrderCard: FC<Props> = ({
  shippingFees,
  subTotal,
  total,
  shippingAddress,
  cartId,
}) => {
  const { push } = useRouter();
  const emptyCart = useCartStore((state) => state.emptyCart);
  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      toast.error("Select a shipping address first.");
    } else {
      const order = await placeOrder(shippingAddress, cartId);
      if (order) emptyCart();
      await emptyUserCart();
      push(`/order/${order.orderId}`);
    }
  };

  return (
    <div className="sticky top-4 ml-5 mt-3 max-h-max w-[300px]">
      <div className="relative bg-white px-6 py-4">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Summary</h1>

        <Info title="Subtotal" text={`${subTotal.toFixed(2)}`} />
        <Info title="Shipping Fees" text={`+${shippingFees.toFixed(2)}`} />
        <Info title="Taxes" text="+0.00" />
        <Info title="Total" text={`+${total.toFixed(2)}`} isBold noBorder />

        <div className="pt-2.5">
          <Button onClick={() => handlePlaceOrder()}>
            <span>Place Order</span>
          </Button>
        </div>
      </div>
      <div className="mt-2 bg-white p-4 px-6">
        <FastDelivery />
      </div>
      <div className="mt-2 bg-white p-4 px-6">
        <SecurityPrivacyCard />
      </div>
    </div>
  );
};

export default PlaceOrderCard;

const Info = ({
  title,
  text,
  isBold,
  noBorder,
}: {
  title: string;
  text: string;
  isBold?: boolean;
  noBorder?: boolean;
}) => {
  return (
    <div
      className={cn(
        "mt-2 flex items-center border-b pb-1 text-sm font-medium text-[#222]",
        {
          "font-bold": isBold,
          "border-b-0": noBorder,
        },
      )}
    >
      <h2 className="overflow-hidden text-ellipsis whitespace-nowrap break-normal">
        {title}
      </h2>
      <h3 className="w-0 min-w-0 flex-1 text-right">
        <div className="px-0.5 text-black">
          <span className="inline-block break-all text-lg text-black">
            {text}
          </span>
        </div>
      </h3>
    </div>
  );
};
