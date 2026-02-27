import { Job } from "@/types";

interface JobMatchOptions {
  title?: string;
  keywords?: string[];
  experienceLevel?: string;
  location?: string;
}

/**
 * Job Intelligence Engine
 * Calculates job match scores based on multiple factors
 */
export class JobIntelligenceEngine {
  private readonly MAX_SCORE = 100;

  /**
   * Calculate match score for a job based on resume and preferences
   */
  calculateMatchScore(
    job: Job,
    resumeSkills: string[],
    preferences: {
      targetRole?: string;
      targetCompanies?: string[];
      preferredLocations?: string[];
    }
  ): number {
    let score = 0;

    // Title match (30%)
    const titleMatch = this.calculateTitleMatch(job.title, preferences.targetRole);
    score += titleMatch * 0.3;

    // Skills match (40%)
    const skillsMatch = this.calculateSkillsMatch(job.requirements, resumeSkills);
    score += skillsMatch * 0.4;

    // Location match (15%)
    const locationMatch = this.calculateLocationMatch(job.location, preferences.preferredLocations);
    score += locationMatch * 0.15;

    // Company preference (15%)
    const companyMatch = this.calculateCompanyMatch(job.company, preferences.targetCompanies);
    score += companyMatch * 0.15;

    return Math.round(Math.min(score, this.MAX_SCORE));
  }

  private calculateTitleMatch(jobTitle: string, targetRole?: string): number {
    if (!targetRole) return 50; // Default neutral score

    const jobTitleLower = jobTitle.toLowerCase();
    const targetLower = targetRole.toLowerCase();

    if (jobTitleLower.includes(targetLower) || targetLower.includes(jobTitleLower)) {
      return 100;
    }

    // Partial match
    const jobWords = jobTitleLower.split(" ");
    const targetWords = targetLower.split(" ");
    const matches = jobWords.filter((word) => targetWords.includes(word)).length;

    return (matches / Math.max(jobWords.length, targetWords.length)) * 100;
  }

  private calculateSkillsMatch(jobRequirements: string[], resumeSkills: string[]): number {
    if (jobRequirements.length === 0) return 50;

    const resumeSkillsLower = resumeSkills.map((s) => s.toLowerCase());
    const matchedSkills = jobRequirements.filter((req) =>
      resumeSkillsLower.some((skill) => skill.includes(req.toLowerCase()) || req.toLowerCase().includes(skill))
    );

    return (matchedSkills.length / jobRequirements.length) * 100;
  }

  private calculateLocationMatch(jobLocation: string, preferredLocations?: string[]): number {
    if (!preferredLocations || preferredLocations.length === 0) return 50;

    const jobLocationLower = jobLocation.toLowerCase();
    const hasMatch = preferredLocations.some((loc) => jobLocationLower.includes(loc.toLowerCase()));

    return hasMatch ? 100 : 30;
  }

  private calculateCompanyMatch(company: string, targetCompanies?: string[]): number {
    if (!targetCompanies || targetCompanies.length === 0) return 50;

    const companyLower = company.toLowerCase();
    const hasMatch = targetCompanies.some((target) => companyLower.includes(target.toLowerCase()));

    return hasMatch ? 100 : 40;
  }

  /**
   * Filter jobs based on criteria
   */
  filterJobs(jobs: Job[], options: JobMatchOptions): Job[] {
    return jobs.filter((job) => {
      if (options.title && !job.title.toLowerCase().includes(options.title.toLowerCase())) {
        return false;
      }

      if (options.keywords && options.keywords.length > 0) {
        const hasKeyword = options.keywords.some((keyword) =>
          job.description.toLowerCase().includes(keyword.toLowerCase()) ||
          job.title.toLowerCase().includes(keyword.toLowerCase())
        );
        if (!hasKeyword) return false;
      }

      if (options.location && !job.location.toLowerCase().includes(options.location.toLowerCase())) {
        return false;
      }

      return true;
    });
  }

  /**
   * Rank jobs by match score
   */
  rankJobs(jobs: Job[]): Job[] {
    return [...jobs].sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Get top N jobs
   */
  getTopJobs(jobs: Job[], count: number = 5): Job[] {
    return this.rankJobs(jobs).slice(0, count);
  }

  /**
   * Analyze job trends from multiple jobs
   */
  analyzeTrends(jobs: Job[]): {
    commonSkills: string[];
    commonRoles: string[];
    salaryTrend: { min: number; max: number; avg: number };
  } {
    const skillsMap = new Map<string, number>();
    const rolesMap = new Map<string, number>();
    const salaries: number[] = [];

    jobs.forEach((job) => {
      // Collect skills
      job.requirements.forEach((skill) => {
        skillsMap.set(skill, (skillsMap.get(skill) || 0) + 1);
      });

      // Collect roles (from title)
      const roles = job.title.split(" ");
      roles.forEach((role) => {
        rolesMap.set(role, (rolesMap.get(role) || 0) + 1);
      });

      // Collect salaries
      if (job.salary) {
        salaries.push(job.salary.min, job.salary.max);
      }
    });

    // Get most common skills and roles
    const commonSkills = Array.from(skillsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map((entry) => entry[0]);

    const commonRoles = Array.from(rolesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry) => entry[0]);

    // Calculate salary trend
    const salaryTrend = {
      min: Math.min(...salaries, 0),
      max: Math.max(...salaries, 0),
      avg: salaries.length > 0 ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0,
    };

    return { commonSkills, commonRoles, salaryTrend };
  }
}

export const jobIntelligenceEngine = new JobIntelligenceEngine();
