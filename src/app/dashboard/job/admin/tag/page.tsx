"use client";
import TagCreate from "@/components/jobportal/admin/tag/TagCreate";
import TagList from "@/components/jobportal/admin/tag/TagList";
export default function Industries() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead">Create Tag</p>
          <TagCreate />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <p className="lead mb-4"> Tag Name </p>
          <TagList />
        </div>
      </div>
    </div>
  );
}
