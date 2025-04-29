import { ProductPageDataType } from "@/lib/types";
import { ReactNode, FC } from "react";
import ProductSwiper from "./product-swiper";
import ProductInfo from "./product-info/product-info";

interface Props {
  productData: ProductPageDataType;
  sizeId: string | undefined;
  children: ReactNode;
}

const ProductPageContainer: FC<Props> = ({ productData, sizeId, children }) => {
  if (!productData) return null;

  const { images } = productData;
  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        <ProductSwiper images={images} />
        <div className="mt-4 flex w-full flex-col gap-4 md:mt-0 md:flex-row">
          <ProductInfo productData={productData} sizeId={sizeId} />

          <div className="w-[390px]">
            <div className="z-20">
              <div className="overflow-hidden overflow-y-auto rounded-md border bg-white p-4 pb-0"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 w-[calc(100%-390px)] pb-16">{children}</div>
    </div>
  );
};

export default ProductPageContainer;
