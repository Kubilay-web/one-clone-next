"use client";
import SalaryCreate from "@/components/jobportal/admin/salarytype/SalarytypeCreate";
import SalaryList from "@/components/jobportal/admin/salarytype/SalarytypeList";
export default function Industries() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead">Create Salary Type </p>
          <SalaryCreate />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <p className="lead mb-4">Salary Type Name </p>
          <SalaryList />
        </div>
      </div>
    </div>
  );
}
