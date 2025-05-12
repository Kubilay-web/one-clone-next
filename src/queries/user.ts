"use server";

import { PrismaClient, ShippingAddress } from "@prisma/client";
import { validateRequest } from "@/auth";
import { CartProductType } from "@/lib/types";
import { getCookie } from "cookies-next";
import { getShippingDetails } from "./product";
import { cookies } from "next/headers";

// Prisma client
const prisma = new PrismaClient();

/**
 * @name followStore
 * @description - Kullanıcının bir mağazayı takip etme ve takipten çıkma işlemi.
 *                - Eğer kullanıcı mağazayı takip etmiyorsa, mağazayı takip eder.
 *                - Eğer kullanıcı mağazayı zaten takip ediyorsa, takipten çıkar.
 * @param storeId - Takip edilecek/edilecek mağazanın ID'si.
 * @returns {boolean} - Eğer kullanıcı mağazayı takip ediyorsa true, takipten çıkarsa false döner.
 */
export const followStore = async (storeId: string): Promise<boolean> => {
  try {
    // Şu anki doğrulama kullanıcı bilgisini al
    const { user } = await validateRequest();

    // Kullanıcının doğrulanmamış olduğuna bak
    if (!user) throw new Error("Unauthenticated");

    // Mağazanın mevcut olup olmadığını kontrol et
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) throw new Error("Store not found.");

    // Kullanıcıyı kontrol et
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userData) throw new Error("User not found.");

    // Kullanıcının zaten mağazayı takip edip etmediğini kontrol et
    const userFollowingStore = await prisma.userFollowingStore.findFirst({
      where: {
        userId: user.id,
        storeId: storeId,
      },
    });

    if (userFollowingStore) {
      // Eğer zaten takip ediyorsa, takipten çıkar
      await prisma.userFollowingStore.delete({
        where: { id: userFollowingStore.id },
      });
      return false;
    } else {
      // Eğer takip etmiyorsa, takip et
      await prisma.userFollowingStore.create({
        data: {
          userId: user.id,
          storeId: storeId,
        },
      });
      return true;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong.");
  }
};

/**
 * @name UserInfo
 * @description - Kullanıcı bilgilerini döndürür.
 * @returns {object | null} - Eğer kullanıcı varsa kullanıcı bilgilerini döndürür, yoksa null döner.
 */
export const UserInfo = async () => {
  try {
    const result = await validateRequest();
    if (result.user) {
      return result.user; // Kullanıcı varsa döndür
    }
    return null; // Kullanıcı yoksa null döndür
  } catch (error) {
    console.error("Error in UserInfo:", error);
    return null; // Hata durumunda null döndür
  }
};

