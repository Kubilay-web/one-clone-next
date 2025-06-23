"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "antd";
import Filter from "@/components/jobportal/searchfilter/Filter";
import Card from "@/components/jobportal/jobs/Card";
import "./style.css";

export default function Jobs({ searchParams }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect ile GET işlemi
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);

      const query = new URLSearchParams({
        minSalary: searchParams?.minSalary || "",
        maxSalary: searchParams?.maxSalary || "",
        job_category_id: searchParams?.jobcatid || "",
        country: searchParams?.countryid || "",
        state: searchParams?.stateid || "",
        city: searchParams?.cityid || "",
      });

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/searchjobs?${query}`,
          { method: "GET" },
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  return (
    <>
      {/* Hero Section */}
      <div
        className="position-relative w-100"
        style={{
          height: "30vh",
          backgroundImage: 'url("/assets/images/jobportal/dee.jpg")',
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

            {loading ? (
              <div className="row g-4">
                {[...Array(4)].map((_, i) => (
                  <div className="col-12 col-md-6" key={i}>
                    <Skeleton active />
                  </div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="row g-4">
                {jobs.map((job, index) => (
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
