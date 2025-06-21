import { NextResponse } from "next/server";
import db from "@/lib/db";
import { validateRequest } from "@/auth";

export async function GET() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Kullanıcıyı email ile bul
    const users = await db.user.findUnique({
      where: { email: user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Şirketi userId üzerinden bul
    const company = await db.company.findUnique({
      where: { userId: user.id },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // 3. Şirket profili tam mı kontrol et
    const profileComplete = Object.values(company).every(
      (val) => val !== null && val !== "",
    );

    // 4. Pending job sayısı
    const pendingjob = await db.jobs.count({
      where: {
        companyId: company.id,
        status: "pending",
      },
    });

    // 5. Order sayısı
    const orders = await db.orderJob.count({
      where: {
        company_id: company.id,
      },
    });

    return NextResponse.json({
      profileComplete,
      pendingjob,
      orders,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
