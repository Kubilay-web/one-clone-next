"use server";

import { PrismaClient } from "@prisma/client";
import { validateRequest } from "@/auth";

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
