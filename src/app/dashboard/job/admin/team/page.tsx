"use client";
import TeamList from "@/components/jobportal/admin/team/TeamList";
import TeamCreate from "@/components/jobportal/admin/team/TeamCreate";
export default function Industries() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead">Create Team</p>
          <TeamCreate />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <p className="lead mb-4"> Team name </p>
          <TeamList />
        </div>
      </div>
    </div>
  );
}
