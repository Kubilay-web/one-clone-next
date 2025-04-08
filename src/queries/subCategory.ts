"use server";

import { validateRequest } from "@/auth";
import { PrismaClient } from "@prisma/client";

// Prisma client
const prisma = new PrismaClient();

// SubCategory interface
interface ISubCategory {
  id: string; // SubCategory ID
  name: string; // SubCategory name
  url: string; // SubCategory URL
  image: string; // SubCategory image
  featured: boolean; // Featured status
  categoryId: string; // The ID of the related category
  createdAt?: Date; // Created timestamp
  updatedAt?: Date; // Updated timestamp
}

// Function to upsert (create or update) a SubCategory
export async function upsertSubCategory(
  subCategory: ISubCategory,
): Promise<ISubCategory | null> {
  try {
    // Validate the request and extract user
    const { user } = await validateRequest();

    // Check if user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Check if user is an Admin
    if (user?.role !== "ADMIN")
      throw new Error(
        "Unauthorized Access: Admin Privileges Required for Entry.",
      );

    // Ensure subCategory data is provided
    if (!subCategory) throw new Error("Please provide subcategory data.");

    // Check if a subcategory with the same name or URL already exists
    const existingSubCategory = await prisma.subCategory.findFirst({
      where: {
        OR: [{ name: subCategory.name }, { url: subCategory.url }],
        NOT: [{ id: subCategory.id }], // Exclude the current subcategory being updated
      },
    });

    if (existingSubCategory) {
      let errorMessage = "";
      if (existingSubCategory.name === subCategory.name) {
        errorMessage = "A subcategory with the same name already exists.";
      } else if (existingSubCategory.url === subCategory.url) {
        errorMessage = "A subcategory with the same URL already exists.";
      }
      throw new Error(errorMessage);
    }

    // Upsert the SubCategory (update or create)
    const result = await prisma.subCategory.upsert({
      where: { id: subCategory.id },
      update: {
        name: subCategory.name,
        url: subCategory.url,
        image: subCategory.image,
        featured: subCategory.featured,
        categoryId: subCategory.categoryId,
        updatedAt: new Date(),
      },
      create: {
        id: subCategory.id,
        name: subCategory.name,
        url: subCategory.url,
        image: subCategory.image,
        featured: subCategory.featured,
        categoryId: subCategory.categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return result;
  } catch (error) {
    console.error("Something went wrong:", error);
    throw error;
  }
}
