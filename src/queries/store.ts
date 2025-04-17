"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {
  CountryWithShippingRatesType,
  StoreDefaultShippingType,
} from "@/lib/types";
import { ShippingRate, User } from "@prisma/client";

export interface IStore {
  id: string; // Her mağazanın benzersiz bir id'si var, 'string' türünde
  name: string; // Mağazanın adı, 'string' türünde
  description: string; // Mağaza açıklaması, 'string' türünde
  email: string; // Mağazanın e-posta adresi, 'string' türünde ve benzersiz
  phone: string; // Mağaza telefonu, 'string' türünde
  url: string; // Mağazanın URL'si, 'string' türünde ve benzersiz
  logo: string; // Mağazanın logosu (resim URL'si), 'string' türünde
  cover: string; // Mağazanın kapak fotoğrafı (resim URL'si), 'string' türünde
  status: "PENDING" | "ACTIVE" | "BANNED" | "DISABLED"; // Mağazanın durumu, üç olası değeri var
  averageRating: number; // Mağazanın ortalama puanı, 'number' türünde
  featured: boolean; // Mağaza öne çıkarılmış mı, 'boolean' türünde
  returnPolicy?: string; // İade politikası, opsiyonel bir 'string'
  defaultShippingService?: string; // Varsayılan kargo servisi, opsiyonel bir 'string'
  defaultDeliveryTimeMin?: number; // Varsayılan teslimat süresi (minimum), opsiyonel bir 'number'
  defaultDeliveryTimeMax?: number; // Varsayılan teslimat süresi (maksimum), opsiyonel bir 'number'
  createdAt: Date; // Oluşturulma tarihi, 'Date' türünde
  updatedAt: Date; // Güncellenme tarihi, 'Date' türünde
  userId: string; // İlişkili kullanıcının id'si, 'string' türünde
  user: User; // Kullanıcı modeli ile ilişkili 'User' türünde bir nesne
}

export async function upsertStore(store: IStore): Promise<IStore | null> {
  try {
    // 1. Kullanıcıyı doğrula
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthenticated."); // Kullanıcı doğrulanmamışsa hata fırlat

    // 2. Kullanıcının rolünü kontrol et
    if (user.role !== "SELLER") {
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry.",
      ); // Eğer kullanıcı satıcı değilse, izin verilmiyor
    }

    // 3. Mağaza verisini kontrol et
    if (!store) throw new Error("Please provide store data."); // Mağaza verisi sağlanmadıysa hata fırlat

    // 4. Veritabanında aynı isim, email veya URL'ye sahip mağaza olup olmadığını kontrol et
    const existingStore = await prisma.store.findFirst({
      where: {
        AND: [
          {
            OR: [
              { name: store.name },
              { email: store.email },
              { phone: store.phone },
              { url: store.url },
            ],
          },
          {
            NOT: {
              id: store.id,
            },
          },
        ],
      },
    });

    if (existingStore) {
      let errorMessage = "";
      // Aynı isim, email, telefon veya URL'ye sahip bir mağaza varsa hata mesajı oluştur
      if (existingStore.name === store.name) {
        errorMessage = "A store with the same name already exists.";
      } else if (existingStore.email === store.email) {
        errorMessage = "A store with the same email already exists.";
      } else if (existingStore.phone === store.phone) {
        errorMessage = "A store with the same phone number already exists.";
      } else if (existingStore.url === store.url) {
        errorMessage = "A store with the same URL already exists.";
      }
      throw new Error(errorMessage); // Hata mesajını fırlat
    }

    // 5. Mağazayı güncelle veya yeni mağaza oluştur
    const result = await prisma.store.upsert({
      where: { id: store.id },
      update: {
        name: store.name,
        description: store.description,
        email: store.email,
        phone: store.phone,
        url: store.url,
        logo: store.logo,
        cover: store.cover,
        status: store.status,
        averageRating: store.averageRating,
        featured: store.featured,
        returnPolicy: store.returnPolicy,
        defaultShippingService: store.defaultShippingService,
        defaultDeliveryTimeMin: store.defaultDeliveryTimeMin,
        defaultDeliveryTimeMax: store.defaultDeliveryTimeMax,
        updatedAt: new Date(), // Güncellenme tarihini ayarla
      },
      create: {
        id: store.id, // Yeni mağaza oluşturulacaksa, id'yi ver
        name: store.name,
        description: store.description,
        email: store.email,
        phone: store.phone,
        url: store.url,
        logo: store.logo,
        cover: store.cover,
        status: store.status,
        featured: store.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user.id,
      },
    });

    return result; // Güncellenmiş veya yeni mağazayı geri döndür
  } catch (error) {
    console.error("Something went wrong:", error); // Hata durumunda log tut
    throw error; // Hata fırlat
  }
}

