"use client";

import { CartWithCartItemsType, UserShippingAddressType } from "@/lib/types";
import { Country, ShippingAddress } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import UserShippingAddresses from "../shared/shipping-addresses/shipping-addresses";
import CheckoutProductCard from "../cards/checkout-product";
import PlaceOrderCard from "../cards/place-order";
import { Country as CountryType } from "@/lib/types";
import CountryNote from "../cart-page/country-note";
import { updateCheckoutProductstWithLatest } from "@/queries/user";

interface Props {
  cart: CartWithCartItemsType;
  countries: Country[];
  addresses: UserShippingAddressType[];
  userCountry: CountryType;
}

const CheckoutContainer: FC<Props> = ({
  cart,
  countries,
  addresses,
  userCountry,
}) => {
  const [cartData, setCartData] = useState<CartWithCartItemsType>(cart);

  const [selectedAddress, setSelectedAddress] =
    useState<ShippingAddress | null>(null);

  const activeCountry = addresses.find(
    (add) => add.countryId === selectedAddress?.countryId,
  )?.country;

  console.log("activeCountry---", activeCountry);

  const { cartItems } = cart;

  useEffect(() => {
    const hydrateCheckoutCart = async () => {
      const updatedCart = await updateCheckoutProductstWithLatest(
        cartItems,
        activeCountry,
      );
      setCartData(updatedCart);
    };

    if (cartItems.length > 0) {
      hydrateCheckoutCart();
    }
  }, [activeCountry]);

  return (
    <div className="flex">
      <div className="my-3 flex-1">
        <UserShippingAddresses
          addresses={addresses}
          countries={countries}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
        <div className="my-2">
          <CountryNote
            country={activeCountry ? activeCountry.name : userCountry.name}
          />
        </div>
        <div className="my-3 w-full bg-white px-4 py-4">
          <div className="relative">
            {cartData.cartItems.map((product) => {
              return (
                <CheckoutProductCard
                  key={product.variantId}
                  product={product}
                />
              );
            })}
          </div>
        </div>
      </div>
      <PlaceOrderCard
        cartId={cart.id}
        shippingAddress={selectedAddress}
        shippingFees={cartData.shippingFees}
        subTotal={cartData.subTotal}
        total={cartData.total}
      />
    </div>
  );
};

export default CheckoutContainer;
