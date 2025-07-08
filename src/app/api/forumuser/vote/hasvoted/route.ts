import { NextResponse } from "next/server";
import db from "@/lib/db";
import { HasVotedSchema } from "@/lib/validation";
import { validateRequest } from "@/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { targetId, targetType } = HasVotedSchema.parse(body);

    const user = await validateRequest();

    if (!user) {
      return NextResponse.json(
        { success: false, data: { hasUpvoted: false, hasDownvoted: false } },
        { status: 200 },
      );
    }

    // Kullanıcının oy verip vermediğini kontrol et
    const vote = await db.voteForum.findFirst({
      where: {
        userId: user.id,
        actionId: targetId,
        actionType: targetType,
      },
    });

    if (!vote) {
      return NextResponse.json(
        { success: false, data: { hasUpvoted: false, hasDownvoted: false } },
        { status: 200 },
      );
    }

    // Oy tipi (upvote, downvote) ile ilgili sonucu döndür
    return NextResponse.json(
      {
        success: true,
        data: {
          hasUpvoted: vote.voteType === "upvote",
          hasDownvoted: vote.voteType === "downvote",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in hasVoted:", error);
    return NextResponse.json(
      { error: "Failed to check vote status" },
      { status: 500 },
    );
  }
}