export const addToWishlist = async (
  productId: string,
  variantId: string,
  sizeId?: string,
) => {
  // Ensure the user is authenticated
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthenticated.");

  const userId = user.id;

  try {
    const existingWIshlistItem = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
        variantId,
      },
    });

    if (existingWIshlistItem) {
      throw new Error("Product is already in the wishlist");
    }

    return await prisma.wishlist.create({
      data: {
        userId,
        productId,
        variantId,
        sizeId,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const saveUserCart = async (
  cartProducts: CartProductType[],
): Promise<boolean> => {
  // Get current user
  const { user } = await validateRequest();

  // Ensure user is authenticated
  if (!user) throw new Error("Unauthenticated.");

  const userId = user.id;

  // Search for existing user cart
  const userCart = await prisma.cart.findFirst({
    where: { userId },
  });

  // Delete any existing user cart
  if (userCart) {
    await prisma.cart.delete({
      where: {
        userId,
      },
    });
  }

  // Fetch product, variant, and size data from the database for validation
  const validatedCartItems = await Promise.all(
    cartProducts.map(async (cartProduct) => {
      const { productId, variantId, sizeId, quantity } = cartProduct;

      // Fetch the product, variant, and size from the database
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          store: true,
          freeShipping: {
            include: {
              eligableCountries: true,
            },
          },
          variants: {
            where: {
              id: variantId,
            },
            include: {
              sizes: {
                where: {
                  id: sizeId,
                },
              },
              images: true,
            },
          },
        },
      });

      if (
        !product ||
        product.variants === 0 ||
        product.variants[0].sizes.length === 0
      ) {
        throw new Error(
          `Invalid product, variant, or size combination for productId ${productId}, variantId ${variantId}, sizeId ${sizeId}`,
        );
      }

      const variant = product.variants[0];
      const size = variant.sizes[0];

      // Validate stock and price
      const validQuantity = Math.min(quantity, size.quantity);

      const price = size.discount
        ? size.price - size.price * (size.discount / 100)
        : size.price;

      // Calculate Shipping details
      const countryCookie = cookies().get("userCountry");

      let details = {
        shippingFee: 0,
        extraShippingFee: 0,
        isFreeShipping: false,
      };

      if (countryCookie?.value) {
        const country = JSON.parse(countryCookie.value);
        const temp_details = await getShippingDetails(
          product.shippingFeeMethod,
          country,
          product.store,
          product.freeShipping,
        );
        if (typeof temp_details !== "boolean") {
          details = temp_details;
        }
      }

      let shippingFee = 0;
      const { shippingFeeMethod } = product;
      if (shippingFeeMethod === "ITEM") {
        shippingFee =
          quantity === 1
            ? details.shippingFee
            : details.shippingFee + details.extraShippingFee * (quantity - 1);
      } else if (shippingFeeMethod === "WEIGHT") {
        shippingFee = details.shippingFee * variant.weight * quantity;
      } else if (shippingFeeMethod === "FIXED") {
        shippingFee = details.shippingFee;
      }

      const totalPrice = price * validQuantity + shippingFee;
      return {
        productId,
        variantId,
        productSlug: product.slug,
        variantSlug: variant.slug,
        sizeId,
        storeId: product.storeId,
        sku: variant.sku,
        name: `${product.name} · ${variant.variantName}`,
        image: variant.images[0].url,
        size: size.size,
        quantity: validQuantity,
        price,
        shippingFee,
        totalPrice,
      };
    }),
  );

  // Recalculate the cart's total price and shipping fees
  const subTotal = validatedCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const shippingFees = validatedCartItems.reduce(
    (acc, item) => acc + item.shippingFee,
    0,
  );

  const total = subTotal + shippingFees;

  // Save the validated items to the cart in the database
  const cart = await prisma.cart.create({
    data: {
      cartItems: {
        create: validatedCartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          sizeId: item.sizeId,
          storeId: item.storeId,
          sku: item.sku,
          productSlug: item.productSlug,
          variantSlug: item.variantSlug,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
          shippingFee: item.shippingFee,
          totalPrice: item.totalPrice,
        })),
      },
      shippingFees,
      subTotal,
      total,
      userId,
    },
  });
  if (cart) return true;
  return false;
};

export const getUserShippingAddresses = async () => {
  try {
    // Get current user
    const { user } = await validateRequest();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Retrieve all shipping addresses for the specified user
    const shippingAddresses = await prisma.shippingAddress.findMany({
      where: {
        userId: user.id,
      },
      include: {
        country: true,
        user: true,
      },
    });

    return shippingAddresses;
  } catch (error) {
    // Log and re-throw any errors
    throw error;
  }
};

export const upsertShippingAddress = async (address: ShippingAddress) => {
  try {
    // Get current user
    const { user } = await validateRequest();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Ensure address data is provided
    if (!address) throw new Error("Please provide address data.");

    // Handle making the rest of addresses default false when we are adding a new default
    if (address.default) {
      const addressDB = await prisma.shippingAddress.findUnique({
        where: { id: address.id },
      });
      if (addressDB) {
        try {
          await prisma.shippingAddress.updateMany({
            where: {
              userId: user.id,
              default: true,
            },
            data: {
              default: false,
            },
          });
        } catch (error) {
          throw new Error("Could not reset default shipping addresses");
        }
      }
    }

    // Upsert shipping address into the database
    const upsertedAddress = await prisma.shippingAddress.upsert({
      where: {
        id: address.id,
      },
      update: {
        ...address,
        userId: user.id,
      },
      create: {
        ...address,
        userId: user.id,
      },
    });

    return upsertedAddress;
  } catch (error) {
    throw error;
  }
};
