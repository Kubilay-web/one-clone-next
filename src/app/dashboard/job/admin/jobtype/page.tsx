"use client";
import JobtypeCreate from "@/components/jobportal/admin/jobtype/JobtypeCreate";
import JobtypeList from "@/components/jobportal/admin/jobtype/JobtypeList";
export default function Industries() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead">Create Jobtype</p>
          <JobtypeCreate />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <p className="lead mb-4"> Jobtype Name </p>
          <JobtypeList />
        </div>
      </div>
    </div>
  );
}
