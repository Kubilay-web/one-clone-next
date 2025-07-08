import React from "react";
import AnswerForm from "@/components/stackoverflow/forms/AnswerForm";
import TagCard from "@/components/stackoverflow/cards/TagCard";
import Preview from "@/components/stackoverflow/editor/Preview";
import Metric from "@/components/stackoverflow/Metric";
import { formatNumbers, getTimeStamp } from "@/lib/utils";
import { redirect } from "next/navigation";
import AllAnswers from "@/components/stackoverflow/answers/AllAnswers";
import Votes from "@/components/stackoverflow/votes/Votes";

interface RouteParams {
  params: {
    id: string;
  };
}

interface Question {
  id: string;
  title: string;
  content: string;
  views: number;
  answers: number;
  createdAt: string;
  tags: { id: string; name: string }[];
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
}

interface Answer {
  id: string;
  content: string;
  upvotes: number;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
}

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = params;

  // View sayısını artır
  try {
    const incRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/forumuser/question/${id}`,
      {
        method: "PATCH",
        cache: "no-store",
      },
    );

    if (!incRes.ok) {
      console.warn("View increment failed");
    }
  } catch (e) {
    console.warn("View increment error:", e);
  }

  // Soru verisini çek
  let question: Question | null = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/forumuser/question/${id}`,
      { cache: "no-store" },
    );

    if (!res.ok) throw new Error("Failed to fetch question");

    question = await res.json();
  } catch (error) {
    return redirect("/404");
  }

  if (!question) return redirect("/404");

  // Cevapları çek
  let answers: Answer[] = [];

  let answersResult: {
    answers: Answer[];
    isNext: boolean;
    totalAnswers: number;
  } | null = null;

  let areAnswersLoaded = false;
  let answersError: string | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/forumuser/answer/${id}?page=1&pageSize=10&filter=latest`,
      { cache: "no-store" },
    );

    if (!res.ok) throw new Error("Failed to fetch answers");

    answersResult = await res.json();
    areAnswersLoaded = true;
  } catch (error) {
    console.warn("Answers fetch error:", error);
    answersError = error.message || "Unknown error";
  }

  const {
    title,
    content,
    createdAt,
    views,
    answers: answersCount,
    tags,
    user,
  } = question;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          {user ? (
            <p className="paragraph-semibold text-dark300_light700">
              by user: {user.username}
            </p>
          ) : (
            <p className="paragraph-semibold text-dark300_light700 text-red-500">
              Author not available
            </p>
          )}

          <div className="flex justify-end">
            <Votes
              upvotes={question.upvotes}
              hasupVoted={true}
              downvotes={question.downvotes}
              hasdownVoted={false}
            />
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/stackoverflow/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/stackoverflow/icons/message.svg"
          alt="message icon"
          value={answersCount}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/stackoverflow/icons/eye.svg"
          alt="View icon"
          value={formatNumbers(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      <Preview content={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagCard key={tag.id} id={tag.id} name={tag.name} compack />
        ))}
      </div>

      <section className="my-5">
        <AllAnswers
          data={answersResult?.answers ?? []} // answers dizisi veya boş dizi
          success={areAnswersLoaded && !!answersResult} // hem başarılı hem data var mı kontrolü
          error={answersError} // hata varsa geçir
          totalAnswers={answersResult?.totalAnswers ?? 0} // toplam cevap sayısı
        />
      </section>

      {/* Cevap formu */}
      <section className="my-5">
        <AnswerForm questionId={question.id} />
      </section>
    </>
  );
};

export default QuestionDetails;
