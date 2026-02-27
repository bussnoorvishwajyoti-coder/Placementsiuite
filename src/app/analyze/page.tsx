"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { FileText, BarChart3, AlertCircle, CheckCircle } from "lucide-react";
import { jdAnalyzer } from "@/modules/jd-analyzer";
import { JDAnalysis } from "@/types";

export default function AnalyzePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [analysis, setAnalysis] = useState<Partial<JDAnalysis> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!jobTitle || !jobDescription) {
      alert("Please enter both job title and description");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = jdAnalyzer.analyzeJobDescription(jobDescription, jobTitle);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Error analyzing job description");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      <div className="bg-gradient-to-r from-primary to-indigo-600 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">JD Analysis Plus</h1>
          <p className="text-indigo-100">Analyze job descriptions & extract key requirements</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-dark mb-6">Upload Job Description</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g., Senior Full Stack Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description</label>
                <textarea
                  placeholder="Paste the complete job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Job Description"}
              </button>
            </div>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-4">
              {/* Required Skills */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Required Skills ({analysis.requiredSkills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.requiredSkills?.map((skill, idx) => (
                    <span key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred Skills */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Preferred Skills ({analysis.preferredSkills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.preferredSkills?.map((skill, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume Keywords */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-dark mb-4">Keywords for Resume</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordsForResume?.map((keyword, idx) => (
                    <span key={idx} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Difficulty & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-gray-600 text-sm mb-1">Difficulty Level</p>
                  <p className="text-2xl font-bold text-primary">{analysis.difficultyRating}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-gray-600 text-sm mb-1">Est. Prep Time</p>
                  <p className="text-2xl font-bold text-primary">{analysis.estimatedPreparationTime}h</p>
                </div>
              </div>

              {/* Experience Needed */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-dark mb-2">Experience Required</h3>
                <p className="text-gray-700">{analysis.experienceRequired}</p>
              </div>

              {/* Insights */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  Key Insights
                </h3>
                <ul className="space-y-2">
                  {jdAnalyzer.generateInsights(analysis as JDAnalysis).map((insight, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
