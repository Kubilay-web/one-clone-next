"use client";
import { useState, useEffect } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { Skeleton } from "antd";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGraduationCap,
  FaMoneyBillWave,
  FaAddressCard,
} from "react-icons/fa";
import { MdDateRange, MdMoreTime, MdWork } from "react-icons/md";
import { ShareSocial } from "react-share-social";
import { IoFileTrayFullSharp } from "react-icons/io5";
import { TbCategoryPlus } from "react-icons/tb";
import { GrUserExpert } from "react-icons/gr";
import { LiaCriticalRole } from "react-icons/lia";
import Link from "next/link";

export default function Job({ searchParams }) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);
  const [job, setJob] = useState(null);
  const [count, setCount] = useState(0);
  const [tag, setTag] = useState([]);
  const [skills, setSkills] = useState([]);
  const [already, setAlready] = useState(false);
  const slug = searchParams.slug;

  useEffect(() => {
    if (!slug) return;
    fetchJobData();
    fetchJobApplyStatus();
  }, [slug]);

  useEffect(() => {
    if (typeof window !== "undefined") setUrl(window.location.href);
  }, []);

  async function fetchJobData() {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/job/${slug}`,
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.err || "Failed to fetch job data");
      } else {
        setJob(data.job);
        setCount(data.openjobs || 0);
        setTag(data.tag || []);
        setSkills(data.skills || []);
      }
    } catch {
      toast.error("An error occurred");
    }
    setLoading(false);
  }

  async function fetchJobApplyStatus() {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobapplycheck/${slug}`,
      );
      const data = await res.json();
      if (res.ok) setAlready(data.alreadyexits || false);
    } catch {}
    setLoading(false);
  }

  async function handleApply() {
    if (!job?.id) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobapply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: job.id }),
        },
      );
      const data = await res.json();
      if (!res.ok) toast.error(data.err || "Failed to apply");
      else {
        toast.success("Applied successfully");
        setAlready(true);
      }
    } catch {
      toast.error("An error occurred");
    }
    setLoading(false);
  }

  if (loading || !job) {
    return (
      <div className="mx-auto my-10 max-w-5xl p-10 text-center">
        <Skeleton active />
      </div>
    );
  }

  return (
    <>
      <div
        className="relative h-[30vh] w-full bg-cover bg-center"
        style={{ backgroundImage: 'url("/assets/images/jobportal/dee.jpg")' }}
      >
        <div className="absolute left-5 top-5 text-sm text-white">
          Home &gt; Job
        </div>
      </div>

      <section className="mx-auto my-12 max-w-5xl px-4 sm:px-6 lg:px-8">
        <img
          src={job.company?.bannerSecureUrl}
          alt="Banner"
          className="mx-auto h-[40vh] w-4/5 rounded-lg object-cover shadow-md"
        />
        <h1 className="mb-8 mt-6 text-center text-3xl font-semibold">
          {job.title}
        </h1>

        <div className="mx-auto mb-10 flex max-w-4xl flex-col justify-between gap-8 md:flex-row">
          <div className="space-y-3 text-lg font-semibold">
            <p className="flex items-center text-green-600">
              <IoFileTrayFullSharp className="mr-2 text-2xl" />
              {job.job_type?.name}
            </p>
            <p className="flex items-center text-green-600">
              <GrUserExpert className="mr-2 text-2xl" />
              {job.job_experience?.name}
            </p>
            <p
              className="flex items-center text-green-600"
              suppressHydrationWarning
            >
              <MdMoreTime className="mr-2 text-2xl" />
              {moment(job.createdAt).format("MMMM YYYY, h:mm:ss a")}
            </p>
          </div>

          <div className="flex flex-col items-end">
            {!already ? (
              <button
                onClick={handleApply}
                disabled={loading}
                className="rounded bg-blue-600 px-8 py-3 font-bold text-white shadow transition duration-300 hover:bg-blue-700 disabled:opacity-50"
              >
                Apply
              </button>
            ) : (
              <span className="cursor-default select-none rounded bg-gray-400 px-8 py-3 font-bold text-white">
                Applied
              </span>
            )}
          </div>
        </div>

        <hr className="mx-auto mb-6 max-w-4xl" />

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          <article className="rounded-lg border bg-white p-6 shadow-sm md:col-span-2">
            <h2 className="mb-6 rounded bg-gray-100 py-2 text-center text-xl font-semibold">
              Employment Information
            </h2>

            <div className="grid grid-cols-1 gap-6 rounded border p-4 sm:grid-cols-2">
              <div className="space-y-4">
                <p>
                  <TbCategoryPlus className="mr-2 inline text-lg text-green-600" />
                  <span className="font-semibold">Category:</span>{" "}
                  {job.job_category?.name}
                </p>
                <p>
                  <FaMoneyBillWave className="mr-2 inline text-lg text-green-600" />
                  <span className="font-semibold">Salary:</span>{" "}
                  {job.salary_mode === "custom"
                    ? `$${job.custom_salary}`
                    : `$${job.min_salary} - $${job.max_salary}`}
                </p>
                <p>
                  <MdWork className="mr-2 inline text-lg text-green-600" />
                  <span className="font-semibold">Job Type:</span>{" "}
                  {job.job_type?.name}
                </p>
                <p>
                  <FaGraduationCap className="mr-2 inline text-lg text-green-600" />
                  <span className="font-semibold">Education:</span>{" "}
                  {job.education?.name}
                </p>

                <p>
                  <FaGraduationCap className="mr-2 inline text-lg text-green-600" />
                  <span className="font-semibold">Skills:</span>{" "}
                  {skills.map((s) => (
                    <span
                      key={s.id}
                      className="inline-block cursor-pointer rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 hover:bg-green-200"
                    >
                      {s.skill.name}
                    </span>
                  ))}
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  <LiaCriticalRole className="mr-2 inline text-lg text-green-600" />
                  <span className="font-semibold">Job Role:</span>{" "}
                  {job.job_role?.name}
                </p>
                <p>
                  <MdDateRange className="mr-2 inline text-lg text-green-600" />
                  <span className="font-semibold">Experience:</span>{" "}
                  {job.job_experience?.name}
                </p>
                <p>
                  <MdDateRange className="mr-2 inline text-lg text-green-600" />
                  <span className="font-semibold">Deadline:</span>{" "}
                  {moment(job.deadline).format("DD MMMM YYYY")}
                </p>
                <p>
                  <FaAddressCard className="mr-2 inline text-lg text-green-600" />
                  <span className="font-semibold">Location:</span> {job.address}
                  , {job.city?.name}, {job.state?.name} {job.country?.name}
                </p>
              </div>
            </div>

            <hr className="my-6" />

            <div
              className="prose max-w-none rounded bg-gray-100 p-6"
              dangerouslySetInnerHTML={{
                __html: job.description?.replace(/\./g, "<br/><br/>"),
              }}
            />

            <p className="mt-8 font-bold text-gray-700">{job.company?.name}</p>

            <hr className="my-6" />

            <div className="flex items-center justify-between">
              <button className="rounded bg-blue-600 px-6 py-2 font-bold text-white shadow transition duration-300 hover:bg-blue-700">
                Save Job
              </button>

              <ShareSocial
                url={url}
                style={{ display: "flex", gap: 10 }}
                socialTypes={["facebook", "twitter", "linkedin", "email"]}
              />
            </div>
          </article>

          <aside className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-b pb-2 text-xl font-bold">
              Contact Information
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-lg text-green-600" />
                {job.address}, {job.city?.name}, {job.state?.name}{" "}
                {job.country?.name}
              </p>
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="text-lg text-green-600" />
                {job.company.phone}
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-lg text-green-600" />
                {job.company.email}
              </p>
              <p className="flex items-center gap-2">
                <MdDateRange className="text-lg text-green-600" />
                Published: {moment(job.createdAt).format("DD MMM YYYY")}
              </p>
            </div>
          </aside>
        </div>

        {job.videoUrl && (
          <div className="mx-auto my-10 max-w-5xl">
            <div className="relative" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={job.videoUrl}
                title="Video"
                className="absolute left-0 top-0 h-full w-full rounded"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <div className="mx-auto my-12 flex max-w-5xl flex-wrap gap-2">
          {tag.map((t) => (
            <span
              key={t.id}
              className="inline-block cursor-pointer rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 hover:bg-green-200"
            >
              #{t.tag.name}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
