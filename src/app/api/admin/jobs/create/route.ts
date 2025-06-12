import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { validateRequest } from "@/auth";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const {
    title,
    isSalaryRange,
    deadline,
    totalVacancies,
    selectedCompany,
    selectedJobCategory,
    selectedCountry,
    selectedState,
    selectedCity,
    address,
    minSalary,
    maxSalary,
    customSalary,
    selectedSalaryType,
    education,
    experience,
    jobRole,
    jobType,
    tags,
    benefits,
    skills,
    applicationReceived,
    description,
    highlight,
    featured,
  } = body;

  try {
    const job = await db.jobs.create({
      data: {
        title,
        slug: slugify(title),
        deadline: new Date(deadline),
        vacancies: totalVacancies,
        address,
        min_salary: parseInt(minSalary || "0"),
        max_salary: parseInt(maxSalary || "0"),
        custom_salary: parseInt(customSalary || "0"),
        apply_on: applicationReceived,
        description,
        highlight,
        featured,
        salary_mode: isSalaryRange ? "range" : "custom",
        status: "active",
        company: { connect: { id: selectedCompany } },
        job_category: { connect: { id: selectedJobCategory } },
        country: { connect: { id: selectedCountry } },
        state: { connect: { id: selectedState } },
        city: { connect: { id: selectedCity } },
        salary_type: { connect: { id: selectedSalaryType } },
        education: { connect: { id: education } },
        job_experience: { connect: { id: experience } },
        job_role: { connect: { id: jobRole } },
        job_type: { connect: { id: jobType } },
      },
    });

    for (const tagId of tags) {
      await db.jobtag.create({
        data: {
          job: { connect: { id: job.id } },
          tag: { connect: { id: tagId } },
        },
      });
    }

    const benfit = await db.benfits.create({
      data: {
        company: { connect: { id: selectedCompany } },
        name: benefits,
      },
    });

    await db.job_benfits.create({
      data: {
        job: { connect: { id: job.id } },
        benfit: { connect: { id: benfit.id } },
      },
    });

    for (const skillId of skills) {
      await db.jobskill.create({
        data: {
          job: { connect: { id: job.id } },
          skill: { connect: { id: skillId } },
        },
      });
    }

    return NextResponse.json({ success: "Job created successfully" });
  } catch (err) {
    console.error("Job creation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
