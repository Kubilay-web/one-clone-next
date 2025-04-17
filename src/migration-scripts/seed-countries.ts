import countries from "@/data/countries.json";

import { PrismaClient } from "@prisma/client";

// Prisma client
const prisma = new PrismaClient();

export async function seedCountries() {
  try {
    for (const country of countries) {
      await prisma.country.upsert({
        where: {
          name: country.name,
        },
        create: {
          name: country.name,
          code: country.code,
        },
        update: {
          name: country.name,
          code: country.code,
        },
      });
    }

    console.log("Countries seed başarılı!!");
  } catch (error) {
    console.error("Error seeding countries:", error);
  }
}
