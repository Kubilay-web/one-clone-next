"use server";

import { PrismaClient } from "@prisma/client";

// Prisma client
const prisma = new PrismaClient();

export async function updateVariantImage() {
  try {
    // Fetch all product variants that have images
    const variants = await prisma.productVariant.findMany({
      include: {
        images: true,
      },
    });

    // Update each variant with the first image URL
    for (const variant of variants) {
      if (variant.images.length > 0) {
        const firstImage = variant.images[0];
        await prisma.productVariant.update({
          where: { id: variant.id },
          data: {
            variantImage: firstImage.url,
          },
        });
        console.log(
          `Updated variant ${variant.id} with image ${firstImage.url}`,
        );
      }
    }
    console.log(
      "All product variants have been updated with their first image.",
    );
  } catch (error) {
    console.log("Error updating variant images", error);
  } finally {
    await prisma.$disconnect();
  }
}
