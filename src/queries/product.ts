"use server";

import { validateRequest } from "@/auth";
import { ProductWithVariantType } from "@/lib/types";

import slugify from "slugify";

import { PrismaClient } from "@prisma/client";
import { generateUniqueSlug } from "@/lib/utils";

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