export const getStoreDefaultShippingDetails = async (storeUrl: string) => {
  try {
    if (!storeUrl) throw new Error("Store URL is required");

    const store = await prisma.store.findUnique({
      where: {
        url: storeUrl,
      },
      select: {
        defaultShippingService: true,
        defaultShippingFeePerItem: true,
        defaultShippingFeeForAdditionalItem: true,
        defaultShippingFeePerKg: true,
        defaultShippingFeeFixed: true,
        defaultDeliveryTimeMin: true,
        defaultDeliveryTimeMax: true,
        returnPolicy: true,
      },
    });

    if (!store) throw new Error("Store not found");

    return store;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateStoreDefaultShippingDetails = async (
  storeUrl: string,
  details: StoreDefaultShippingType,
) => {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthenticated."); // Kullanıcı doğrulanmamışsa hata fırlat

    // 2. Kullanıcının rolünü kontrol et
    if (user.role !== "SELLER") {
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry.",
      ); // Eğer kullanıcı satıcı değilse, izin verilmiyor
    }

    if (!storeUrl) throw new Error("Store URL is required.");

    if (!details) {
      throw new Error("No shipping details provided to update.");
    }

    const check_ownership = await prisma.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });

    if (!check_ownership)
      throw new Error("Make sure you have the permissions update this store.");

    const updatedStore = await prisma.store.update({
      where: {
        url: storeUrl,
        userId: user.id,
      },
      data: details,
    });

    return updatedStore;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getStoreShippingRates = async (storeUrl: string) => {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthenticated.");

    if (user.role !== "SELLER") {
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry.",
      );
    }

    if (!storeUrl) throw new Error("Store URL is required.");

    const store = await prisma.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });

    if (!store) {
      throw new Error(
        "Make sure you have the permissions to access this store.",
      );
    }

    const [countries, shippingRates] = await Promise.all([
      prisma.country.findMany({
        orderBy: {
          name: "asc",
        },
      }),
      prisma.shippingRate.findMany({
        where: {
          storeId: store.id,
        },
      }),
    ]);

    const rateMap = new Map();
    shippingRates.forEach((rate) => {
      rateMap.set(rate.countryId, rate);
    });

    const result = countries.map((country) => ({
      countryId: country.id,
      countryName: country.name,
      shippingRate: rateMap.get(country.id) || null,
    }));

    return result;
  } catch (error) {
    console.error("Error retrieving store shipping rates:", error);
    throw error;
  }
};

export const upsertShippingRate = async (
  storeUrl: string,
  shippingRate: ShippingRate,
) => {
  try {
    // 1. Kullanıcıyı doğrula
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthenticated.");

    // 2. Kullanıcının rolünü kontrol et
    if (user.role !== "SELLER") {
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry.",
      );
    }

    // 3. Mağaza sahipliğini kontrol et
    const store = await prisma.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });

    if (!store) {
      throw new Error(
        "Make sure you have the permissions to update this store.",
      );
    }

    // 4. Gönderi verilerini kontrol et
    if (!shippingRate) throw new Error("Please provide shipping rate data.");
    if (!shippingRate.countryId)
      throw new Error("Please provide a valid country ID.");

    // 5. Geçersiz alanları ayıkla (id, createdAt, updatedAt)
    const { id, createdAt, updatedAt, ...cleanedRate } = shippingRate;

    // 6. Upsert işlemi
    const shippingRateDetails = await prisma.shippingRate.upsert({
      where: {
        id: id, // id create ve where içinde kullanılabilir
      },
      update: {
        ...cleanedRate,
        storeId: store.id,
      },
      create: {
        ...cleanedRate,
        id, // sadece create içinde kullanılır
        storeId: store.id,
      },
    });

    return shippingRateDetails;
  } catch (error) {
    console.error("Error upserting shipping rate:", error);
    throw error;
  }
};
