import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req, context) {
  try {
    console.log("Order ID: ", context.params.id);

    const orders = await db.orderJob.findMany({
      where: { order_id: context.params.id },
      include: {
        company: true,
        plan: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("Orders:", orders);
    return NextResponse.json(orders);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
