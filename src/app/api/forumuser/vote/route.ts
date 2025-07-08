import { NextResponse } from "next/server";
import db from "@/lib/db";
import { CreateVoteSchema } from "@/lib/validation";
import { VoteType, ActionType } from "@prisma/client";
import { validateRequest } from "@/auth";

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { targetId, targetType, voteType } = CreateVoteSchema.parse(body);

    const isUpvote = voteType === "upvote";

    // Kullanıcının daha önce aynı hedefe oy verip vermediğini kontrol et
    const existingVote = await db.voteForum.findFirst({
      where: {
        userId: user.id,
        actionId: targetId,
        actionType: targetType as ActionType,
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted on this item." },
        { status: 400 },
      );
    }

    // Transaction ile oy kaydı ve hedef güncellemesi
    await db.$transaction(async (tx) => {
      await tx.voteForum.create({
        data: {
          userId: user.id,
          actionId: targetId,
          actionType: targetType as ActionType,
          voteType: voteType as VoteType,
        },
      });

      if (targetType === "question") {
        await tx.questionForum.update({
          where: { id: targetId },
          data: {
            upvotes: isUpvote ? { increment: 1 } : undefined,
            downvotes: !isUpvote ? { increment: 1 } : undefined,
          },
        });
      } else if (targetType === "answer") {
        await tx.answerForum.update({
          where: { id: targetId },
          data: {
            upvotes: isUpvote ? { increment: 1 } : undefined,
            downvotes: !isUpvote ? { increment: 1 } : undefined,
          },
        });
      }
    });

    return NextResponse.json({ message: "Vote successful" }, { status: 200 });
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json({ error: "Vote failed" }, { status: 500 });
  }
}
