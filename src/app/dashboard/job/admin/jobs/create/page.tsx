"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Select } from "antd";
import { DatePicker } from "antd";
import { useSkillStore } from "@/app/job-portal-store/skill";
import { useCountryStore } from "@/app/job-portal-store/country";
import { useStateStore } from "@/app/job-portal-store/state";
import { useCityStore } from "@/app/job-portal-store/city";
import { useJobcategoryStore } from "@/app/job-portal-store/jobcategories";
import { useEducationStore } from "@/app/job-portal-store/education";
import { useJobroleStore } from "@/app/job-portal-store/jobrole";
import { useJobtypeStore } from "@/app/job-portal-store/jobtype";
import { useJobexperienceStore } from "@/app/job-portal-store/jobexperiences";
import { useSalarytypeStore } from "@/app/job-portal-store/salarytype";
import { useTagStore } from "@/app/job-portal-store/tag";

const { Option } = Select;

const ben = [
  "Job",
  "Career",
  "Employment",
  "Opportunity",
  "Vacancy",
  "Position",
  "Work",
  "Recruitment",
  "Hiring",
  "Interview",
  "Resume",
  "Salary",
  "Benefits",
  "Skills",
  "Experience",
  "Job search",
  "Job market",
  "Job application",
  "Job satisfaction",
  "Professional development",
];

