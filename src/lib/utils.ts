import { type ClassValue, clsx } from "clsx";
import { formatDate, formatDistanceToNowStrict } from "date-fns";
import { twMerge } from "tailwind-merge";
import ColorThief from "colorthief";
import { PrismaClient } from "@prisma/client";
import prisma from "./db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM d, yyyy");
    }
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function slugify(
  input: string,
  p0: { replacement: string; lower: boolean; trim: boolean },
): string {
  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export const generateUniqueSlug = async (
  baseSlug: string,
  model: keyof PrismaClient,
  field: string = "slug",
  separator: string = "-",
) => {
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const exisitngRecord = await (prisma[model] as any).findFirst({
      where: {
        [field]: slug,
      },
    });
    if (!exisitngRecord) {
      break;
    }
    slug = `${slug}${separator}${suffix}`;
    suffix += 1;
  }
  return slug;
};

// Helper function to grid grid classnames dependng on length
export const getGridClassName = (length: number) => {
  switch (length) {
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 grid-rows-2";
    case 4:
      return "grid-cols-2 grid-rows-1";
    case 5:
      return "grid-cols-2 grid-rows-6";
    case 6:
      return "grid-cols-2";
    default:
      return "";
  }
};

// Function to get prominent colors from an image
export const getDominantColors = (imgUrl: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const colors = colorThief.getPalette(img, 4).map((color) => {
          // Convert RGB array to hex string
          return `#${((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2])
            .toString(16)
            .slice(1)
            .toUpperCase()}`;
        });
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
};
