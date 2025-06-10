import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const states = await db.state.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(states);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
