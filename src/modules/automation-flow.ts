import { Job, JDAnalysis, ResumData, Application } from "@/types";
import { jdAnalyzer } from "./jd-analyzer";
import { resumeBuilder } from "./resume-builder";

/**
 * Cross-Module Automation Flow
 * Orchestrates the complete pipeline for automated resume optimization
 */
export class AutomationFlow {
  /**
   * Main automation: User saves job -> full pipeline triggers
   * 1. User saves a job
   * 2. JD is automatically analyzed
   * 3. System extracts required skills
   * 4. Checks current resume for skill matches
   * 5. Highlights missing skills
   * 6. Suggests resume updates
   * 7. Updates overall readiness score
   */
  async runFullJobApplicationFlow(
    job: Job,
    currentResume: ResumData
  ): Promise<{
    analysis: Partial<JDAnalysis>;
    resumeRecommendations: string[];
    optimizedResume: ResumData;
    missingSkills: string[];
    alignmentScore: number;
  }> {
    // Step 1: Analyze JD
    const analysis = jdAnalyzer.analyzeJobDescription(job.description, job.title);

    // Step 2: Extract required skills
    const requiredSkills = analysis.requiredSkills || [];

    // Step 3: Check resume skills
    const resumeSkillsSection = currentResume.sections.find((s) => s.type === "skills");
    const resumeSkills = (resumeSkillsSection?.content.skills || []) as string[];

    // Step 4: Find skill matches
    const { matchedSkills, missingSkills, alignmentScore } = jdAnalyzer.compareWithResume(
      analysis as JDAnalysis,
      resumeSkills
    );

    // Step 5: Get resume recommendations
    const resumeRecommendations = this.generateResumeImprovementSuggestions(
      analysis,
      matchedSkills,
      missingSkills
    );

    // Step 6: Optimize resume
    const optimizedResume = resumeBuilder.optimizeForATS(currentResume, analysis.keywordsForResume || []);

    // Step 7: Recalculate ATS score
    const atsResult = resumeBuilder.calculateATSScore(optimizedResume);
    optimizedResume.atsScore = atsResult.score;

    return {
      analysis,
      resumeRecommendations,
      optimizedResume,
      missingSkills,
      alignmentScore,
    };
  }

  /**
   * Suggest resume improvements based on JD analysis
   */
  private generateResumeImprovementSuggestions(
    analysis: Partial<JDAnalysis>,
    matchedSkills: string[],
    missingSkills: string[]
  ): string[] {
    const suggestions: string[] = [];

    // Add missing skills notice
    if (missingSkills.length > 0) {
      suggestions.push(`Learn these missing skills: ${missingSkills.slice(0, 3).join(", ")}`);
    }

    // Add keywords suggestion
    if (analysis.keywordsForResume && analysis.keywordsForResume.length > 0) {
      suggestions.push(
        `Add these keywords to your skills: ${analysis.keywordsForResume.slice(0, 3).join(", ")}`
      );
    }

    // Add achievement suggestion based on JD
    if (analysis.responsibilities && analysis.responsibilities.length > 0) {
      suggestions.push(`Highlight achievements related to: ${analysis.responsibilities[0]}`);
    }

    // Add preparation time estimate
    if (analysis.estimatedPreparationTime) {
      suggestions.push(
        `Allocate ${analysis.estimatedPreparationTime} hours for interview preparation`
      );
    }

    return suggestions.slice(0, 5);
  }

  /**
   * Analyze application momentum
   * Tracks how quickly applications progress through pipeline
   */
  analyzeApplicationMomentum(applications: Application[]): {
    averageTimeToInterview: number; // in days
    averageTimeToOffer: number; // in days
    conversionRate: number; // percentage
    typicalPipeline: string;
  } {
    const now = Date.now();

    // Calculate time metrics
    const interviewedApps = applications.filter((a) => a.stage !== "saved");
    const appliedApps = applications.filter((a) => a.stage !== "saved");

    let totalTimeToInterview = 0;
    let interviewConversions = 0;

    interviewedApps.forEach((app) => {
      const appliedDate = new Date(app.appliedDate).getTime();
      const interviewDate = app.interviewDate ? new Date(app.interviewDate).getTime() : now;
      totalTimeToInterview += (interviewDate - appliedDate) / (1000 * 60 * 60 * 24);
      if (app.stage !== "rejected") {
        interviewConversions++;
      }
    });

    const averageTimeToInterview =
      interviewedApps.length > 0 ? Math.round(totalTimeToInterview / interviewedApps.length) : 0;

    const offers = applications.filter((a) => a.stage === "offer");
    let totalTimeToOffer = 0;

    offers.forEach((app) => {
      const appliedDate = new Date(app.appliedDate).getTime();
      totalTimeToOffer += (now - appliedDate) / (1000 * 60 * 60 * 24);
    });

    const averageTimeToOffer = offers.length > 0 ? Math.round(totalTimeToOffer / offers.length) : 0;

    // Calculate conversion rate
    const conversionRate = appliedApps.length > 0 ? (interviewConversions / appliedApps.length) * 100 : 0;

    // Determine typical pipeline
    let typicalPipeline = "Applied → Initial Review";
    if (averageTimeToInterview > 0) {
      typicalPipeline += ` → Interview (${averageTimeToInterview} days)`;
    }
    if (averageTimeToOffer > 0) {
      typicalPipeline += ` → Offer (${averageTimeToOffer} days)`;
    }

    return {
      averageTimeToInterview,
      averageTimeToOffer,
      conversionRate: Math.round(conversionRate),
      typicalPipeline,
    };
  }

