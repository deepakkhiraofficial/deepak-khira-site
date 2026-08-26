"use client";

import { useEffect, useState, useRef } from "react";
import Head from "next/head";

interface Job {
  _id: string;
  title: string;
  location: string;
  type: string;
  description: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  message: string;
  resume: File | null;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      _id: "1",
      title: "Frontend Developer",
      location: "Mumbai, India",
      type: "Full-time",
      description:
        "Work on building responsive and dynamic e-commerce websites using React and Next.js.",
    },
    {
      _id: "2",
      title: "Backend Developer",
      location: "Delhi, India",
      type: "Full-time",
      description:
        "Develop robust APIs, database schemas, and manage server-side logic for e-commerce platforms.",
    },
    {
      _id: "3",
      title: "UI/UX Designer",
      location: "Remote",
      type: "Contract",
      description:
        "Design engaging and user-friendly interfaces for web and mobile applications.",
    },
    {
      _id: "4",
      title: "Digital Marketing Specialist",
      location: "Bangalore, India",
      type: "Full-time",
      description:
        "Plan and execute marketing campaigns, SEO/SEM strategies, and social media management.",
    },
    {
      _id: "5",
      title: "Product Manager",
      location: "Hyderabad, India",
      type: "Full-time",
      description:
        "Lead product development, coordinate teams, and ensure timely delivery of e-commerce projects.",
    },
  ]);

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    message: "",
    resume: null,
  });
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Ref to the form section for scrolling
  const formRef = useRef<HTMLDivElement>(null);

  // Fetch jobs from API (if needed)
  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        if (data && data.length > 0) setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoadingJobs(false);
      }
    }
    fetchJobs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm({ ...form, resume: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);
    setSubmitError(null);

    // Resume validation
    if (form.resume) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(form.resume.type)) {
        setSubmitError("Only PDF/DOC/DOCX files are allowed.");
        return;
      }
      if (form.resume.size > 5 * 1024 * 1024) {
        setSubmitError("Resume must be less than 5MB.");
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone || "");
      formData.append("jobTitle", form.jobTitle);
      formData.append("message", form.message || "");
      if (form.resume) formData.append("resume", form.resume);

      const res = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitMessage("Application submitted successfully!");
        setForm({
          name: "",
          email: "",
          phone: "",
          jobTitle: "",
          message: "",
          resume: null,
        });
      } else {
        setSubmitError(data.error || "Failed to submit application.");
      }
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to submit application.");
    }
  };

  // Click "Apply for this Job" → select job and scroll to form
  const handleApplyClick = (jobTitle: string) => {
    setForm({ ...form, jobTitle });
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Head>
        <title>Careers | Deepak Khira Enterprises</title>
        <meta
          name="description"
          content="Explore career opportunities at Deepak Khira Enterprises and apply online."
        />
      </Head>

      <main className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-6 md:px-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Careers at Deepak Khira Enterprises
        </h1>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Join our team and apply for open positions directly below.
        </p>

        {/* Job Listings */}
        {loadingJobs ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading jobs...
          </p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No job openings at the moment.
          </p>
        ) : (
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {job.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {job.type} | {job.location}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {job.description}
                </p>
                <button
                  onClick={() => handleApplyClick(job.title)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
                >
                  Apply for this Job
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Apply Online Form */}
        <section
          ref={formRef}
          className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded shadow-md mb-12"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Apply Online
          </h2>

          {submitMessage && (
            <p className="mb-4 text-green-600 dark:text-green-400 font-medium">
              {submitMessage}
            </p>
          )}
          {submitError && (
            <p className="mb-4 text-red-600 dark:text-red-400 font-medium">
              {submitError}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                Name*
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                Job Title*
              </label>
              <select
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Job</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job.title}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                Upload Resume (PDF/DOC/DOCX, max 5MB)
              </label>
              <input
                type="file"
                name="resume"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500 transition"
            >
              Submit Application
            </button>
          </form>
        </section>

        {/* Why Work With Us */}
        <section className="mt-16 max-w-5xl mx-auto bg-white dark:bg-gray-800 p-8 rounded shadow-md space-y-4 text-gray-700 dark:text-gray-300">
          <h2 className="text-2xl font-semibold">Why Work With Us?</h2>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>Collaborative and innovative work environment</li>
            <li>Opportunities for growth and learning</li>
            <li>Flexible work arrangements including remote work</li>
            <li>
              Exposure to cutting-edge technologies and e-commerce projects
            </li>
            <li>Supportive and inclusive company culture</li>
          </ul>
        </section>
      </main>
    </>
  );
}
