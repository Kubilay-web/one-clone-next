import { NextResponse } from "next/server";
import db from "@/lib/db";
import { validateRequest } from "@/auth";

export async function GET() {
  const { user } = await validateRequest();

  if (!user?.email) {
    return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
  }

  try {
    // Kullanıcıyı bul
    const users = await db.user.findUnique({
      where: { email: user.email },
    });

    if (!users) {
      return NextResponse.json({ err: "User not found" }, { status: 404 });
    }

    // Adayı bul
    const candidate = await db.candidate.findFirst({
      where: { userId: user.id },
    });

    if (!candidate) {
      return NextResponse.json({ err: false }); // profil tamamlanmamış gibi davran
    }

    // Başvuru ve kaydedilen iş sayılarını al
    const appliedjob = await db.applyjob.count({
      where: { candidate_id: candidate.id },
    });

    const jobbookmark = await db.jobbookmark.count({
      where: { candidate_id: candidate.id },
    });

    // Profil tam mı?
    const profileComplete = Object.values(candidate).every(
      (field) => field !== undefined && field !== "",
    );

    return NextResponse.json({ profileComplete, jobbookmark, appliedjob });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
