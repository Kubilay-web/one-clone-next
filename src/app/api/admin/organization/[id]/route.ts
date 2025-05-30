import { NextResponse } from "next/server";
import slugify from "slugify";
import db from "@/lib/db";

// PUT: Update organization
export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const body = await req.json();

    const updatedOrganization = await db.organization.update({
      where: { id },

      data: {
        name: body.name,
        slug: slugify(body.name, { lower: true }),
      },
    });

    return NextResponse.json(updatedOrganization);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove organization
export async function DELETE(_: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    const deletedOrganization = await db.organization.delete({
      where: { id },
    });

    return NextResponse.json(deletedOrganization);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
