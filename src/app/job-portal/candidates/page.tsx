"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "antd";
import Filter from "@/components/jobportal/candidate/Filter";
import Card from "@/components/jobportal/candidate/Card";
import "./style.css";

export default function Candidate({ searchParams }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    const searchQuery = new URLSearchParams({
      skill: searchParams.skillid || "",
      country: searchParams.countryid || "",
      state: searchParams.stateid || "",
      city: searchParams.cityid || "",
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/candidatefilters?${searchQuery}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch candidates");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
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
        <div className="position-absolute start-0 top-0 p-4 text-white">
          <h6>Home &gt; Candidate</h6>
          <h2 className="fw-bold">Browse Candidates</h2>
        </div>
      </div>

      <div className="container-fluid py-5">
        <div className="row">
          {/* Filter Section */}
          <div className="col-lg-3 mb-4">
            <Filter searchParams={searchParams} />
          </div>

          {/* Candidates List */}
          <div className="col-lg-9">
            <h4 className="fw-bold mb-4 text-center">Latest Candidates</h4>

            {loading ? (
              <Skeleton active />
            ) : data.length > 0 ? (
              <div className="row g-4">
                {data.map((ca, i) => (
                  <div className="col-12 col-md-6 col-lg-4" key={i}>
                    <Card candidat={ca} searchParams={searchParams} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="fs-5 fw-semibold py-5 text-center text-muted">
                No candidates found.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
