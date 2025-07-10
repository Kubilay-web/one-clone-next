import TagCard from "@/components/stackoverflow/cards/TagCard";
import DataRenderer from "@/components/stackoverflow/DataRenderer";
import LocalSearch from "@/components/stackoverflow/search/LocalSearch";
import CommonFilter from "@/components/stackoverflow/filters/CommonFilter";
import { TagFilters } from "@/constants/filter";
import ROUTES from "@/constants/routes";
import { EMPTY_TAGS } from "@/constants/states";
import Pagination from "@/components/stackoverflow/Pagination";

const Tags = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = searchParams;

  const search = new URLSearchParams({
    page: String(page || 1),
    pageSize: String(pageSize || 10),
    query: query || "",
    filter: filter || "popular",
  });

  let success = false;
  let error = "";
  let tags = [];
  let isNext = false;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/forumuser/tags?${search.toString()}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const result = await res.json();
      throw new Error(result?.message || "Failed to fetch tags");
    }

    const result = await res.json();
    success = result.success;
    tags = result.data?.tags || [];
    isNext = result.data?.isNext;
  } catch (err: any) {
    error = err.message;
  }

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>

      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAGS}
          imgSrc="/assets/stackoverflow/icons/search.svg"
          placeholder="Search Tags..."
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={tags}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {tags.map((tag) => (
              <TagCard key={tag.id} id={tag.id} {...tag} />
            ))}
          </div>
        )}
      />

      <Pagination page={page} isNext={isNext} />
    </>
  );
};

export default Tags;
