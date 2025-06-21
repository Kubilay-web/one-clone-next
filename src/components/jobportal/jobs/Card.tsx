"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import moment from "moment";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaBookmark, FaRegBookmark } from "react-icons/fa";

export default function JobsCard({ jobs }) {
  const router = useRouter();
  const id = jobs?.id;
  const [skills, setSkills] = useState([]);
  const [jobBookmark, setJobBookmark] = useState([]);

  useEffect(() => {
    if (id) {
      fetchSkills();
      fetchBookmarks();
    }
  }, [id]);

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${process.env.API}/api/searchjobs/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) setSkills(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await fetch(`${process.env.API}/api/bookmark`, {
        method: "GET",
      });
      const data = await res.json();
      if (res.ok) setJobBookmark(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await fetch(`${process.env.API}/api/candidate/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: jobs?.id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Bookmarked");
        fetchBookmarks();
      } else toast.error(data.err);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnbookmark = async () => {
    try {
      const res = await fetch(`${process.env.API}/api/candidate/unbookmark`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: jobs?.id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Removed from bookmarks");
        fetchBookmarks();
      } else toast.error(data.err);
    } catch (err) {
      console.error(err);
    }
  };

  const isBookmarked = jobBookmark?.some((item) => item?.job_id === jobs?.id);

  const handleClick = () => {
    router.push(`/job/?slug=${jobs?.slug}`);
  };

  useEffect(() => {
    import("bootstrap/dist/css/bootstrap.min.css");
    import(
      "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"
    );
  }, []);

  return (
    <div className="card mb-4 rounded border-0 p-3 shadow-sm">
      <div className="row g-3">
        <div className="col-md-2 d-flex align-items-start justify-content-center">
          <img
            src={jobs?.company_id?.logo?.secure_url || "/default-logo.png"}
            alt="Company Logo"
            className="img-fluid rounded-circle border"
            style={{ width: "60px", height: "60px", objectFit: "cover" }}
          />
        </div>

        <div className="col-md-8">
          <Link
            href={`/company/${jobs?.company_id?.slug}`}
            className="text-decoration-none text-dark"
          >
            <h5 className="fw-bold mb-1">{jobs?.company_id?.name}</h5>
          </Link>

          <p className="mb-1 text-muted">
            <FaMapMarkerAlt className="me-1" />
            {jobs?.country?.name || "Unknown"}
          </p>

          <h6
            className="fw-semibold mb-2 text-primary"
            role="button"
            onClick={handleClick}
          >
            {jobs?.title}
          </h6>

          <div className="d-flex mb-2 flex-wrap">
            <span className="me-3 text-muted">
              <strong>Type:</strong> {jobs?.job_type_id?.name}
            </span>
            <span className="me-3 text-muted">
              <strong>Experience:</strong> {jobs?.jobexperienceid?.name}
            </span>
            <span className="me-3 text-muted">
              <strong>Posted:</strong> {moment(jobs?.createdAt).fromNow()}
            </span>
          </div>

          <div className="d-flex mt-2 flex-wrap gap-2">
            {skills.flatMap((skillItem) =>
              skillItem?.skill_id?.map((s) => (
                <span
                  key={s?.id}
                  className="badge bg-success text-light rounded-pill"
                >
                  {s?.name}
                </span>
              )),
            )}
          </div>

          <div className="text-dark mt-3">
            <strong>Salary: </strong>
            {jobs?.salary_mode === "custom" ? (
              <>${jobs?.custom_salary} /hr</>
            ) : (
              <>
                ${jobs?.min_salary} - ${jobs?.max_salary} /hr
              </>
            )}
          </div>
        </div>

        <div className="col-md-2 d-flex flex-column justify-content-between align-items-end">
          <div className="d-flex gap-2">
            {jobs?.featured && (
              <span className="badge bg-primary">Featured</span>
            )}
            {jobs?.highlight && (
              <span className="badge bg-warning text-dark">Highlight</span>
            )}
          </div>

          <button
            className="btn btn-outline-primary btn-sm mt-3"
            onClick={isBookmarked ? handleUnbookmark : handleBookmark}
          >
            {isBookmarked ? (
              <>
                <FaBookmark className="me-1" /> Unbookmark
              </>
            ) : (
              <>
                <FaRegBookmark className="me-1" /> Bookmark
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
