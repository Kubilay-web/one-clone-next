"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "@/app/(main)/SessionProvider";
import Link from "next/link";

export default function Candidate() {
  const { user } = useSession();
  const [profileComplete, setProfileComplete] = useState(false);
  const [applied, setApplied] = useState(0); // Başvurulan iş sayısı
  const [saved, setSaved] = useState(0); // Kaydedilen iş sayısı
  const [jobs, setJobs] = useState<any[]>([]); // İşlerin listesi

  useEffect(() => {
    checkProfileCompletion(); // Profilin tamamlanıp tamamlanmadığını kontrol et
    fetchJobs(); // Başvuru yapılmış işlerin listesini al
  }, []);

  // Profilin tamamlanıp tamamlanmadığını kontrol eden fonksiyon
  const checkProfileCompletion = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/candidate/dash`,
      );
      const data = await response.json();

      if (response.ok) {
        setProfileComplete(data.profileComplete); // Profil tamamlanmışsa, state'i güncelle
        setApplied(data.appliedjob); // Başvurulan iş sayısını güncelle
        setSaved(data.jobbookmark); // Kaydedilen iş sayısını güncelle
      } else {
        toast.error(data.error || "Failed to check profile completion");
      }
    } catch (error) {
      console.error("Error checking profile completion:", error);
    }
  };

  // Başvuru yapılan işlerin listesini çekme fonksiyonu
  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/candidate/myjob`,
      );
      const data = await response.json();

      if (response.ok) {
        setJobs(data.data || []);
      } else {
        toast.error(data.error || "Failed to fetch jobs");
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    import("bootstrap/dist/css/bootstrap.min.css");
    import(
      "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"
    );
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <p className="lead">Candidate Dashboard</p>
            <hr />
            {profileComplete ? (
              <p>Profile is complete, {user?.username}</p>
            ) : (
              <p>
                Please complete your profile, {user?.username}
                <Link
                  className="nav-link mt-2"
                  href="/dashboard/candidate/my-profile"
                >
                  🌀 Edit Profile
                </Link>
              </p>
            )}
            <hr />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Applied Jobs</h5>
                <p className="card-text">{applied} Jobs</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Saved Jobs</h5>
                <p className="card-text">{saved} Jobs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <p className="text-center">Recent Applied Jobs</p>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center h-auto">
          <div className="col bg-light p-5 shadow">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Company", "Salary", "Date", "Status", "Actions"].map(
                      (head, i) => (
                        <th
                          key={i}
                          style={{
                            padding: "12px 15px",
                            backgroundColor: "#f2f2f2",
                            fontWeight: "bold",
                            textAlign: "left",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          {head}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No jobs applied yet.
                      </td>
                    </tr>
                  ) : (
                    jobs.map((jobEntry, index) => {
                      const job = jobEntry.job;
                      const company = job.company;
                      const isActive = new Date(job.deadline) > new Date();

                      return (
                        <tr key={index} style={{ cursor: "pointer" }}>
                          <td
                            style={{
                              padding: "12px 15px",
                              borderBottom: "1px solid #ddd",
                              textAlign: "left",
                            }}
                          >
                            <img
                              src={company.logoSecureUrl}
                              alt="logo"
                              style={{
                                height: "50px",
                                width: "50px",
                                borderRadius: "50%",
                                marginBottom: "5px",
                              }}
                            />
                            <br />
                            {company.name}
                          </td>

                          <td
                            style={{
                              padding: "12px 15px",
                              borderBottom: "1px solid #ddd",
                              textAlign: "left",
                            }}
                          >
                            {job.salary_mode === "range"
                              ? `$${job.min_salary} - $${job.max_salary}`
                              : `$${job.custom_salary}`}
                          </td>

                          <td
                            style={{
                              padding: "12px 15px",
                              borderBottom: "1px solid #ddd",
                              textAlign: "left",
                            }}
                          >
                            {new Date(jobEntry.createdAt).toLocaleDateString()}
                          </td>

                          <td
                            style={{
                              padding: "12px 15px",
                              borderBottom: "1px solid #ddd",
                              textAlign: "left",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                backgroundColor: isActive
                                  ? "#4caf50"
                                  : "#f44336",
                                color: "#fff",
                              }}
                            >
                              {isActive ? "Active" : "Expired"}
                            </span>
                          </td>

                          <td
                            style={{
                              padding: "12px 15px",
                              borderBottom: "1px solid #ddd",
                              textAlign: "left",
                            }}
                          >
                            <Link
                              href={`/job-portal/company/${company.slug}`}
                              style={{
                                backgroundColor: "#007bff",
                                color: "#fff",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                textDecoration: "none",
                              }}
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
