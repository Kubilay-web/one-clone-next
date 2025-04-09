"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

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
  defaultShippingFees?: number; // Varsayılan kargo ücreti, opsiyonel bir 'number'
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
        defaultShippingFees: store.defaultShippingFees,
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
