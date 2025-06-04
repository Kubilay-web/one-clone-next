import { NextResponse } from "next/server";
import db from "@/lib/db";
import slugify from "slugify";

export async function PUT(req, context) {
  const { id } = context.params; // Extract the id from the URL params
  const body = await req.json(); // Parse the request body

  try {
    // Update the profession using Prisma
    const updatingProfession = await db.profession.update({
      where: { id }, // Match the profession by ID
      data: {
        ...body,
        slug: slugify(body.name, { lower: true }), // Generate the slug from the name
      },
    });

    return NextResponse.json(updatingProfession); // Return the updated profession
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 }); // Handle errors
  }
}

export async function DELETE(req, context) {
  const { id } = context.params; // Extract the id from the URL params

  try {
    // Delete the profession using Prisma
    const deletingProfession = await db.profession.delete({
      where: { id }, // Match the profession by ID
    });

    return NextResponse.json(deletingProfession); // Return the deleted profession data
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 }); // Handle errors
  }
}
