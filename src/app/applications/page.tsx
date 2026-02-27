"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { BarChart3, Plus, Filter, CheckCircle, Clock, AlertCircle, Award } from "lucide-react";
import { Application, ApplicationStage } from "@/types";

const SAMPLE_APPLICATIONS: Application[] = [
  {
    id: "app-1",
    jobId: "job-1",
    resumeId: "resume-1",
    stage: "applied",
    appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Applied via LinkedIn",
    documents: { resume: "resume-v1.pdf" },
  },
  {
    id: "app-2",
    jobId: "job-2",
    resumeId: "resume-1",
    stage: "interview_scheduled",
    appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    interviewType: "technical",
    notes: "First round interview",
    documents: { resume: "resume-v2.pdf" },
  },
  {
    id: "app-3",
    jobId: "job-3",
    resumeId: "resume-1",
    stage: "interview_completed",
    appliedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    interviewDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    interviewRating: 8,
    notes: "Went very well!",
    documents: { resume: "resume-v1.pdf" },
  },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(SAMPLE_APPLICATIONS);
  const [filterStage, setFilterStage] = useState<ApplicationStage | "all">("all");

  const stageConfig: Record<ApplicationStage, { label: string; color: string; icon: React.ReactNode }> = {
    saved: { label: "Saved", color: "gray", icon: <Clock className="w-4 h-4" /> },
    applied: { label: "Applied", color: "blue", icon: <Clock className="w-4 h-4" /> },
    interview_scheduled: { label: "Interview Scheduled", color: "yellow", icon: <AlertCircle className="w-4 h-4" /> },
    interview_completed: { label: "Interview Completed", color: "green", icon: <CheckCircle className="w-4 h-4" /> },
    offer: { label: "Offer", color: "purple", icon: <Award className="w-4 h-4" /> },
    rejected: { label: "Rejected", color: "red", icon: <AlertCircle className="w-4 h-4" /> },
  };

  const colorClasses: Record<string, string> = {
    gray: "bg-gray-100 text-gray-800 border-gray-300",
    blue: "bg-blue-100 text-blue-800 border-blue-300",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
    green: "bg-green-100 text-green-800 border-green-300",
    purple: "bg-purple-100 text-purple-800 border-purple-300",
    red: "bg-red-100 text-red-800 border-red-300",
  };

  const filteredApplications =
    filterStage === "all" ? applications : applications.filter((app) => app.stage === filterStage);

  const statsByStage = {
    saved: applications.filter((a) => a.stage === "saved").length,
    applied: applications.filter((a) => a.stage === "applied").length,
    interview_scheduled: applications.filter((a) => a.stage === "interview_scheduled").length,
    interview_completed: applications.filter((a) => a.stage === "interview_completed").length,
    offers: applications.filter((a) => a.stage === "offer").length,
    rejected: applications.filter((a) => a.stage === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      <div className="bg-gradient-to-r from-primary to-indigo-600 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Application Tracker</h1>
          <p className="text-indigo-100">Monitor your placement pipeline progress</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <p className="text-2xl font-bold text-gray-600">{statsByStage.saved}</p>
            <p className="text-xs text-gray-600 mt-1">Saved</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <p className="text-2xl font-bold text-blue-600">{statsByStage.applied}</p>
            <p className="text-xs text-gray-600 mt-1">Applied</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <p className="text-2xl font-bold text-yellow-600">{statsByStage.interview_scheduled}</p>
            <p className="text-xs text-gray-600 mt-1">Interviews</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <p className="text-2xl font-bold text-green-600">{statsByStage.interview_completed}</p>
            <p className="text-xs text-gray-600 mt-1">Completed</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <p className="text-2xl font-bold text-purple-600">{statsByStage.offers}</p>
            <p className="text-xs text-gray-600 mt-1">Offers</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <p className="text-2xl font-bold text-red-600">{statsByStage.rejected}</p>
            <p className="text-xs text-gray-600 mt-1">Rejected</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value as ApplicationStage | "all")}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Applications ({applications.length})</option>
            {Object.entries(stageConfig).map(([stage, config]) => (
              <option key={stage} value={stage}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => {
              const config = stageConfig[app.stage];
              return (
                <div key={app.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-dark mb-2">Job Application #{app.id.slice(-3)}</h3>
                      <p className="text-gray-600 text-sm">Applied: {new Date(app.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <div className={`border-2 ${colorClasses[config.color]} px-4 py-2 rounded-lg flex items-center gap-2 font-semibold`}>
                      {config.icon}
                      {config.label}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{app.notes}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-600">Resume</p>
                      <p className="font-semibold text-dark">{app.documents.resume}</p>
                    </div>
                    {app.interviewDate && (
                      <div>
                        <p className="text-gray-600">Interview Date</p>
                        <p className="font-semibold text-dark">{new Date(app.interviewDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {app.interviewType && (
                      <div>
                        <p className="text-gray-600">Interview Type</p>
                        <p className="font-semibold text-dark capitalize">{app.interviewType}</p>
                      </div>
                    )}
                    {app.interviewRating && (
                      <div>
                        <p className="text-gray-600">Interview Rating</p>
                        <p className="font-semibold text-dark">{app.interviewRating}/10</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {app.stage !== "offer" && app.stage !== "rejected" && (
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm">
                        Update Stage
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No applications in this stage yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
