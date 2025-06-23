"use client";
import { MdLocationOn } from "react-icons/md";
import { FaIndustry } from "react-icons/fa";
import moment from "moment";
import React, { useRef, useState, useEffect } from "react";

export default function CandidateViewPage({ params }) {
  const sectionRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    candidate: null,
    professions: [],
    skills: [],
    languages: [],
    experiences: [],
    education: [],
  });

  useEffect(() => {
    async function fetchCandidate() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/candidat/${params.slug}`,
        );
        if (!response.ok) throw new Error("Failed to fetch candidate");
        const result = await response.json();
        setData({
          candidate: result.candidate,
          professions: result.professions || [],
          skills: result.skills || [],
          languages: result.languages || [],
          experiences: result.experiences || [],
          education: result.education || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCandidate();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="spinner-border text-green-600" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  const { candidate, professions, skills, languages, experiences, education } =
    data;

  if (!candidate)
    return <div className="py-10 text-center">Candidate not found</div>;

  return (
    <div className="mb-5 min-h-screen bg-gray-50">
      <div
        className="relative h-[45vh] bg-cover bg-center"
        style={{ backgroundImage: 'url("/assets/images/jobportal/dee.jpg")' }}
      >
        <div className="absolute left-5 top-5 text-sm text-white">
          Home &gt; Candidate &gt; {params.slug}
        </div>
      </div>

      <div className="mt-5 border-b-2 border-green-500 bg-white py-3 text-center text-xl font-bold uppercase tracking-wide shadow-sm">
        Candidate Profile
      </div>

      {/* Profile section */}
      <div className="container mx-auto my-8 items-center justify-between px-4 md:flex">
        <div className="flex flex-col items-center md:items-start">
          <img
            src={candidate.image_secure_url}
            alt="Candidate"
            className="h-32 w-32 rounded-lg object-cover"
          />
          <div className="mt-3 text-center">
            <div className="text-xl font-semibold">{candidate.full_name}</div>
            <div className="text-gray-600">{candidate.title}</div>
          </div>
        </div>
        <a
          href={candidate.cv}
          download="resume.pdf"
          className="mt-4 inline-block rounded bg-green-600 px-6 py-2 font-semibold text-white transition hover:bg-green-700 md:mt-0"
        >
          Open CV
        </a>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left (Main content) */}
          <div className="space-y-8 md:col-span-2">
            <section>
              <h3 className="text-center text-lg font-bold">Biography</h3>
              <p
                className="mt-2 text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: candidate?.bio?.replace(/\./g, "<br/><br/>") || "",
                }}
              />
            </section>

            <section>
              <h3 className="text-center text-lg font-bold">
                Professional Skills
              </h3>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-center text-lg font-bold">Experience</h3>
              {experiences.map((exp, i) => (
                <div key={i} className="mb-4 border-b border-green-200 pb-4">
                  <p className="font-semibold">
                    {exp.designation} @ {exp.company}
                  </p>
                  <p className="text-sm text-gray-600">{exp.department}</p>
                  <p
                    className="mt-1 text-sm"
                    dangerouslySetInnerHTML={{
                      __html:
                        exp?.responsibilities?.replace(/\./g, "<br/><br/>") ||
                        "",
                    }}
                  />
                  <p className="mt-1 text-sm text-gray-600">
                    {new Date(exp.start).toLocaleDateString()} -{" "}
                    {exp.currently_working
                      ? "Present"
                      : new Date(exp.end).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </section>

            <section>
              <h3 className="text-center text-lg font-bold">Education</h3>
              {education.map((edu, i) => (
                <div key={i} className="mb-4 border-b border-green-200 pb-4">
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-sm text-gray-600">{edu.level}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(edu.year).toLocaleDateString()}
                  </p>
                  <p
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: edu.notes?.replace(/\./g, "<br/><br/>") || "",
                    }}
                  />
                </div>
              ))}
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="rounded bg-white p-4 shadow">
              <h4 className="mb-2 text-lg font-semibold">Overview</h4>
              <p className="text-gray-800">{candidate.full_name}</p>
              <div className="mt-2 flex items-center">
                <MdLocationOn className="text-green-600" />
                <span className="ml-2 text-gray-700">
                  {candidate?.country?.name}
                </span>
              </div>
              <div className="mt-2 flex items-center">
                <FaIndustry className="mr-2 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Experience Level</p>
                  <p className="text-sm text-gray-600">
                    {candidate?.experience_lable}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded bg-white p-4 shadow">
              <h4 className="mb-2 text-lg font-semibold">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded bg-white p-4 shadow">
              <h4 className="mb-2 text-lg font-semibold">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {languages.map((l, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded bg-white p-4 shadow">
              <h4 className="mb-2 text-lg font-semibold">Profession</h4>
              <div className="flex flex-wrap gap-2">
                {professions.map((p, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded bg-white p-4 shadow">
              <h4 className="mb-2 text-lg font-semibold">Personal Info</h4>
              <p>
                <strong>DOB:</strong>{" "}
                {moment(candidate?.birth_date).format("MMMM YYYY")}
              </p>
              <p>
                <strong>Gender:</strong> {candidate?.gender}
              </p>
              <p>
                <strong>Marital Status:</strong> {candidate?.marital_status}
              </p>
            </div>

            <div ref={sectionRef} className="rounded bg-white p-4 shadow">
              <h4 className="mb-2 text-lg font-semibold">Address</h4>
              <p>
                {candidate.address}, {candidate?.state?.statename},{" "}
                {candidate?.country?.name}
              </p>
              <p>
                <strong>Phone:</strong> {candidate.phone_one},{" "}
                {candidate.phone_two}
              </p>
              <p>
                <strong>Email:</strong> {candidate.email}
              </p>
            </div>

            <button className="w-full rounded bg-green-600 px-4 py-2 font-bold text-white transition hover:bg-green-700">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
