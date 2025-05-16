// app/api/search-products/route.ts
import client from "@/lib/elasticsearch";
import { NextResponse } from "next/server";

// Ürün tipini tanımla
interface Product {
  name: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("search");

  if (!q || typeof q !== "string") {
    return NextResponse.json(
      { message: "Invalid search query" },
      { status: 400 },
    );
  }

  try {
    // Elasticsearch'e sorgu yap
    const response = await client.search<{ _source: Product }>({
      index: "products", // Elasticsearch index adı
      body: {
        query: {
          match: {
            // Arama sorgusunu kullanarak ürün ismini eşleştir
            name: q,
          },
        },
      },
    });

    // Elasticsearch yanıtından sonuçları çıkart
    const results = response.hits.hits.map((hit) => hit._source);

    // Sonuçları JSON formatında döndür
    return NextResponse.json(results);
  } catch (error: any) {
    // Hata durumunda, hata mesajını JSON formatında dön
    console.error("Error occurred while querying Elasticsearch:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred" },
      { status: 500 },
    );
  }
}
