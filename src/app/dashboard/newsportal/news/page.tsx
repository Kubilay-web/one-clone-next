import Link from "next/link";
import NewsContent from "@/components/newsportal/NewsContent";
import { validateRequest } from "@/auth";

const News = async () => {
  const { user } = await validateRequest();

  return (
    <div className="rounded-md bg-white">
      <div className="flex justify-between p-4">
        <h2 className="text-xl font-medium">News</h2>

        {user.role !== "ADMIN" && (
          <Link
            className="rounded-lg bg-blue-500 px-4 py-[8px] text-white hover:bg-blue-800"
            href="/dashboard/news/create"
          >
            Create News
          </Link>
        )}
      </div>
      <NewsContent />
    </div>
  );
};

export default News;