  /**
   * Identify stalled applications
   */
  identifyStalledApplications(applications: Application[], stalledDaysThreshold: number = 14): Application[] {
    const now = Date.now();
    return applications.filter((app) => {
      if (app.stage === "offer" || app.stage === "rejected") return false;

      const applicationDate = new Date(app.appliedDate).getTime();
      const daysSinceApplication = (now - applicationDate) / (1000 * 60 * 60 * 24);

      return daysSinceApplication > stalledDaysThreshold;
    });
  }

  /**
   * Generate next steps based on current application state
   */
  generateNextSteps(
    applications: Application[],
    resume: ResumData,
    jdAnalyses: Record<string, JDAnalysis>
  ): {
    immediate: string[];
    followUp: string[];
    preparation: string[];
  } {
    const steps = {
      immediate: [] as string[],
      followUp: [] as string[],
      preparation: [] as string[],
    };

    // Analyze application stages
    const savedOnly = applications.filter((a) => a.stage === "saved");
    const interviewed = applications.filter((a) => a.stage === "interview_completed");
    const scheduled = applications.filter((a) => a.stage === "interview_scheduled");

    // Immediate actions
    if (savedOnly.length > 0) {
      steps.immediate.push(`Apply to ${Math.min(3, savedOnly.length)} saved jobs`);
    }

    if (scheduled.length > 0) {
      steps.immediate.push(`Prepare for ${scheduled.length} upcoming interview(s)`);
    }

    // Follow-up
    if (interviewed.length > 0) {
      steps.followUp.push(`Follow up on ${interviewed.length} completed interview(s)`);
    }

    // Preparation
    if (resume.atsScore < 70) {
      steps.preparation.push("Improve resume ATS score");
    }

    const allKeywords = Object.values(jdAnalyses)
      .flatMap((jd) => jd.keywordsForResume || [])
      .slice(0, 5);

    if (allKeywords.length > 0) {
      steps.preparation.push(`Focus on these keywords: ${allKeywords.join(", ")}`);
    }

    return steps;
  }

  /**
   * Simulate application pipeline health
   */
  calculatePipelineHealth(applications: Application[]): {
    health: number; // 0-100
    status: "Critical" | "Warning" | "Good" | "Excellent";
    analysis: string;
  } {
    let health = 50; // Base score

    // Applications in progress
    const inProgress = applications.filter((a) => a.stage !== "saved" && a.stage !== "rejected").length;
    health += Math.min(20, inProgress * 5); // +5 per application in progress, max 20

    // Offers
    const offers = applications.filter((a) => a.stage === "offer").length;
    health += offers * 10; // +10 per offer

    // Rejection rate
    const rejections = applications.filter((a) => a.stage === "rejected").length;
    const rejectionRate = applications.length > 0 ? (rejections / applications.length) * 100 : 0;
    if (rejectionRate > 50) {
      health -= 20;
    } else if (rejectionRate > 30) {
      health -= 10;
    }

    // Momentum
    const recent = applications.filter(
      (a) => new Date(a.appliedDate).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    if (recent.length === 0) {
      health -= 15;
    }

    health = Math.max(0, Math.min(100, health));

    let status: "Critical" | "Warning" | "Good" | "Excellent";
    if (health < 30) status = "Critical";
    else if (health < 60) status = "Warning";
    else if (health < 80) status = "Good";
    else status = "Excellent";

    let analysis = "";
    if (status === "Critical") {
      analysis = "You need to apply to more jobs and improve your resume";
    } else if (status === "Warning") {
      analysis = "Your pipeline needs more momentum - keep applying";
    } else if (status === "Good") {
      analysis = "Good progress - maintain consistency";
    } else {
      analysis = "Excellent! Your pipeline is very healthy";
    }

    return { health, status, analysis };
  }
}

export const automationFlow = new AutomationFlow();
