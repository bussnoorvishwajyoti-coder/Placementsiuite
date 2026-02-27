"use client";

import { useState, useEffect } from "react";
import { usePlacementStore } from "@/store/placement";
import { PlacementSuiteUser, DashboardSummary } from "@/types";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Award,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import JobMatchCard from "@/components/JobMatchCard";

// Sample data for demo
const SAMPLE_USER: PlacementSuiteUser = {
  id: "user-1",
  name: "Sarah Anderson",
  email: "sarah@example.com",
  targetRole: "Full Stack Developer",
  targetCompanies: ["Google", "Microsoft", "Amazon"],
  currentLevel: "junior",
  preferences: {
    jobCategories: ["Full Stack", "Backend", "Frontend"],
    experienceLevel: "1-3 years",
    salaryRange: { min: 60000, max: 120000 },
    locations: ["Remote", "San Francisco", "New York"],
    notificationsEnabled: true,
    notificationTime: "09:00",
  },
  resumeData: [],
  jobMatches: [],
  applications: [],
  jdAnalyses: {},
  savedJobs: [],
  readinessScore: {
    jobMatchQuality: 0,
    jdSkillAlignment: 0,
    resumeAtsScore: 0,
    applicationProgress: 0,
    practiceCompletion: 0,
    overallScore: 0,
  },
  practiceProblems: [],
  mockInterviews: [],
  notifications: [],
  lastActivity: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function Page() {
  const [user, setUser] = useState<PlacementSuiteUser | null>(SAMPLE_USER);
  const placementStore = usePlacementStore();

  useEffect(() => {
    // Initialize with sample data
    if (typeof window !== "undefined") {
      try {
        setUser(SAMPLE_USER);
        placementStore.setUser(SAMPLE_USER);
      } catch (error) {
        console.error("Error initializing:", error);
        setUser(SAMPLE_USER);
        placementStore.setUser(SAMPLE_USER);
      }
    }
  }, [placementStore]);

  if (!user) {
    return null;
  }

  const topJobs = user.savedJobs.slice(0, 5);
  const applicationCounts = {
    saved: user.applications.filter((a) => a.stage === "saved").length,
    applied: user.applications.filter((a) => a.stage === "applied").length,
    interviewScheduled: user.applications.filter((a) => a.stage === "interview_scheduled").length,
    offers: user.applications.filter((a) => a.stage === "offer").length,
  };

  const weakSkillAlerts = ["React Advanced Patterns", "System Design", "AWS Architecture"];

  return (
    <div className="min-h-screen bg-light">
      <Navbar user={user} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-indigo-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-indigo-100 text-lg">
            Your placement journey at a glance - Job Intelligence Pipeline
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Placement Score"
            value={user.readinessScore.overallScore}
            unit="/100"
            icon={<Award className="w-6 h-6 text-primary" />}
            color="blue"
          />
          <StatCard
            title="Resume ATS"
            value={user.readinessScore.resumeAtsScore}
            unit="/100"
            icon={<FileText className="w-6 h-6 text-secondary" />}
            color="green"
          />
          <StatCard
            title="JD Alignment"
            value={user.readinessScore.jdSkillAlignment}
            unit="/100"
            icon={<TrendingUp className="w-6 h-6 text-accent" />}
            color="yellow"
          />
          <StatCard
            title="Applications"
            value={user.applications.length}
            unit="total"
            icon={<Briefcase className="w-6 h-6 text-purple-500" />}
            color="purple"
          />
          <StatCard
            title="Job Matches"
            value={user.savedJobs.length}
            unit="saved"
            icon={<Clock className="w-6 h-6 text-red-500" />}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Application Pipeline */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              Application Pipeline
            </h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">{applicationCounts.saved}</div>
                <p className="text-gray-600 text-sm mt-2">Saved</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">{applicationCounts.applied}</div>
                <p className="text-gray-600 text-sm mt-2">Applied</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">{applicationCounts.interviewScheduled}</div>
                <p className="text-gray-600 text-sm mt-2">Interviews</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">{applicationCounts.offers}</div>
                <p className="text-gray-600 text-sm mt-2">Offers</p>
              </div>
            </div>

            {/* Next Action */}
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-dark mb-1">Next Action</h3>
                  <p className="text-gray-700">🔵 Start applying to matched jobs</p>
                  <Link
                    href="/applications"
                    className="inline-block mt-2 text-primary hover:underline font-semibold"
                  >
                    Go to Applications →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Weak Skill Alerts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Skill Gaps
            </h2>
            <div className="space-y-3">
              {weakSkillAlerts.map((skill, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-dark">{skill}</p>
                    <p className="text-gray-600 text-xs">Found in 3 JDs</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/analyze"
              className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Analyze JDs
            </Link>
          </div>
        </div>

        {/* Top Job Matches */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              Top Job Matches (Next 5 Days)
            </h2>
            <Link href="/jobs" className="text-primary hover:underline font-semibold">
              View All →
            </Link>
          </div>

          {topJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topJobs.map((job) => (
                <JobMatchCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No job matches yet</p>
              <Link
                href="/jobs"
                className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Start Finding Jobs
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/resume"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-between group"
          >
            <div>
              <h3 className="font-semibold text-dark mb-1">Build Resume</h3>
              <p className="text-sm text-gray-600">Create ATS-optimized resume</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
          </Link>

          <Link
            href="/analyze"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-between group"
          >
            <div>
              <h3 className="font-semibold text-dark mb-1">Analyze JD</h3>
              <p className="text-sm text-gray-600">Break down job requirements</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
          </Link>

          <Link
            href="/jobs"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-between group"
          >
            <div>
              <h3 className="font-semibold text-dark mb-1">Find Jobs</h3>
              <p className="text-sm text-gray-600">Precision job discovery</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
          </Link>

          <Link
            href="/applications"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-between group"
          >
            <div>
              <h3 className="font-semibold text-dark mb-1">Track Apps</h3>
              <p className="text-sm text-gray-600">Monitor your pipeline</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}
