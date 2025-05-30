"use client";
import CountryCreate from "@/components/jobportal/admin/country/CountryCreate";
import CountryList from "@/components/jobportal/admin/country/CountryList";
export default function Industries() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead">Country Create</p>
          <CountryCreate />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <p className="lead mb-4"> Country List name </p>
          <CountryList />
        </div>
      </div>
    </div>
  );
}
