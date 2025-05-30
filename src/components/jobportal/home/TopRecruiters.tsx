// TopRecruiters.js
"use client";

// TopRecruiters.js

import React, { useEffect } from "react";
import Image from "next/image";
// recruitersData.js

const recruitersData = [
  {
    id: 1,
    image: "recruiter1.jpg",
    title: "ABC Corporation",
    rating: 4.5,
    numRatings: 120,
    location: "New York",
    jobAvailability: 30,
  },
  {
    id: 2,
    image: "recruiter2.jpg",
    title: "XYZ Solutions",
    rating: 4.2,
    numRatings: 80,
    location: "Los Angeles",
    jobAvailability: 25,
  },
  {
    id: 2,
    image: "recruiter2.jpg",
    title: "XYZ Solutions",
    rating: 4.2,
    numRatings: 80,
    location: "Los Angeles",
    jobAvailability: 25,
  },
  {
    id: 2,
    image: "recruiter2.jpg",
    title: "XYZ Solutions",
    rating: 4.2,
    numRatings: 80,
    location: "Los Angeles",
    jobAvailability: 25,
  },
  {
    id: 2,
    image: "recruiter2.jpg",
    title: "XYZ Solutions",
    rating: 4.2,
    numRatings: 80,
    location: "Los Angeles",
    jobAvailability: 25,
  },
  {
    id: 2,
    image: "recruiter2.jpg",
    title: "XYZ Solutions",
    rating: 4.2,
    numRatings: 80,
    location: "Los Angeles",
    jobAvailability: 25,
  },
  {
    id: 2,
    image: "recruiter2.jpg",
    title: "XYZ Solutions",
    rating: 4.2,
    numRatings: 80,
    location: "Los Angeles",
    jobAvailability: 25,
  },
  {
    id: 2,
    image: "recruiter2.jpg",
    title: "XYZ Solutions",
    rating: 4.2,
    numRatings: 80,
    location: "Los Angeles",
    jobAvailability: 25,
  },
  {
    id: 2,
    image: "recruiter2.jpg",
    title: "XYZ Solutions",
    rating: 4.2,
    numRatings: 80,
    location: "Los Angeles",
    jobAvailability: 25,
  },
  // Add more dummy data as needed
];

export default function TopRecruiters() {
  useEffect(() => {
    import("bootstrap/dist/css/bootstrap.min.css");
    import(
      "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"
    );
  }, []);
  return (
    <>
      {" "}
      <h2 className="m-3 p-4 text-center">Top Recruiters</h2>
      <div className="topRecruiters-job">
        {recruitersData.map((recruiter) => (
          <div key={recruiter.id} className="recruiter-job">
            <div className="image-job">
              <Image
                src="/assets/images/jobportal/dee.jpg"
                alt="title"
                width={50}
                height={50}
                layout="fixed"
                className="x"
              />
            </div>
            <div className="details">
              <h3>{recruiter.title}</h3>
              <div className="rating">
                <span className="starIcon">★</span>
                <span className="starIcon">★</span>
                <span className="starIcon">★</span>
                <span className="starIcon">★</span>
                <span className="starIcon">★</span>
                <span>{recruiter.rating}</span>
                <span>({recruiter.numRatings})</span>
              </div>
              <div className="location">
                <span className="locationIcon">📍</span>
                <span>{recruiter.location}</span>
              </div>
              <div className="jobAvailability">
                <span>{recruiter.jobAvailability} jobs available</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
