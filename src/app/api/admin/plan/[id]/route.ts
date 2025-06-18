import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const id = context.params.id;
    const body = await req.json();

    // Prisma update
    const updatedPlan = await db.plan.update({
      where: { id },
      data: {
        ...body,
      },
    });

    return NextResponse.json(updatedPlan);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const id = context.params.id;

    const deletedPlan = await db.plan.delete({
      where: { id },
    });

    return NextResponse.json(deletedPlan);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
