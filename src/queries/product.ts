"use server";

import { validateRequest } from "@/auth";
import { ProductPageType, ProductWithVariantType } from "@/lib/types";

import slugify from "slugify";

import { PrismaClient, ProductVariant, Size, Store } from "@prisma/client";
import { generateUniqueSlug } from "@/lib/utils";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

// Prisma client
const prisma = new PrismaClient();

export async function upsertProduct(
  product: ProductWithVariantType,
  storeUrl: string,
): Promise<ProductWithVariantType | null> {
  try {
    // Retrieve current user
    const { user } = await validateRequest();

    // Check if user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Ensure user has seller privileges
    if (user.role !== "SELLER")
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry.",
      );

    // Ensure product data is provided
    if (!product) throw new Error("Please provide product data.");

    const existingProduct = await prisma.product.findUnique({
      where: { id: product.productId },
    });

    // Find the store by URL
    const store = await prisma.store.findUnique({
      where: { url: storeUrl, userId: user.id },
    });
    if (!store) throw new Error("Store not found.");

    const productSlug = await generateUniqueSlug(
      slugify(product.name, {
        replacement: "",
        lower: true,
        trim: true,
      }),
      "product",
    );

    const variantSlug = await generateUniqueSlug(
      slugify(product.variantName, {
        replacement: "",
        lower: true,
        trim: true,
      }),
      "productVariant",
    );

    const commonProductData = {
      name: product.name,
      description: product.description,
      slug: productSlug,
      brand: product.brand,
      specs: {
        create: product.product_specs.map((spec) => ({
          name: spec.name,
          value: spec.value,
        })),
      },
      questions: {
        create: product.questions.map((question) => ({
          question: question.question,
          answer: question.answer,
        })),
      },
      store: { connect: { id: store.id } },
      category: { connect: { id: product.categoryId } },
      subCategory: { connect: { id: product.subCategoryId } },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    const commonVariantData = {
      variantName: product.variantName,
      variantDescription: product.variantDescription,
      slug: variantSlug,
      isSale: product.isSale,
      saleEndDate: product.isSale ? product.saleEndDate : "",
      sku: product.sku,
      keywords: product.keywords.join(","),
      specs: {
        create: product.variant_specs.map((spec) => ({
          name: spec.name,
          value: spec.value,
        })),
      },
      images: {
        create: product.images.map((image) => ({
          url: image.url,
          alt: image.url.split("/").pop() || "",
        })),
      },
      variantImage: product.variantImage,
      colors: {
        create: product.colors.map((color) => ({
          name: color.color,
        })),
      },
      sizes: {
        create: product.sizes.map((size) => ({
          size: size.size,
          quantity: size.quantity,
          price: size.price,
          discount: size.discount,
        })),
      },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    if (existingProduct) {
      const variantData = {
        ...commonVariantData,
        product: { connect: { id: product.productId } },
      };
      return await prisma.productVariant.create({ data: variantData });
    } else {
      const productData = {
        ...commonProductData,
        id: product.productId,
        variants: {
          create: [
            {
              id: product.variantId,
              ...commonVariantData,
            },
          ],
        },
      };

      return await prisma.product.create({
        data: productData,
      });
    }
  } catch (error) {
    throw error;
  }
}

export const getProductMainInfo = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) return null;

  return {
    productId: product.id,
    name: product.name,
    description: product.description,
    brand: product.brand,
    categoryId: product.categoryId,
    subCategoryId: product.subCategoryId,
    storeId: product.storeId,
  };
};

