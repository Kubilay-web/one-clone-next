"use client";
import JobCategoryCreate from "@/components/jobportal/admin/jobcategories/JobCategoriesCreate";
import JobCategoryList from "@/components/jobportal/admin/jobcategories/JobCategoriesList";
export default function Industries() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead">Create JobCategories</p>
          <JobCategoryCreate />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <p className="lead mb-4"> JobCategoriesList name </p>
          <JobCategoryList />
        </div>
      </div>
    </div>
  );
}
