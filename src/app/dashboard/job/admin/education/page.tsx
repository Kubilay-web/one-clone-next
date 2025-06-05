"use client";
import EducationCreate from "@/components/jobportal/admin/education/EducationCreate";
import EducationList from "@/components/jobportal/admin/education/EducationList";
export default function Industries() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead">Education Skill</p>
          <EducationCreate />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <p className="lead mb-4"> Education Name </p>
          <EducationList />
        </div>
      </div>
    </div>
  );
}
