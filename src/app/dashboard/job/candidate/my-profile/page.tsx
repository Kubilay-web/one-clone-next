"use client";
import Navigation from "@/components/jobportal/candidate/Navigation";
import { useEffect } from "react";
export default function Profile() {
  useEffect(() => {
    import("bootstrap/dist/css/bootstrap.min.css");
    import(
      "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"
    );
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <p className="lead">Profiles</p>
          <hr />
          <Navigation />
        </div>
      </div>
    </div>
  );
}
