"use client";
import JobExperienceCreate from "@/components/jobportal/admin/jobexperience/JobexperienceCreate";
import JobExperienceList from "@/components/jobportal/admin/jobexperience/JobexperienceList";
export default function Industries() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead">Create job experience</p>
          <JobExperienceCreate />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <p className="lead mb-4"> job experience name </p>
          <JobExperienceList />
        </div>
      </div>
    </div>
  );
}
