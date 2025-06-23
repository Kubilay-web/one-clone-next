"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { MdLocationOn, MdEmail } from "react-icons/md";
import { FaIndustry, FaPhone, FaAddressCard } from "react-icons/fa";
import { CgOrganisation } from "react-icons/cg";
import { RiTeamLine } from "react-icons/ri";
import moment from "moment";
import JobsCard from "@/components/jobportal/jobs/Card";

export default function CompanyViewPage() {
  const params = useParams();
  const sectionRef = useRef(null);

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // GET company
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/company/${params.slug}`,
          {
            method: "GET",
            next: { revalidate: 1 },
          },
        );
        if (!res.ok) throw new Error("Failed to fetch company");

        const data = await res.json();
        setCompany(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCompany(false);
      }
    };

    if (params?.slug) {
      fetchCompany();
    }
  }, [params?.slug]);

  // POST job (after company is loaded)
  useEffect(() => {
    const fetchJobs = async () => {
      if (!company?.id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/companyjob`,
          {
            method: "POST",
            next: { revalidate: 1 },
            body: JSON.stringify({ id: company.id }),
          },
        );
        if (!res.ok) throw new Error("Failed to fetch jobs");

        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, [company?.id]);

  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loadingCompany) return <div>Loading company info...</div>;

  if (!company) return <div>Company not found.</div>;

  console.log("jobs-->", jobs);

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "50vh",
          backgroundImage: 'url("/assets/images/jobportal/dee.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "white",
          }}
        >
          <h6 className="text-white">Home &gt; Company &gt; {company.name}</h6>
        </div>
      </div>

      <div style={{ margin: "50px" }}>
        <img
          src={company.bannerSecureUrl}
          alt="Banner"
          style={{
            height: "40vh",
            width: "80%",
            objectFit: "cover",
            margin: "auto",
            display: "block",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "75%",
          margin: "auto",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src={company.logoSecureUrl}
            alt="Company Logo"
            style={{
              width: "130px",
              height: "130px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <span
            style={{
              display: "block",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            {company.name}
          </span>
          <span style={{ fontSize: "18px", color: "#555" }}>
            {company.country?.name}
          </span>
        </div>
        <button
          onClick={scrollToSection}
          style={{
            padding: "15px 30px",
            backgroundColor: "green",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Open Position
        </button>
      </div>

      <div
        style={{
          width: "75%",
          margin: "20px auto",
          height: "2px",
          backgroundColor: "green",
        }}
      />

      <div className="container my-4" style={{ width: "75%", margin: "auto" }}>
        <div className="row">
          {/* LEFT */}
          <div className="col-md-8 p-5">
            <h5 className="text-center">About Us</h5>
            <div
              dangerouslySetInnerHTML={{
                __html: company.bio.replace(/\./g, "<br/><br/>"),
              }}
            />
            <hr />
            <h5 className="text-center">Company Vision</h5>
            <div
              dangerouslySetInnerHTML={{
                __html: company.vision.replace(/\./g, "<br/><br/>"),
              }}
            />
            <hr />
            <div ref={sectionRef}>
              {jobs.length > 0 ? (
                jobs.map((ca, i) => <JobsCard key={i} jobs={ca} />)
              ) : (
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                  No jobs found
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-md-4 border-left p-5">
            <h5 style={{ fontSize: "24px", fontWeight: "bold" }}>
              {company.name}
            </h5>
            <p>
              <MdLocationOn color="green" /> {company.country?.name}
            </p>

            <iframe
              src={company.mapLink}
              style={{
                width: "100%",
                height: "300px",
                border: "0",
                borderRadius: "10px",
              }}
              loading="lazy"
              allowFullScreen
            ></iframe>

            <div className="pt-3">
              <FaIndustry color="green" /> Industry:{" "}
              {company.industryType?.name}
            </div>
            <div className="pt-3">
              <CgOrganisation color="green" /> Org Type:{" "}
              {company.organizationType?.name}
            </div>
            <div className="pt-3">
              <FaAddressCard color="green" /> Established:{" "}
              {moment(company.establishmentDate).format("MMMM D, YYYY")}
            </div>
            <div className="pt-3">
              <RiTeamLine color="green" /> Size: {company.teamType?.name}{" "}
              employees
            </div>
            <div className="pt-3">
              <FaAddressCard color="green" /> Address: {company.address},{" "}
              {company.state?.statename}
            </div>
            <div className="pt-3">
              <FaPhone color="green" /> Phone: {company.phone}
            </div>
            <div className="pt-3">
              <MdEmail color="green" /> Email: {company.email}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
