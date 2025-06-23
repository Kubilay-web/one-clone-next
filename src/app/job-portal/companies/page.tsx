"use client";
import { useState, useEffect } from "react";

import Filter from "@/components/jobportal/company/Filter";
import Card from "@/components/jobportal/company/Card";
import "./style.css";

export default function Companies({ searchParams }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCompanies() {
      const searchQuery = new URLSearchParams({
        organization_type_id: searchParams.organizationid || "",
        industry_type_id: searchParams.industryid || "",
        country: searchParams.countryid || "",
        state: searchParams.stateid || "",
        city: searchParams.cityid || "",
      });

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/companyfilters?${searchQuery}`,
          {
            method: "GET",
          },
        );
        if (!response.ok) throw new Error("Fetch error");

        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }

    getCompanies();
  }, [searchParams]);

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "30vh",
          backgroundImage: 'url("/assets/images/jobportal/dee.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "white",
          }}
        >
          <h6 className="text-white">Home &gt; Companies</h6>
        </div>
      </div>

      <h1>companies page</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 overflow-auto">
            <Filter searchParams={searchParams} />
          </div>
          <div className="col-lg-9">
            <h4 className="fw-bold mt-3 text-center"> Latest companies</h4>

            <div className="row">
              {loading ? (
                <p>Loading...</p>
              ) : companies && companies.length > 0 ? (
                companies.map((c, i) => (
                  <div className="col-md-4" key={i}>
                    <Card company={c} />
                  </div>
                ))
              ) : (
                <div>
                  <h5>Companies not found</h5>
                </div>
              )}
            </div>

            <br />
          </div>
        </div>
      </div>
    </>
  );
}
