import ProductPageContainer from "@/components/store/product-page/container";
import { getProductPageData } from "@/queries/product";
import { Separator } from "@/components/ui/separator";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: { productSlug: string; variantSlug: string };
  searchParams: {
    size?: string;
  };
}

export default async function ProductVariantPage({
  params: { productSlug, variantSlug },
  searchParams: { size: sizeId },
}: PageProps) {
  const productData = await getProductPageData(productSlug, variantSlug);
  console.log(productData);

  if (!productData) {
    return notFound();
    // return redirect("/");
  }

  const { sizes } = productData;

  if (sizeId) {
    const isValidSize = sizes.some((size) => size.id === sizeId);
    if (!isValidSize) {
      return redirect(`/product/${productSlug}/${variantSlug}`);
    }
  } else if (sizes.length === 1) {
    return redirect(
      `/product/${productSlug}/${variantSlug}?size=${sizes[0].id}`,
    );
  }

  const relatedProducts = {
    products: [],
  };

  const { specs, questions } = productData;

  return (
    <div>
      <div className="mx-auto max-w-[1650px] overflow-x-hidden p-4">
        <ProductPageContainer productData={productData} sizeId={sizeId}>
          {relatedProducts.products && (
            <>
              <Separator />
            </>
          )}
          <Separator className="mt-6" />
          <>
            <Separator className="mt-6" />
          </>
          {(specs.product.length > 0 || specs.variant.length > 0) && (
            <>
              <Separator className="mt-6" />
            </>
          )}
          {questions.length > 0 && (
            <>
              <Separator className="mt-6" />
            </>
          )}
          <Separator className="mt-6" />
        </ProductPageContainer>
      </div>
    </div>
  );
}
