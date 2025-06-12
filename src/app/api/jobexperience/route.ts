import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const jobExperienceIds = await db.jobexperienceId.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jobExperienceIds);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
