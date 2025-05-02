"use client";

import { CartProductType, ProductPageDataType } from "@/lib/types";
import { ReactNode, FC, useState, useEffect } from "react";
import ProductSwiper from "./product-swiper";
import ProductInfo from "./product-info/product-info";
import ShipTo from "./shipping/ship-to";
import ShippingDetails from "./shipping/shipping-details";
import ReturnPrivacySecurityCard from "./returns-security-privacy-card";
import { isProductValidToAdd } from "@/lib/utils";
import QuantitySelector from "./quantity-selector";
import SocialShare from "../shared/social-share";

interface Props {
  productData: ProductPageDataType;
  sizeId: string | undefined;
  children: ReactNode;
}

const ProductPageContainer: FC<Props> = ({ productData, sizeId, children }) => {
  if (!productData) return null;

  const { images, shippingDetails, sizes } = productData;

  if (typeof shippingDetails === "boolean") return null;

  // Initialize the default product data for the cart item
  const data: CartProductType = {
    productId: productData.productId,
    variantId: productData.variantId,
    productSlug: productData.productSlug,
    variantSlug: productData.variantSlug,
    name: productData.name,
    variantName: productData.variantName,
    image: productData.images[0].url,
    variantImage: productData.variantImage,
    quantity: 1,
    price: 0,
    sizeId: sizeId || "",
    size: "",
    stock: 1,
    weight: productData.weight || 0,
    shippingMethod: shippingDetails.shippingFeeMethod,
    shippingService: shippingDetails.shippingService,
    shippingFee: shippingDetails.shippingFee,
    extraShippingFee: shippingDetails.extraShippingFee,
    deliveryTimeMin: shippingDetails.deliveryTimeMin,
    deliveryTimeMax: shippingDetails.deliveryTimeMax,
    isFreeShipping: shippingDetails.isFreeShipping,
  };

  const [productToBeAddedToCart, setProductToBeAddedToCart] =
    useState<CartProductType>(data);

  const [isProductValid, setIsProductValid] = useState<boolean>(false);

  const handleChange = (property: keyof CartProductType, value: any) => {
    setProductToBeAddedToCart((prevProduct) => ({
      ...prevProduct,
      [property]: value,
    }));
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const check = isProductValidToAdd(productToBeAddedToCart);
    if (check !== isProductValid) {
      setIsProductValid(check);
    }
  }, [productToBeAddedToCart]);

  console.log(
    "productToBeAddedToCart---->>>",
    productToBeAddedToCart.stock,
    productToBeAddedToCart.quantity,
  );

  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        <ProductSwiper images={images} />
        <div className="mt-4 flex w-full flex-col gap-4 md:mt-0 md:flex-row">
          <ProductInfo
            productData={productData}
            sizeId={sizeId}
            handleChange={handleChange}
          />

          <div className="w-[390px]">
            <div className="z-20">
              <div className="overflow-hidden overflow-y-auto rounded-md border bg-white p-4 pb-0">
                {typeof shippingDetails !== "boolean" && (
                  <>
                    <ShipTo
                      countryCode={shippingDetails.countryCode}
                      countryName={shippingDetails.countryName}
                      city={shippingDetails.city}
                    />
                    <div className="mt-3 space-y-3">
                      <ShippingDetails
                        shippingDetails={shippingDetails}
                        quantity={1}
                        weight={productData.weight}
                        loading={false}
                        countryName={shippingDetails.countryName}
                      />
                    </div>
                    <ReturnPrivacySecurityCard
                      returnPolicy={shippingDetails.returnPolicy}
                      loading={false}
                    />
                  </>
                )}
                <div className="sticky bottom-0 mt-5 space-y-3 bg-white pb-4">
                  {sizeId && (
                    <div className="mt-4 flex w-full justify-end">
                      <QuantitySelector
                        productId={productToBeAddedToCart.productId}
                        variantId={productToBeAddedToCart.variantId}
                        sizeId={productToBeAddedToCart.sizeId}
                        quantity={productToBeAddedToCart.quantity}
                        stock={productToBeAddedToCart.stock}
                        handleChange={handleChange}
                        sizes={sizes}
                      />
                    </div>
                  )}

                  <button className="ease-bezier-1 relative inline-block h-11 w-full min-w-20 cursor-pointer select-none whitespace-nowrap rounded-3xl border border-orange-border bg-orange-background py-2.5 font-bold leading-6 text-white transition-all duration-300 hover:bg-orange-hover">
                    <span>Buy now</span>
                  </button>
                  <button
                    disabled={!isProductValid}
                    className="ease-bezier-1 relative inline-block h-11 w-full min-w-20 cursor-pointer select-none whitespace-nowrap rounded-3xl border border-orange-border bg-orange-border py-2.5 font-bold leading-6 text-orange-hover transition-all duration-300 hover:bg-[#e4cdce]"
                  >
                    <span>Add to cart</span>
                  </button>

                  <SocialShare
                    url={`/product/${productData.productSlug}/${productData.variantSlug}`}
                    quote={`${productData.name} . ${productData.variantName}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 w-[calc(100%-390px)] pb-16">{children}</div>
    </div>
  );
};

export default ProductPageContainer;
