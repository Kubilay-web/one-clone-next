"use client";

import { Skeleton } from "antd";
import Filter from "@/components/jobportal/searchfilter/Filter";
import Card from "@/components/jobportal/jobs/Card";
import "./style.css";

export const dynamic = "force-dynamic";

async function getJobs(searchParams) {
  const searchQuery = new URLSearchParams({
    minSalary: searchParams.minSalary || "",
    maxSalary: searchParams.maxSalary || "",
    job_category_id: searchParams.jobcatid || "",
    country: searchParams.countryid || "",
    state: searchParams.stateid || "",
    city: searchParams.cityid || "",
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/searchjobs?${searchQuery}`,
      { method: "GET" },
    );

    if (!response.ok) {
      throw new Error("Couldn't find jobs");
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("No jobs returned");
    }

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Jobs({ searchParams }) {
  const data = await getJobs(searchParams);

  if (!data) {
    return (
      <div className="my-5 p-5 text-center">
        <Skeleton active />
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div
        className="position-relative w-100"
        style={{
          height: "30vh",
          backgroundImage: 'url("/assets/images/jobprtal/dee.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="position-absolute start-0 top-0 m-4 text-white">
          <h6 className="text-light">Home &gt; Jobs</h6>
          <h2 className="fw-bold">Find Your Dream Job</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row">
          {/* Filter Sidebar */}
          <div className="col-12 col-lg-3 mb-4">
            <div className="bg-light rounded p-3 shadow-sm">
              <h5 className="mb-3">Filter Jobs</h5>
              <Filter searchParams={searchParams} />
            </div>
          </div>

          {/* Job Cards */}
          <div className="col-12 col-lg-9">
            <h3 className="mb-4">Job Search Results</h3>
            {data.length > 0 ? (
              <div className="row g-4">
                {data.map((job, index) => (
                  <div className="col-12 col-md-6" key={index}>
                    <Card jobs={job} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-5 text-center">
                <p className="text-muted">
                  No jobs found matching your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
