import { NextResponse } from "next/server";
import db from "@/lib/db";
import handleError from "@/lib/handlers/error";
import { validateRequest } from "@/auth";

export async function POST(req: Request) {
  try {
    const { title, content, tagIds } = await req.json();

    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!title || !content || !Array.isArray(tagIds) || tagIds.length === 0) {
      return NextResponse.json(
        { error: "Eksik veya hatalı alanlar var" },
        { status: 400 },
      );
    }

    // DB'de tag isimlerine göre mevcut tagları bul
    const existingTags = await db.tagForum.findMany({
      where: { name: { in: tagIds } },
      select: { id: true, name: true },
    });

    // Eğer bazı tag isimleri DB’de yoksa, onları oluştur
    const existingTagNames = existingTags.map((t) => t.name);
    const newTagNames = tagIds.filter(
      (name) => !existingTagNames.includes(name),
    );

    // Yeni tagları oluştur
    const newTags = await Promise.all(
      newTagNames.map((name) => db.tagForum.create({ data: { name } })),
    );

    // Tüm tag ObjectId'leri al (eski + yeni)
    const allTags = [...existingTags, ...newTags];
    const tagObjectIds = allTags.map((t) => t.id);

    // Yeni soru oluştur
    const newQuestion = await db.questionForum.create({
      data: {
        title,
        content,
        UserId: user.id,
      },
    });

    // TagQuestionForum ilişkilerini ekle
    if (tagObjectIds.length > 0) {
      const tagRelations = tagObjectIds.map((tagId) => ({
        tagId,
        questionId: newQuestion.id,
      }));

      await db.tagQuestionForum.createMany({
        data: tagRelations,
      });
    }

    // Soruyu taglarla birlikte getir
    const questionWithTags = await db.questionForum.findUnique({
      where: { id: newQuestion.id },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        tagQuestions: { include: { tag: true } },
      },
    });

    return NextResponse.json(questionWithTags, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Could not create question" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, content, tagNames } = await req.json();

    if (!id || !title || !content || !Array.isArray(tagNames)) {
      return NextResponse.json(
        { error: "Eksik veya hatalı alanlar var" },
        { status: 400 },
      );
    }

    // 1. Soruyu güncelle
    await db.questionForum.update({
      where: { id },
      data: { title, content },
    });

    // 2. Eski tag ilişkilerini sil
    await db.tagQuestionForum.deleteMany({
      where: { questionId: id },
    });

    // 3. Yeni tag isimlerini kullanarak tag'leri bul veya oluştur
    const tags = await Promise.all(
      tagNames.map(async (tagName: string) => {
        return await db.tagForum.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
      }),
    );

    // 4. Yeni tag ilişkilerini oluştur
    await db.tagQuestionForum.createMany({
      data: tags.map((tag) => ({
        tagId: tag.id,
        questionId: id,
      })),
    });

    // 5. Güncellenmiş soruyu geri dön
    const updatedQuestion = await db.questionForum.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
        tagQuestions: {
          include: { tag: true },
        },
      },
    });

    return NextResponse.json(updatedQuestion, { status: 200 });
  } catch (error) {
    console.error("Soru güncellenirken hata:", error);
    return NextResponse.json({ error: "Soru güncellenemedi" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const query = searchParams.get("query") || "";
    const filter = searchParams.get("filter") || "newest";

    if (page < 1 || pageSize < 1) {
      throw new Error("Page and pageSize must be at least 1");
    }

    if (filter === "recommended") {
      return NextResponse.json(
        { success: true, data: { questions: [], isNext: false } },
        { status: 200 },
      );
    }

    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    const whereClause: any = {};

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ];
    }

    if (filter === "unanswered") {
      whereClause.answers = 0;
    }

    let orderBy: any = { createdAt: "desc" };
    if (filter === "popular") {
      orderBy = { upvotes: "desc" };
    }

    const questions = await db.questionForum.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy,
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
        tagQuestions: {
          include: { tag: true },
        },
      },
    });

    // Tag objelerini questions içine dahil et
    const questionsWithTags = questions.map((q) => ({
      ...q,
      tags: q.tagQuestions.map((tq) => tq.tag),
    }));

    const totalCount = await db.questionForum.count({ where: whereClause });
    const isNext = skip + questions.length < totalCount;

    return NextResponse.json(
      {
        success: true,
        data: { questions: questionsWithTags, isNext },
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api");
  }
}
