"use client";

import { useIndustryStore } from "@/app/job-portal-store/industry";
import { useEffect } from "react";
import IndustryCreate from "@/components/jobportal/admin/industry/IndustryCreate";
import IndustryList from "@/components/jobportal/admin/industry/IndustryList";

export default function Industries() {
  useEffect(() => {
    import("bootstrap/dist/css/bootstrap.min.css");
    import(
      "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"
    );
  }, []);

  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead">Create Industry</p>
          <IndustryCreate />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <p className="lead mb-4"> Industries name </p>
          <IndustryList />
        </div>
      </div>
    </div>
  );
}
