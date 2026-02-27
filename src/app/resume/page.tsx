"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { FileText, DownloadCloud, RefreshCw, AlertCircle } from "lucide-react";
import { resumeBuilder } from "@/modules/resume-builder";
import { ResumData } from "@/types";

export default function ResumePage() {
  const [resume, setResume] = useState<ResumData | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [showIssues, setShowIssues] = useState(false);

  const handleCreateResume = () => {
    const newResume = resumeBuilder.generateSampleResume();
    setResume(newResume);
    const atsResult = resumeBuilder.calculateATSScore(newResume);
    setAtsScore(atsResult.score);
    setShowIssues(true);
  };

  const handleOptimize = () => {
    if (!resume) return;
    const optimized = resumeBuilder.optimizeForATS(resume, [
      "React",
      "Node.js",
      "TypeScript",
      "AWS",
      "Docker",
    ]);
    setResume(optimized);
    const atsResult = resumeBuilder.calculateATSScore(optimized);
    setAtsScore(atsResult.score);
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      <div className="bg-gradient-to-r from-primary to-indigo-600 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">AI Resume Builder</h1>
          <p className="text-indigo-100">Create ATS-optimized resumes with real-time scoring</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {!resume ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-dark mb-2">Create Your Resume</h2>
                <p className="text-gray-600 mb-6">
                  Build a professional resume optimized for ATS systems
                </p>
                <button
                  onClick={handleCreateResume}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Create New Resume
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-dark mb-4">{resume.title}</h2>
                  <div className="bg-gray-50 p-6 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                    {resumeBuilder.generatePlainText(resume)}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleOptimize}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Optimize for ATS
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2">
                    <DownloadCloud className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ATS Scoring Panel */}
          {resume && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-dark mb-4">ATS Score</h3>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="8"
                      strokeDasharray={`${(atsScore || 0) * 2.83} 283`}
                      transform="rotate(-90 50 50)"
                    />
                    <text
                      x="50"
                      y="55"
                      textAnchor="middle"
                      fontSize="24"
                      fontWeight="bold"
                      fill="#1F2937"
                    >
                      {atsScore}%
                    </text>
                  </svg>
                </div>
                <p className="text-center text-sm text-gray-600">
                  {atsScore! >= 80 ? "Excellent! Ready to apply" : "Good score - consider improvements"}
                </p>
              </div>

              {showIssues && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    Issues Found
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-red-600">Critical (0)</p>
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-600">Warnings (0)</p>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-600">Suggestions (2)</p>
                      <ul className="mt-2 space-y-1 text-gray-700">
                        <li>• Add action verbs to achievements</li>
                        <li>• Include quantifiable metrics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
                <h3 className="text-lg font-bold text-green-700 mb-2">Template</h3>
                <p className="text-sm text-gray-700 mb-3">{resume.template}</p>
                <div className="flex gap-2">
                  {["blue", "green", "purple"].map((theme) => (
                    <div
                      key={theme}
                      className={`w-8 h-8 rounded cursor-pointer border-2 ${
                        resume.theme === theme ? "border-gray-800" : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor:
                          theme === "blue"
                            ? "#3B82F6"
                            : theme === "green"
                            ? "#10B981"
                            : "#8B5CF6",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
