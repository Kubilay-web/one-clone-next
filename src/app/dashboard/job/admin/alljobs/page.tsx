"use client";

import { useState, useEffect } from "react";
import { Switch } from "antd";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  slug: string;
  vacancies: string;
  min_salary: number;
  max_salary: number;
  custom_salary: number;
  deadline?: string;
  description?: string;
  status: "pending" | "active" | "inactive";
  apply_on: "app" | "email" | "custom_url";
  apply_email?: string;
  apply_url?: string;
  featured: boolean;
  highlight: boolean;
  featured_until?: string;
  highlight_until?: string;
  jobcount: number;
  total_views: number;
  address?: string;
  salary_mode: "range" | "custom";
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
    logoSecureUrl?: string;
  };
  job_category?: {
    id: string;
    name: string;
  };
  job_role?: {
    id: string;
    name: string;
  };
  job_experience?: {
    id: string;
    name: string;
  };
  education?: {
    id: string;
    name: string;
  };
  job_type?: {
    id: string;
    name: string;
  };
  salary_type?: {
    id: string;
    name: string;
  };
  city?: {
    id: string;
    name: string;
  };
  state?: {
    id: string;
    name: string;
  };
  country?: {
    id: string;
    name: string;
  };
}

export default function Alljobs() {
  const router = useRouter();
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    import("bootstrap/dist/css/bootstrap.min.css");
    import(
      "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"
    );
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/jobs/create`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data);

      // Initialize switch states
      const initialSwitchStates = data.reduce(
        (acc: Record<string, boolean>, job: Job) => {
          acc[job.id] = job.status === "active";
          return acc;
        },
        {},
      );
      setSwitchStates(initialSwitchStates);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch jobs",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/jobs/create/${jobId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      toast.success("Job deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete job",
      );
    }
  };

  const handleEdit = (jobId: string) => {
    router.push(`/dashboard/job/jobdetails/?id=${jobId}`);
  };

  const handleSwitchChange = async (checked: boolean, jobId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: checked, jobId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update job status");
      }

      setSwitchStates((prev) => ({ ...prev, [jobId]: checked }));
      toast.success(
        `Job ${checked ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update job status",
      );
      // Revert switch state on error
      setSwitchStates((prev) => ({ ...prev, [jobId]: !checked }));
    }
  };

  const getStatusBadge = (status: string, deadline?: string) => {
    if (status === "pending") {
      return <span className="badge bg-warning text-dark">Pending</span>;
    }

    const isActive = deadline ? new Date(deadline) > new Date() : false;
    return (
      <span className={`badge ${isActive ? "bg-success" : "bg-danger"}`}>
        {isActive ? "Active" : "Expired"}
      </span>
    );
  };

  const formatSalary = (job: Job) => {
    if (job.salary_mode === "range") {
      return `$${job.min_salary} - $${job.max_salary}`;
    }
    return `$${job.custom_salary}`;
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="py-4">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-12 rounded bg-white p-4 shadow">
            <div className="table-responsive">
              <table className="table-hover table">
                <thead className="table-light">
                  <tr>
                    <th>Picture</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Salary</th>
                    <th>Approve</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length > 0 ? (
                    jobs.map((job) => (
                      <tr key={job.id}>
                        <td>
                          {job.company?.logoSecureUrl && (
                            <img
                              src={job.company.logoSecureUrl}
                              alt={job.company.name}
                              className="rounded-circle me-2"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          )}
                          {job.company?.name || "N/A"}
                        </td>
                        <td>{job.title}</td>
                        <td>{job.job_category?.name || "N/A"}</td>
                        <td>
                          {job.deadline
                            ? new Date(job.deadline).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>{getStatusBadge(job.status, job.deadline)}</td>
                        <td>{formatSalary(job)}</td>
                        <td>
                          <Switch
                            checked={switchStates[job.id] || false}
                            onChange={(checked) =>
                              handleSwitchChange(checked, job.id)
                            }
                          />
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleEdit(job.id)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(job.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-4 text-center">
                        No jobs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
