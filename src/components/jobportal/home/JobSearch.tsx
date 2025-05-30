// JobSearchForm.js
"use client";
import { useEffect, useState } from "react";

export default function JobSearchForm() {
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ industry, location, keyword });
  };

  useEffect(() => {
    import("bootstrap/dist/css/bootstrap.min.css");
    import(
      "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"
    );
  }, []);
  return (
    <form onSubmit={handleSubmit} className="job-search-form">
      <div className="form-group-job">
        <label htmlFor="industry">Industry:</label>
        <input
          type="text"
          id="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="form-group-job">
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="form-group-job">
        <label htmlFor="keyword">Keyword:</label>
        <input
          type="text"
          id="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="input-field"
        />
      </div>
      <button
        type="submit"
        className="submit-button-job"
        style={{
          textAlign: "center",
          color: "white",
          backgroundColor: "green",
          fontSize: "15px",
          fontWeight: "bold",
          letterSpacing: "1px",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
          padding: "11px",
        }}
      >
        Search
      </button>
    </form>
  );
}
