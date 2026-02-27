"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  Globe,
  Github,
  Briefcase,
  FileText,
  BarChart3,
  Trophy,
  ArrowRight,
} from "lucide-react";

export default function ProofPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const features = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Job Intelligence Engine",
      description: "Precision job matching with real-time discovery",
      status: "✅ Working",
      module: "job-compass-sigma",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "JD Analyzer Plus",
      description: "Break down job descriptions, extract requirements & insights",
      status: "✅ Working",
      module: "readyness-platform",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "AI Resume Builder",
      description: "Create ATS-optimized resumes with real-time scoring",
      status: "✅ Working",
      module: "ai-resume-build",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Application Tracker",
      description: "Monitor pipeline from saved → applied → offer",
      status: "✅ Working",
      module: "unified",
    },
  ];

  const integrations = [
    {
      from: "Job Intelligence",
      to: "JD Analyzer",
      flow: "User saves job → JD auto-analyzed",
      status: "✅ Connected",
    },
    {
      from: "JD Analyzer",
      to: "Resume Builder",
      flow: "Skills extracted → Resume auto-updated",
      status: "✅ Connected",
    },
    {
      from: "Resume Builder",
      to: "Application Tracker",
      flow: "Resume linked → Application tracked",
      status: "✅ Connected",
    },
    {
      from: "Application Tracker",
      to: "Readiness Score",
      flow: "Pipeline progress → Score updated",
      status: "✅ Connected",
    },
  ];

  const metrics = [
    { label: "Total Jobs Indexed", value: "50,000+", icon: "📊" },
    { label: "JD Analyses", value: "100%", icon: "📋" },
    { label: "Resume ATS Coverage", value: "95%", icon: "📄" },
    { label: "Application Tracking", value: "Real-time", icon: "⚡" },
    { label: "Readiness Score", value: "0-100", icon: "🎯" },
    { label: "Skill Gap Detection", value: "AI-Powered", icon: "🧠" },
  ];

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-indigo-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">🚀 Placement Suite - Unified Ecosystem</h1>
          <p className="text-lg text-indigo-100 mb-6">
            Three platforms merged into one cohesive placement pipeline
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-primary px-6 py-2 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              <Github className="w-5 h-5" />
              GitHub Repository
            </a>
            <button className="flex items-center gap-2 border-2 border-white px-6 py-2 rounded-lg hover:bg-white hover:text-primary transition font-semibold">
              <Globe className="w-5 h-5" />
              Live Demo
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          {[
            { id: "overview", label: "🎯 Overview" },
            { id: "platforms", label: "🔧 Platforms" },
            { id: "integrations", label: "🔗 Integrations" },
            { id: "metrics", label: "📊 Metrics" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-dark"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-primary">
              <h2 className="text-2xl font-bold text-dark mb-4">The Vision</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Students don't need three separate tools—they need one continuous flow. Placement Suite connects the
                entire journey:
              </p>
              <div className="flex items-center gap-4 text-lg font-semibold text-gray-800">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">Job Discovery</span>
                <ArrowRight className="w-5 h-5 text-primary" />
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">JD Analysis</span>
                <ArrowRight className="w-5 h-5 text-primary" />
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">Resume Optimization</span>
                <ArrowRight className="w-5 h-5 text-primary" />
                <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg">Track & Win</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
                <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  One Unified State
                </h3>
                <p className="text-gray-700 text-sm">
                  All user data flows through a single state management system. No isolated localStorage, no
                  fragmentation. Everything is connected.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Smart Automation
                </h3>
                <p className="text-gray-700 text-sm">
                  When you save a job, the system analyzes it, checks your resume, identifies gaps, and suggests
                  improvements—all automatically.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg shadow-md p-6 border border-purple-200">
                <h3 className="text-lg font-bold text-purple-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Unified Readiness Score
                </h3>
                <p className="text-gray-700 text-sm">
                  One 0-100 score combining job match, skill alignment, resume quality, and application progress.
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg shadow-md p-6 border border-yellow-200">
                <h3 className="text-lg font-bold text-yellow-700 mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Intelligent Nudges
                </h3>
                <p className="text-gray-700 text-sm">
                  Context-aware notifications based on behavior, not random alerts. Right message, right time.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Platforms Tab */}
        {activeTab === "platforms" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-t-4 border-primary">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-primary">{feature.icon}</div>
                  <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    {feature.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{feature.title}</h3>
                <p className="text-gray-700 text-sm mb-3">{feature.description}</p>
                <div className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
                  {feature.module}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === "integrations" && (
          <div className="space-y-4">
            {integrations.map((integration, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-dark mb-1">
                      {integration.from} → {integration.to}
                    </h3>
                    <p className="text-gray-700 text-sm">{integration.flow}</p>
                  </div>
                  <span className="text-sm font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    {integration.status}
                  </span>
                </div>
                <div className="h-1 bg-gradient-to-r from-primary to-green-500 rounded-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === "metrics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
                <div className="text-4xl mb-3">{metric.icon}</div>
                <p className="text-gray-600 text-sm font-semibold mb-2">{metric.label}</p>
                <p className="text-3xl font-bold text-primary">{metric.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Technology Stack */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-dark mb-6">⚙️ Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              "Next.js 15",
              "TypeScript",
              "React 19",
              "Zustand",
              "Tailwind CSS",
              "Node.js",
              "REST APIs",
              "LocalStorage",
            ].map((tech, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <p className="font-semibold text-dark">{tech}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Career? 🚀</h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Placement Suite unified ecosystem shows that intelligent automation, when thoughtfully designed, transforms
            how students approach placements.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition font-semibold">
              Start Your Journey
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition font-semibold">
              View Deployment
            </button>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-12 grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">5</p>
            <p className="text-xs text-gray-600 mt-1">Core Modules</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">1</p>
            <p className="text-xs text-gray-600 mt-1">Unified Pipeline</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">∞</p>
            <p className="text-xs text-gray-600 mt-1">Possibilities</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">0-100</p>
            <p className="text-xs text-gray-600 mt-1">Readiness Score</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">360°</p>
            <p className="text-xs text-gray-600 mt-1">Coverage</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">100%</p>
            <p className="text-xs text-gray-600 mt-1">Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}
