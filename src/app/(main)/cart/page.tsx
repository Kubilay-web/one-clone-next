"use client";

import { useCartStore } from "@/cart-store/useCartStore";
import CartProduct from "@/components/store/cards/cart-product";
import FastDelivery from "@/components/store/cards/product/fast-delivery";
import CartHeader from "@/components/store/cart-page/cart-header";
import CartSummary from "@/components/store/cart-page/summary";
import { SecurityPrivacyCard } from "@/components/store/product-page/returns-security-privacy-card";
import useFromStore from "@/hooks/useFromStore";
import { CartProductType } from "@/lib/types";
import { useState } from "react";

export default function page() {
  const cartItems = useFromStore(useCartStore, (state) => state.cart);

  const [selectedItems, setSelectedItems] = useState<CartProductType[]>([]);
  const [totalShipping, setTotalShipping] = useState<number>(0);

  console.log("selectedItems", selectedItems);

  return (
    <div>
      {cartItems && cartItems.length > 0 ? (
        <div className="bg-[#f5f5f5]">
          <div className="mx-auto flex max-w-[1200px] py-6">
            <div className="min-w-0 flex-1">
              <CartHeader
                cartItems={cartItems}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
              <div className="mt-2 h-auto overflow-auto overflow-x-hidden">
                {cartItems.map((product) => (
                  <CartProduct
                    product={product}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    setTotalShipping={setTotalShipping}
                  />
                ))}
              </div>
            </div>
            <div className="sticky top-4 ml-5 max-h-max w-[380px]">
              <CartSummary cartItems={cartItems} shippingFees={totalShipping} />
              <div className="mt-2 bg-white p-4 px-6">
                <FastDelivery />
              </div>
              <div className="mt-2 bg-white p-4 px-6">
                <SecurityPrivacyCard />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>No product</div>
      )}
    </div>
  );
}
