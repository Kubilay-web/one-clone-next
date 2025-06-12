import { NextResponse } from "next/server";
import db from "@/lib/db";
import { validateRequest } from "@/auth";

export async function GET() {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { email: loggedInUser.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 },
      );
    }

    const company = await db.company.findFirst({
      where: { userId: user.id },
    });

    if (!company) {
      return NextResponse.json({
        profileComplete: false,
        message: "Şirket bulunamadı",
      });
    }

    const requiredFields = [
      "industryTypeId",
      "organizationTypeId",
      "teamTypeId",
      "name",
      "slug",
      "logoSecureUrl",
      "bannerSecureUrl",
      "bio",
      "vision",
      "address",
      "cityId",
      "stateId",
      "countryId",
    ];

    const profileComplete = requiredFields.every(
      (field) =>
        company[field as keyof typeof company] !== null &&
        company[field as keyof typeof company] !== "",
    );

    return NextResponse.json({ profileComplete });
  } catch (error: any) {
    console.error("API Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
