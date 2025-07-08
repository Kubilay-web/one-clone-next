import QuestionCard from "@/components/stackoverflow/cards/QuestionCard";
import DataRenderer from "@/components/stackoverflow/DataRenderer";
import HomeFilter from "@/components/stackoverflow/filters/HomeFilter";
import LocalSearch from "@/components/stackoverflow/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import Link from "next/link";
import React from "react";

interface Question {
  id: string;
  title: string;
  content: string;
  tags: { id: string; name: string }[];
  user: { id: string; username: string; avatarUrl: string };
  upvotes: number;
  answers: number;
  views: number;
  createdAt: Date;
}

interface HomeProps {
  searchParams: { [key: string]: string | undefined };
}

const Home = async ({ searchParams }: HomeProps) => {
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const query = searchParams.query || "";
  const filter = searchParams.filter || "";

  // ✅ searchParams objesini URLSearchParams formatına çevir
  const queryParams = new URLSearchParams();

  if (query) queryParams.set("query", query);
  if (filter) queryParams.set("filter", filter);
  queryParams.set("page", page.toString());
  queryParams.set("pageSize", pageSize.toString());

  // ✅ API isteği
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/forumuser/question?${queryParams.toString()}`,
    { cache: "no-store" },
  );

  const result = await res.json();
  const { success, data, error } = result;
  const { questions } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient !text-light-900 min-h-[46px] px-4 py-3"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>

      <section className="mt-11">
        <LocalSearch
          route="/forum"
          imgSrc="/assets/stackoverflow/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>

      <HomeFilter />

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions: Question[]) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Home;
