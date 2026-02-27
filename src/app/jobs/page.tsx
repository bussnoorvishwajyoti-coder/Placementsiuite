"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Briefcase, Search, Filter, Plus } from "lucide-react";
import { Job } from "@/types";

// Sample jobs data
const SAMPLE_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Full Stack Developer",
    company: "Google",
    location: "Mountain View, CA",
    description: "We're looking for an experienced full stack developer to join our team...",
    requirements: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    salary: { min: 150000, max: 200000, currency: "USD" },
    jobUrl: "https://careers.google.com",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    saved: true,
    matchScore: 92,
    source: "LinkedIn",
  },
  {
    id: "job-2",
    title: "Full Stack Engineer",
    company: "Microsoft",
    location: "Seattle, WA",
    description: "Join our innovative team building cloud solutions...",
    requirements: ["JavaScript", "Python", "Cloud", "REST APIs"],
    salary: { min: 140000, max: 180000, currency: "USD" },
    jobUrl: "https://careers.microsoft.com",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    saved: false,
    matchScore: 85,
    source: "Indeed",
  },
  {
    id: "job-3",
    title: "React Developer",
    company: "Amazon",
    location: "Remote",
    description: "Build user-facing applications for millions of users...",
    requirements: ["React", "JavaScript", "HTML", "CSS", "AWS"],
    salary: { min: 130000, max: 170000, currency: "USD" },
    jobUrl: "https://careers.amazon.com",
    postedDate: new Date().toISOString(),
    saved: true,
    matchScore: 88,
    source: "LinkedIn",
  },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(SAMPLE_JOBS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByLocation, setFilterByLocation] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !filterByLocation || job.location.toLowerCase().includes(filterByLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-indigo-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Job Intelligence Engine</h1>
          <p className="text-indigo-100">Precision-matched job discovery - {jobs.length} opportunities</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Filter by location..."
                value={filterByLocation}
                onChange={(e) => setFilterByLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-dark mb-1">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.saved && <span className="text-orange-500 text-sm font-semibold">★ Saved</span>}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{job.description}</p>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                    <span>📍 {job.location}</span>
                    {job.salary && (
                      <span>
                        💰 ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                      </span>
                    )}
                    <span>📅 {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ml-4 flex flex-col items-end gap-3">
                  <div
                    className={`text-3xl font-bold ${
                      job.matchScore >= 80
                        ? "text-green-600"
                        : job.matchScore >= 60
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {job.matchScore}%
                  </div>
                  <p className="text-xs text-gray-600">Match Score</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No jobs found matching your criteria</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterByLocation("");
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
