import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const salaryTypes = await db.salarytype.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(salaryTypes);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
