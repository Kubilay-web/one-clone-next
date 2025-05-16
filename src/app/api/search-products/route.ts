// pages/api/search-products.ts
import client from "@/lib/elasticsearch";
import { NextResponse } from "next/server";

interface Product {
  name: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("search");

  if (!q || typeof q !== "string") {
    return NextResponse.json(
      { message: "Geçersiz arama sorgusu" },
      { status: 400 },
    );
  }

  try {
    const response = await client.search<{ _source: Product }>({
      index: "products",
      body: {
        query: {
          match: {
            name: q,
          },
        },
      },
    });

    const results = response.hits.hits.map((hit) => hit._source);
    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Elasticsearch hatası:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