export default function Jobs() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [totalVacancies, setTotalVacancies] = useState("");
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [selectedJobCategory, setSelectedJobCategory] = useState("");
  const [allcompany, setAllcompany] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [address, setAddress] = useState("");
  const [isSalaryRange, setIsSalaryRange] = useState(true);
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [customSalary, setCustomSalary] = useState("");
  const [selectedSalaryType, setSelectedSalaryType] = useState("");
  const [experience, setExperience] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [education, setEducation] = useState("");
  const [jobType, setJobType] = useState("");
  const [tags, setTags] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [skills, setSkills] = useState([]);
  const [applicationReceived, setApplicationReceived] = useState("");
  const [highlight, setHighlight] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Zustand stores
  const { countries, fetchCountriesPublic } = useCountryStore();
  const { states, fetchStatesPublic, setStates } = useStateStore();
  const { cities, fetchCitiesPublic, setCities } = useCityStore();
  const { jobcategories, fetchJobcategoriesPublic } = useJobcategoryStore();
  const { educations, fetchEducationPublic } = useEducationStore();
  const { jobrole, fetchJobrolePublic } = useJobroleStore();
  const { jobtypes, fetchJobtypesPublic } = useJobtypeStore();
  const { jobexperience, fetchJobexperiencePublic } = useJobexperienceStore();
  const { salarytypes, fetchSalarytypesPublic } = useSalarytypeStore();
  const { skills: allSkills, fetchSkillsPublic } = useSkillStore();
  const { tags: allTags, fetchTagsPublic } = useTagStore();

  console.log("jobcategories", jobcategories);

  useEffect(() => {
    fetchJobexperiencePublic();
    fetchJobcategoriesPublic();
    fetchData();
    fetchCountriesPublic();
    fetchSalarytypesPublic();
    fetchJobrolePublic();
    fetchJobtypesPublic();
    fetchEducationPublic();
    fetchTagsPublic();
    fetchSkillsPublic();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/selectcompany`,
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err);
      } else {
        setAllcompany(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleJobCategoryChange = async (e) => {
    setSelectedJobCategory(e.target.value);
  };

  const handleSelectCompanyChange = async (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleDateChange = async (value) => {
    setDeadline(value);
  };

  const handleCountryChange = async (e) => {
    try {
      const countryId = e.target.value;
      setSelectedCountry(countryId);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/state`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ countryId }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error("Failed to fetch states");
      } else {
        setStates(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStateChange = async (e) => {
    try {
      const stateId = e.target.value;
      setSelectedState(stateId);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/city`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stateId }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error("Failed to fetch cities");
      } else {
        setCities(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSalaryChange = async (e) => {
    setSelectedSalaryType(e.target.value);
  };

  const handleExperienceChange = async (e) => {
    setExperience(e.target.value);
  };

  const handleJobroleChange = async (e) => {
    setJobRole(e.target.value);
  };

  const handleJobTypeChange = async (e) => {
    setJobType(e.target.value);
  };

  const handleEducationChange = async (e) => {
    setEducation(e.target.value);
  };

  const handleTagChanges = (value) => {
    setTags(value);
  };

  const filteredTag = allTags.filter((t) =>
    t.name.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const handleBenefitChange = (value) => {
    setBenefits(value);
  };

  const handleSkillChanges = (value) => {
    setSkills(value);
  };

  const filteredSkill = allSkills.filter((t) =>
    t.name.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleHighlightChange = () => {
    setHighlight(!highlight);
    if (!highlight) {
      setFeatured(false);
    }
  };

  const handleFeaturedChange = () => {
    setFeatured(!featured);
    if (!featured) {
      setHighlight(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !title ||
        !deadline ||
        !totalVacancies ||
        !selectedCompany ||
        !selectedJobCategory ||
        !selectedCountry ||
        !selectedState ||
        !selectedCity ||
        !address ||
        !description ||
        !selectedSalaryType ||
        !experience ||
        !jobRole ||
        !jobType ||
        !tags ||
        !benefits ||
        !skills ||
        !applicationReceived ||
        (isSalaryRange && (!minSalary || !maxSalary)) ||
        (!isSalaryRange && !customSalary)
      ) {
        toast.error("Please fill all the fields");
        return;
      }

      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/jobs/create`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            highlight,
            featured,
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
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success(data.success);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting the job");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    import("bootstrap/dist/css/bootstrap.min.css");
    import(
      "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"
    );
  }, []);

  return (
    <main>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center h-auto">
          <div className="col p-5 shadow">
            <h6 className="mb-4">Job details</h6>
            <div className="container">
              <div className="row">
                <form onSubmit={handleSubmit}>
                  {/* Title */}
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "100%", outline: "none" }}
                      />
                    </div>
                  </div>

                  {/* Job Category and Company */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Select Job Category
                        </label>
                        <select
                          className="mb-4"
                          style={{
                            width: "100%",
                            padding: "5px",
                            borderRadius: "5px",
                            backgroundColor: "#fff",
                            color: "#333",
                            fontSize: "15px",
                            appearance: "none",
                            outline: "none",
                          }}
                          value={selectedJobCategory}
                          onChange={handleJobCategoryChange}
                        >
                          <option value="">Select Job Category</option>
                          {jobcategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Select Company</label>
                        <select
                          className="mb-4"
                          style={{
                            outline: "none",
                            width: "100%",
                            padding: "5px",
                            borderRadius: "5px",
                            backgroundColor: "#fff",
                            color: "#333",
                            fontSize: "15px",
                            appearance: "none",
                          }}
                          value={selectedCompany}
                          onChange={handleSelectCompanyChange}
                        >
                          <option value="">Select Company</option>
                          {allcompany.map((company) => (
                            <option key={company._id} value={company._id}>
                              {company.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Deadline and Vacancies */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Deadline</label>
                        <DatePicker
                          placeholder="Select deadline"
                          onChange={handleDateChange}
                          value={deadline}
                          style={{
                            width: "100%",
                            height: "40px",
                            fontSize: "16px",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Total Vacancies</label>
                        <input
                          type="text"
                          value={totalVacancies}
                          onChange={(e) => setTotalVacancies(e.target.value)}
                          style={{ width: "100%", outline: "none" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <h6>Location</h6>
                  <div className="row mt-4">
                    <div className="col">
                      <div className="row mb-3">
                        <div className="col">
                          <label className="form-label">Country</label>
                          <select
                            className="mb-4"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "5px",
                              backgroundColor: "#fff",
                              color: "#333",
                              fontSize: "15px",
                              appearance: "none",
                              outline: "none",
                            }}
                            value={selectedCountry}
                            onChange={handleCountryChange}
                          >
                            <option value="">Select a country</option>
                            {countries.map((country) => (
                              <option key={country.id} value={country.id}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col">
                          <label className="form-label">State</label>
                          <select
                            className="mb-4"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "5px",
                              backgroundColor: "#fff",
                              color: "#333",
                              fontSize: "15px",
                              appearance: "none",
                              outline: "none",
                            }}
                            value={selectedState}
                            onChange={handleStateChange}
                          >
                            <option value="">Select a state</option>
                            {states.map((state) => (
                              <option key={state.id} value={state.id}>
                                {state.statename}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col">
                          <label className="form-label">City</label>
                          <select
                            className="mb-4"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "5px",
                              backgroundColor: "#fff",
                              color: "#333",
                              fontSize: "15px",
                              appearance: "none",
                              outline: "none",
                            }}
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                          >
                            <option value="">Select a city</option>
                            {cities.map((city) => (
                              <option key={city.id} value={city.id}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <textarea
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          style={{ width: "100%", outline: "none" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Salary Details */}
                  <h6>Salary details</h6>
                  <div className="row mt-4">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-check mb-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="salaryRangeCheckbox"
                              checked={isSalaryRange}
                              onChange={() => setIsSalaryRange(!isSalaryRange)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="salaryRangeCheckbox"
                            >
                              Salary Range
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-check mb-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="customSalaryCheckbox"
                              checked={!isSalaryRange}
                              onChange={() => setIsSalaryRange(!isSalaryRange)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="customSalaryCheckbox"
                            >
                              Custom Salary
                            </label>
                          </div>
                        </div>
                      </div>
                      {isSalaryRange ? (
                        <div className="row mb-3">
                          <div className="col">
                            <label className="form-label">Minimum Salary</label>
                            <input
                              type="text"
                              className="form-control"
                              value={minSalary}
                              onChange={(e) => setMinSalary(e.target.value)}
                            />
                          </div>
                          <div className="col">
                            <label className="form-label">Maximum Salary</label>
                            <input
                              type="text"
                              className="form-control"
                              value={maxSalary}
                              onChange={(e) => setMaxSalary(e.target.value)}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="mb-3">
                          <label className="form-label">Custom Salary</label>
                          <input
                            type="text"
                            style={{ outline: "none" }}
                            value={customSalary}
                            onChange={(e) => setCustomSalary(e.target.value)}
                          />
                        </div>
                      )}
                      <div className="mb-3">
                        <label className="form-label">Select Salary Type</label>
                        <select
                          className="mb-4"
                          style={{
                            width: "100%",
                            padding: "5px",
                            borderRadius: "5px",
                            border: "2px solid #ccc",
                            backgroundColor: "#fff",
                            color: "#333",
                            fontSize: "15px",
                            appearance: "none",
                            outline: "none",
                          }}
                          value={selectedSalaryType}
                          onChange={handleSalaryChange}
                        >
                          <option value="">Select Salary Type</option>
                          {salarytypes.map((salary) => (
                            <option key={salary.id} value={salary.id}>
                              {salary.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Attribute Details */}
                  <h6>Attribute details</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Experience</label>
                        <select
                          className="mb-4"
                          style={{
                            width: "100%",
                            padding: "5px",
                            borderRadius: "5px",
                            border: "2px solid #ccc",
                            backgroundColor: "#fff",
                            color: "#333",
                            fontSize: "15px",
                            appearance: "none",
                            outline: "none",
                          }}
                          value={experience}
                          onChange={handleExperienceChange}
                        >
                          <option value="">Select Experience</option>
                          {jobexperience.map((exp) => (
                            <option key={exp.id} value={exp.id}>
                              {exp.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Job Role</label>
                        <select
                          className="mb-4"
                          style={{
                            width: "100%",
                            padding: "5px",
                            borderRadius: "5px",
                            border: "2px solid #ccc",
                            backgroundColor: "#fff",
                            color: "#333",
                            fontSize: "15px",
                            appearance: "none",
                            outline: "none",
                          }}
                          value={jobRole}
                          onChange={handleJobroleChange}
                        >
                          <option value="">Select Job Role</option>
                          {jobrole.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Education</label>
                        <select
                          className="mb-4"
                          style={{
                            width: "100%",
                            padding: "5px",
                            borderRadius: "5px",
                            border: "2px solid #ccc",
                            backgroundColor: "#fff",
                            color: "#333",
                            fontSize: "15px",
                            appearance: "none",
                            outline: "none",
                          }}
                          value={education}
                          onChange={handleEducationChange}
                        >
                          <option value="">Select Education</option>
                          {educations.map((edu) => (
                            <option key={edu.id} value={edu.id}>
                              {edu.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Job Type</label>
                        <select
                          className="mb-4"
                          style={{
                            width: "100%",
                            padding: "5px",
                            borderRadius: "5px",
                            backgroundColor: "#fff",
                            color: "#333",
                            fontSize: "15px",
                            appearance: "none",
                            outline: "none",
                          }}
                          value={jobType}
                          onChange={handleJobTypeChange}
                        >
                          <option value="">Select Job Type</option>
                          {jobtypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Tags</label>
                        <Select
                          className="mb-4"
                          mode="multiple"
                          style={{
                            width: "calc(100% - 20px)",
                            height: "50px",
                          }}
                          placeholder="Select Tags"
                          filterOption={false}
                          showSearch
                          value={tags}
                          onChange={handleTagChanges}
                        >
                          {filteredTag.map((tag) => (
                            <Option key={tag.id} value={tag.id}>
                              {tag.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Benefits</label>
                        <Select
                          className="mb-4"
                          mode="multiple"
                          style={{
                            width: "calc(100% - 20px)",
                            height: "50px",
                          }}
                          placeholder="Select benefits"
                          filterOption={false}
                          showSearch
                          value={benefits}
                          onChange={handleBenefitChange}
                        >
                          {ben.map((b) => (
                            <Option key={b} value={b}>
                              {b}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Skills</label>
                        <Select
                          className="mb-4"
                          mode="multiple"
                          style={{
                            width: "calc(100% - 20px)",
                            height: "50px",
                          }}
                          placeholder="Select skills"
                          filterOption={false}
                          showSearch
                          value={skills}
                          onChange={handleSkillChanges}
                        >
                          {filteredSkill.map((skill) => (
                            <Option key={skill.id} value={skill.id}>
                              {skill.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Application Details */}
                  <h6>Application details</h6>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Application Received</label>
                        <select
                          value={applicationReceived}
                          onChange={(e) =>
                            setApplicationReceived(e.target.value)
                          }
                          style={{ outline: "none" }}
                        >
                          <option value="">Select Option</option>
                          <option value="app">On Platform</option>
                          <option value="email">Email</option>
                          <option value="custom_url">Custom_url</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Highlight and Featured */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="highlightCheckbox"
                          checked={highlight}
                          onChange={handleHighlightChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="highlightCheckbox"
                        >
                          Highlight
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="featuredCheckbox"
                          checked={featured}
                          onChange={handleFeaturedChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="featuredCheckbox"
                        >
                          Featured
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="row mt-5">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Description</label>
                        <ReactQuill
                          value={description}
                          onChange={handleDescriptionChange}
                          modules={{ toolbar: true }}
                          theme="snow"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Job Details"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
