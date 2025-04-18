// app/api/set-country/route.ts (Server Action)
"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { country } = await request.json();

    // Ülke bilgisini cookie'ye set ediyoruz
    cookies().set("userCountry", country, {
      httpOnly: false, // Client-side erişilebilir yapıyoruz
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 gün geçerli
    });

    return NextResponse.json({ message: "Country cookie set successfully!" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to set cookie" },
      { status: 500 },
    );
  }
}
