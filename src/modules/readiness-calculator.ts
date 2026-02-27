import { ReadinessScoreBreakdown, PlacementSuiteUser } from "@/types";

/**
 * Unified Readiness Score Formula
 * Combines all platform metrics into single placement score (0-100)
 * 
 * Formula breakdown:
 * - Job Match Quality (30%): How well current jobs match target role
 * - JD Skill Alignment (25%): How aligned resume skills are with JD requirements
 * - Resume ATS Score (25%): Resume quality for ATS systems
 * - Application Progress (10%): Pipeline progress (saved -> applied -> interviewed -> offer)
 * - Practice Completion (10%): Practice problems and mock interviews completed
 */
export class ReadinessScoreCalculator {
  /**
   * Calculate complete readiness score breakdown for a user
   */
  calculateReadinessScore(user: PlacementSuiteUser): ReadinessScoreBreakdown {
    const jobMatchQuality = this.calculateJobMatchQuality(user);
    const jdSkillAlignment = this.calculateJDSkillAlignment(user);
    const resumeAtsScore = this.calculateResumeAtsScore(user);
    const applicationProgress = this.calculateApplicationProgress(user);
    const practiceCompletion = this.calculatePracticeCompletion(user);

    // Calculate overall score using weighted formula
    const overallScore = Math.round(
      jobMatchQuality * 0.3 +
      jdSkillAlignment * 0.25 +
      resumeAtsScore * 0.25 +
      applicationProgress * 0.1 +
      practiceCompletion * 0.1
    );

    return {
      jobMatchQuality,
      jdSkillAlignment,
      resumeAtsScore,
      applicationProgress,
      practiceCompletion,
      overallScore: Math.min(100, Math.max(0, overallScore)),
    };
  }

  /**
   * Job Match Quality (30%)
   * Based on average match score of saved and applied jobs
   */
  private calculateJobMatchQuality(user: PlacementSuiteUser): number {
    if (user.savedJobs.length === 0) return 0;

    const totalScore = user.savedJobs.reduce((sum, job) => sum + job.matchScore, 0);
    const avgScore = totalScore / user.savedJobs.length;

    // Boost if applied to jobs
    const appliedJobs = user.applications.filter((app) => app.stage === "applied");
    const similarityBoost = Math.min(20, appliedJobs.length * 5);

    return Math.min(100, Math.round(avgScore + similarityBoost));
  }

