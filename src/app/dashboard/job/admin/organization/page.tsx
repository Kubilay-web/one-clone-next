"use client";
import OrganizationCreate from "@/components/jobportal/admin/organization/OrganizationCreate";
import OrganizationList from "@/components/jobportal/admin/organization/OrganizationList";
export default function Industries() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead">Create organization</p>
          <OrganizationCreate />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <p className="lead mb-4"> organization name </p>
          <OrganizationList />
        </div>
      </div>
    </div>
  );
}