export const getAllStoreProducts = async (storeUrl: string) => {
  const store = await prisma.store.findUnique({
    where: { url: storeUrl },
  });
  if (!store) throw new Error("Please provide a valid store URL.");

  const products = await prisma.product.findMany({
    where: {
      storeId: store.id,
    },
    include: {
      category: true,
      subCategory: true,
      variants: {
        include: {
          images: true,
          colors: true,
          sizes: true,
        },
      },
      store: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });

  return products;
};

export const deleteProduct = async (productId: string) => {
  // Retrieve current user
  const { user } = await validateRequest();

  // Check if user is authenticated
  if (!user) throw new Error("Unauthenticated.");

  // Ensure user has seller privileges
  if (user.role !== "SELLER")
    throw new Error(
      "Unauthorized Access: Seller Privileges Required for Entry.",
    );

  // Ensure product data is provided
  if (!productId) throw new Error("Please provide product id.");

  const response = await prisma.product.delete({
    where: { id: productId },
  });
  return response;
};

export const getProducts = async (
  filters: any = {},
  sortBy = "",
  page: number = 1,
  pageSize: number = 10,
) => {
  const currentPage = page;
  const limit = pageSize;
  const skip = (currentPage - 1) * limit;

  const whereClause: any = {
    AND: [],
  };

  // Store filter
  if (filters.store) {
    const store = await prisma.store.findUnique({
      where: { url: filters.store },
      select: { id: true },
    });
    if (store) whereClause.AND.push({ storeId: store.id });
  }

  // Exclude product
  if (filters.productId) {
    whereClause.AND.push({ id: { not: filters.productId } });
  }

  // Category filter
  if (filters.category) {
    const category = await prisma.category.findUnique({
      where: { url: filters.category },
      select: { id: true },
    });
    if (category) whereClause.AND.push({ categoryId: category.id });
  }

  // Subcategory filter
  if (filters.subCategory) {
    const subCategory = await prisma.subCategory.findUnique({
      where: { url: filters.subCategory },
      select: { id: true },
    });
    if (subCategory) whereClause.AND.push({ subCategoryId: subCategory.id });
  }

  // Size filter
  if (filters.size && Array.isArray(filters.size)) {
    whereClause.AND.push({
      variants: {
        some: {
          sizes: {
            some: {
              size: { in: filters.size },
            },
          },
        },
      },
    });
  }

  // Offer filter
  if (filters.offer) {
    const offer = await prisma.offerTag.findUnique({
      where: { url: filters.offer },
      select: { id: true },
    });
    if (offer) whereClause.AND.push({ offerTagId: offer.id });
  }

  // Search filter
  if (filters.search) {
    whereClause.AND.push({
      OR: [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        {
          variants: {
            some: {
              OR: [
                {
                  variantName: {
                    contains: filters.search,
                    mode: "insensitive",
                  },
                },
                {
                  variantDescription: {
                    contains: filters.search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        },
      ],
    });
  }

  // Price filter
  if (filters.minPrice || filters.maxPrice) {
    whereClause.AND.push({
      variants: {
        some: {
          sizes: {
            some: {
              price: {
                gte: filters.minPrice ?? 0,
                lte: filters.maxPrice ?? Number.MAX_SAFE_INTEGER,
              },
            },
          },
        },
      },
    });
  }

  // Color filter
  if (filters.color && Array.isArray(filters.color)) {
    whereClause.AND.push({
      variants: {
        some: {
          colors: {
            some: {
              name: { in: filters.color },
            },
          },
        },
      },
    });
  }

  // Sort options
  let orderBy: any = {};
  switch (sortBy) {
    case "most-popular":
      orderBy = { views: "desc" };
      break;
    case "new-arrivals":
      orderBy = { createdAt: "desc" };
      break;
    case "top-rated":
      orderBy = { rating: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  // Fetch filtered products
  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy,
    take: limit,
    skip,
    include: {
      variants: {
        include: {
          sizes: true,
          colors: true,
          images: true,
        },
      },
    },
  });

  // Sorting by price if needed
  const getMinPrice = (product: any) =>
    Math.min(
      ...product.variants.flatMap(
        (variant: ProductVariant & { sizes: Size[] }) =>
          variant.sizes.map(
            (size) => size.price * (1 - (size.discount ?? 0) / 100),
          ),
      ),
      Infinity,
    );

  products.sort((a, b) => {
    const priceA = getMinPrice(a);
    const priceB = getMinPrice(b);
    if (sortBy === "price-low-to-high") return priceA - priceB;
    if (sortBy === "price-high-to-low") return priceB - priceA;
    return 0;
  });

  // Transform for UI
  const productsWithFilteredVariants = products.map((product) => {
    const variants = product.variants.map((variant) => ({
      variantId: variant.id,
      variantSlug: variant.slug,
      variantName: variant.variantName,
      images: variant.images,
      sizes: variant.sizes,
    }));

    const variantImages = product.variants.map((variant) => ({
      url: `/product/${product.slug}/${variant.slug}`,
      image: variant.variantImage || variant.images[0]?.url,
    }));

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      rating: product.rating,
      sales: product.sales,
      numReviews: product.numReviews,
      variants,
      variantImages,
    };
  });

  // Optional: total count with same filters
  const totalCount = await prisma.product.count({ where: whereClause });
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    products: productsWithFilteredVariants,
    totalPages,
    currentPage,
    pageSize,
    totalCount,
  };
};

export const getProductPageData = async (
  productSlug: string,
  variantSlug: string,
) => {
  const product = await retrieveProductDetails(productSlug, variantSlug);

  if (!product) return;

  const userCountry = await getUserCountry();
  console.log("userCountry", userCountry);

  const productShippingDetails = await getShippingDetails(
    product.shippingFeeMethod,
    userCountry,
    product.store,
  );

  console.log("productShippingDetails", productShippingDetails);

  return formatProductResponse(product);
};

export const retrieveProductDetails = async (
  productSlug: string,
  variantSlug: string,
) => {
  const product = await prisma.product.findUnique({
    where: {
      slug: productSlug,
    },
    include: {
      category: true,
      subCategory: true,
      offerTag: true,
      store: true,
      specs: true,
      questions: true,
      variants: {
        where: {
          slug: variantSlug,
        },
        include: {
          images: true,
          colors: true,
          sizes: true,
          specs: true,
        },
      },
    },
  });

  if (!product) return null;

  const variantImages = await prisma.productVariant.findMany({
    where: {
      productId: product.id,
    },
    select: {
      slug: true,
      variantImage: true,
    },
  });

  console.log("variantImages", variantImages);

  return {
    ...product,
    variantImages: variantImages.map((v) => ({
      url: `/product/${productSlug}/${v.slug}`,
      img: v.variantImage,
      slug: v.slug,
    })),
  };
};

const getUserCountry = async (): Promise<{ name: string; code: string }> => {
  const defaultCountry = { name: "United States", code: "US" };

  try {
    const userCountryCookie = await getCookie("userCountry", { cookies });

    if (!userCountryCookie || typeof userCountryCookie !== "string") {
      return defaultCountry;
    }

    const parsedCountry = JSON.parse(userCountryCookie);

    if (
      parsedCountry &&
      typeof parsedCountry === "object" &&
      "name" in parsedCountry &&
      "code" in parsedCountry
    ) {
      return parsedCountry;
    }

    return defaultCountry;
  } catch (error) {
    console.error("Failed to parse userCountryCookie", error);
    return defaultCountry;
  }
};

const formatProductResponse = (product: ProductPageType) => {
  if (!product) return;
  const variant = product.variants[0];
  const { store, category, subCategory, offerTag, questions } = product;
  const { images, colors, sizes } = variant;

  return {
    productId: product.id,
    variantId: variant.id,
    productSlug: product.slug,
    variantSlug: variant.slug,
    name: product.name,
    description: product.description,
    variantName: variant.variantName,
    variantDescription: variant.variantDescription,
    images,
    category,
    subCategory,
    offerTag,
    isSale: variant.isSale,
    saleEndDate: variant.saleEndDate,
    brand: product.brand,
    sku: variant.sku,
    store: {
      id: store.id,
      url: store.url,
      name: store.name,
      logo: store.logo,
      followersCount: 10,
      isUserFollowingStore: true,
    },
    colors,
    sizes,
    specs: {
      product: product.specs,
      variant: variant.specs,
    },
    questions,
    rating: product.rating,
    reviews: [],
    numReviews: 122,
    reviewsStatistics: {
      ratingStatistics: [],
      reviewsWithImagesCount: 5,
    },
    shippingDetails: {},
    relatedProducts: [],
    variantImages: product.variantImages,
  };
};

export const getShippingDetails = async (
  shippingFeeMethod: string,
  userCountry: { name: string; code: string; city: string },
  store: Store,
) => {
  const country = await prisma.country.findUnique({
    where: {
      name: userCountry.name,
      code: userCountry.code,
    },
  });

  if (country) {
    const shippingRate = await prisma.shippingRate.findFirst({
      where: {
        countryId: country.id,
        storeId: store.id,
      },
    });

    const returnPolicy = shippingRate?.returnPolicy || store.returnPolicy;
    const shippingService =
      shippingRate?.shippingService || store.defaultShippingService;

    const shippingFeePerItem =
      shippingRate?.shippingFeePerItem || store.defaultShippingFeePerItem;

    const shippingFeeForAdditionalItem =
      shippingRate?.shippingFeeForAdditionalItem ||
      store.defaultShippingFeeForAdditionalItem;

    const shippingFeePerKg =
      shippingRate?.shippingFeePerKg || store.defaultShippingFeePerKg;

    const shippingFeeFixed =
      shippingRate?.shippingFeeFixed || store.defaultShippingFeeFixed;

    const deliveryTimeMin =
      shippingRate?.deliveryTimeMin || store.defaultDeliveryTimeMin;

    const deliveryTimeMax =
      shippingRate?.deliveryTimeMax || store.defaultDeliveryTimeMax;

    let shippingDetails = {
      shippingFeeMethod,
      shippingService: shippingService,
      shippingFee: 0,
      extraShippingFee: 0,
      deliveryTimeMin,
      deliveryTimeMax,
      returnPolicy,
      countryCode: userCountry.code,
      countryName: userCountry.name,
      city: userCountry.city,
    };

    switch (shippingFeeMethod) {
      case "ITEM":
        shippingDetails.shippingFee = shippingFeePerItem;
        shippingDetails.extraShippingFee = shippingFeeForAdditionalItem;
        break;
      case "WEIGHT":
        shippingDetails.shippingFee = shippingFeePerKg;
        break;
      case "FIXED":
        shippingDetails.shippingFee = shippingFeeFixed;
        break;

      default:
        break;
    }

    return shippingDetails;
  }

  return false;
};