  /**
   * JD Skill Alignment (25%)
   * Based on how well resume skills match JD requirements across recent applications
   */
  private calculateJDSkillAlignment(user: PlacementSuiteUser): number {
    if (Object.keys(user.jdAnalyses).length === 0) return 0;

    const analyses = Object.values(user.jdAnalyses);
    const currentResume = user.resumeData.find((r) => r.id === user.currentResumeId);

    if (!currentResume) return 0;

    // Extract skills from current resume
    const resumeSkillsSection = currentResume.sections.find((s) => s.type === "skills");
    const resumeSkills = resumeSkillsSection?.content.skills || [];

    // Calculate alignment for each JD analysis
    const alignmentScores = analyses.map((analysis) => {
      const requiredSkills = analysis.requiredSkills || [];
      if (requiredSkills.length === 0) return 50;

      const matchedSkills = requiredSkills.filter((skill) =>
        resumeSkills.some((resumeSkill) =>
          typeof resumeSkill === "string" && resumeSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );

      return (matchedSkills.length / requiredSkills.length) * 100;
    });

    const avgAlignment =
      alignmentScores.length > 0 ? alignmentScores.reduce((a, b) => a + b, 0) / alignmentScores.length : 0;

    return Math.round(avgAlignment);
  }

  /**
   * Resume ATS Score (25%)
   * Direct ATS score from current resume
   */
  private calculateResumeAtsScore(user: PlacementSuiteUser): number {
    const currentResume = user.resumeData.find((r) => r.id === user.currentResumeId);
    return currentResume ? currentResume.atsScore : 0;
  }

  /**
   * Application Progress (10%)
   * Based on how far applications have progressed in pipeline
   */
  private calculateApplicationProgress(user: PlacementSuiteUser): number {
    if (user.applications.length === 0) return 0;

    // Weight different stages
    const stageWeights = {
      saved: 10,
      applied: 30,
      interview_scheduled: 50,
      interview_completed: 70,
      offer: 100,
      rejected: 5,
    };

    const totalWeight = user.applications.reduce((sum, app) => {
      return sum + (stageWeights[app.stage as keyof typeof stageWeights] || 0);
    }, 0);

    const avgWeight = totalWeight / user.applications.length;
    return Math.round(avgWeight);
  }

  /**
   * Practice Completion (10%)
   * Based on problems solved and mock interviews completed
   */
  private calculatePracticeCompletion(user: PlacementSuiteUser): number {
    const solvedProblems = user.practiceProblems.filter((p) => p.solved).length;
    const totalProblems = user.practiceProblems.length;
    const problemsScore = totalProblems > 0 ? (solvedProblems / totalProblems) * 50 : 0;

    const completedInterviews = user.mockInterviews.filter((m) => m.completed).length;
    const totalInterviews = user.mockInterviews.length;
    const interviewScore = totalInterviews > 0 ? (completedInterviews / totalInterviews) * 50 : 0;

    return Math.round(problemsScore + interviewScore);
  }

  /**
   * Get weak skill alerts based on JD analysis and resume
   */
  getWeakSkillAlerts(user: PlacementSuiteUser): string[] {
    const alerts: string[] = [];
    const analyses = Object.values(user.jdAnalyses);
    const currentResume = user.resumeData.find((r) => r.id === user.currentResumeId);

    if (!currentResume) return alerts;

    const resumeSkillsSection = currentResume.sections.find((s) => s.type === "skills");
    const resumeSkills = (resumeSkillsSection?.content.skills || []) as string[];

    // Find missing skills across multiple JDs
    const skillGaps = new Map<string, number>();

    analyses.forEach((analysis) => {
      analysis.requiredSkills?.forEach((skill) => {
        const hasSkill = resumeSkills.some((s) =>
          typeof s === "string" && s.toLowerCase().includes(skill.toLowerCase())
        );
        if (!hasSkill) {
          skillGaps.set(skill, (skillGaps.get(skill) || 0) + 1);
        }
      });
    });

    // Convert to alerts, sorted by frequency
    Array.from(skillGaps.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([skill, frequency]) => {
        if (frequency > 1) {
          alerts.push(`${skill} is required in ${frequency} job descriptions - consider learning this`);
        }
      });

    return alerts;
  }

  /**
   * Get next action recommendation based on current state
   */
  getNextActionRecommendation(user: PlacementSuiteUser): string {
    const readiness = user.readinessScore;

    // Check ATS score first
    if (readiness.resumeAtsScore < 60) {
      return "🔴 Improve your resume ATS score - fix critical issues first";
    }

    // Check skill alignment
    if (readiness.jdSkillAlignment < 50) {
      return "🟡 Learn missing skills identified in job descriptions";
    }

    // Check if actively applying
    const recentlyApplied = user.applications.filter(
      (a) => new Date(a.appliedDate).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    );

    if (recentlyApplied.length === 0) {
      return "🔵 Start applying to matched jobs";
    }

    // Check if scheduled interviews
    const upcomingInterviews = user.applications.filter((a) => a.stage === "interview_scheduled");

    if (upcomingInterviews.length === 0 && user.applications.length > 2) {
      return "🟢 Great! You're actively applying. Practice mock interviews to prepare";
    }

    if (upcomingInterviews.length > 0) {
      return "✅ You have upcoming interviews! Focus on preparation";
    }

    return "Maintain consistent practice and applications";
  }

  /**
   * Generate readiness report
   */
  generateReadinessReport(user: PlacementSuiteUser): {
    score: number;
    level: "Beginning" | "Developing" | "Proficient" | "Advanced" | "Expert";
    summary: string;
    recommendations: string[];
  } {
    const score = user.readinessScore.overallScore;

    let level: "Beginning" | "Developing" | "Proficient" | "Advanced" | "Expert";
    if (score < 30) level = "Beginning";
    else if (score < 50) level = "Developing";
    else if (score < 70) level = "Proficient";
    else if (score < 85) level = "Advanced";
    else level = "Expert";

    const recommendations: string[] = [];

    if (user.readinessScore.resumeAtsScore < 70) {
      recommendations.push("Optimize resume for ATS - add missing action verbs and skills");
    }

    if (user.readinessScore.jdSkillAlignment < 60) {
      recommendations.push("Focus on learning high-demand skills from analyzed jobs");
    }

    if (user.applications.length < 5) {
      recommendations.push("Apply to at least 5-10 matching jobs");
    }

    if (user.practiceProblems.filter((p) => p.solved).length < 10) {
      recommendations.push("Complete more practice problems to improve coding skills");
    }

    if (user.mockInterviews.filter((m) => m.completed).length === 0) {
      recommendations.push("Schedule your first mock interview");
    }

    const summary = `You're ${level} in your placement journey with a score of ${score}/100. ${recommendations[0] || "Keep up the good work!"}`;

    return {
      score,
      level,
      summary,
      recommendations: recommendations.slice(0, 5),
    };
  }
}

export const readinessCalculator = new ReadinessScoreCalculator();
