"use client";
import LanguageCreate from "@/components/jobportal/admin/language/LanguageCreate";
import LanguageList from "@/components/jobportal/admin/language/LanguageList";
export default function Industries() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead">Create Language</p>
          <LanguageCreate />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <p className="lead mb-4">Language Name </p>
          <LanguageList />
        </div>
      </div>
    </div>
  );
}
