"use client";
import CityCreate from "@/components/jobportal/admin/city/CityCreate";
import CityList from "@/components/jobportal/admin/city/CityList";
export default function Industries() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead">City Create</p>
          <CityCreate />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <p className="lead mb-4">City List Name </p>
          <CityList />
        </div>
      </div>
    </div>
  );
}
