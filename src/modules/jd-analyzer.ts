import { JDAnalysis } from "@/types";

/**
 * JD Analyzer Plus
 * Analyzes job descriptions and extracts key information for resume alignment
 */
export class JDAnalyzer {
  private readonly skillKeywords = {
    technical: [
      "javascript",
      "typescript",
      "react",
      "nodejs",
      "python",
      "java",
      "sql",
      "mongodb",
      "aws",
      "docker",
      "kubernetes",
      "git",
      "rest api",
      "graphql",
      "html",
      "css",
      "tailwind",
    ],
    soft: ["communication", "leadership", "teamwork", "problem-solving", "ux", "design", "agile", "scrum"],
  };

  private readonly difficultyMarkers = {
    easy: ["junior", "entry-level", "fresher", "internship", "no experience required"],
    medium: ["intermediate", "2-3 years", "mid-level"],
    hard: ["senior", "5+ years", "lead", "architect", "principal"],
  };

  /**
   * Analyze a job description and extract key data
   */
  analyzeJobDescription(description: string, title: string): Partial<JDAnalysis> {
    const descLower = description.toLowerCase();
    const titleLower = title.toLowerCase();

    // Extract required and preferred skills
    const requiredSkills = this.extractSkills(description, true);
    const preferredSkills = this.extractSkills(description, false);

    // Extract experience requirement
    const experienceRequired = this.extractExperience(description);

    // Extract responsibilities
    const responsibilities = this.extractResponsibilities(description);

    // Extract keywords for resume
    const keywordsForResume = this.extractResumeKeywords(description, requiredSkills);

    // Determine difficulty
    const difficultyRating = this.determineDifficulty(description);

    // Estimate preparation time
    const estimatedPreparationTime = this.estimatePreparationTime(requiredSkills, difficultyRating);

    return {
      requiredSkills,
      preferredSkills,
      experienceRequired,
      responsibilities,
      keywordsForResume,
      difficultyRating,
      estimatedPreparationTime,
    };
  }

  private extractSkills(text: string, isRequired: boolean = true): string[] {
    const textLower = text.toLowerCase();
    const skills = new Set<string>();

    // Find technical skills
    this.skillKeywords.technical.forEach((skill) => {
      if (textLower.includes(skill)) {
        skills.add(skill);
      }
    });

    // Find soft skills if not required
    if (!isRequired) {
      this.skillKeywords.soft.forEach((skill) => {
        if (textLower.includes(skill)) {
          skills.add(skill);
        }
      });
    }

    // Look for "requirements:" section
    const requirementsMatch = text.match(/requirements?:?([\s\S]*?)(?:responsibilities|qualifications|about|$)/i);
    if (requirementsMatch) {
      const requirementsText = requirementsMatch[1];
      const skillPatterns = [
        /(?:know|require|must|experience with)[\s\S]{0,50}?\b([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*)\b/gi,
        /(?:fluent|proficient)\s+(?:in|with)[\s\S]{0,50}?\b([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*)\b/gi,
      ];

      skillPatterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(requirementsText)) !== null) {
          const skill = match[1].toLowerCase();
          if (skill.length > 2 && skill.length < 50) {
            skills.add(skill);
          }
        }
      });
    }

    return Array.from(skills).sort();
  }

  private extractExperience(text: string): string {
    const experiencePatterns = [
      /(\d+)\s*(?:\+)?\s*years?\s+(?:of\s+)?(?:professional\s+)?experience/i,
      /(?:experience|background)?:?\s*(\d+)\s*(?:\+)?\s*years?/i,
      /(?:fresher|entry.level|junior|senior|lead)/i,
    ];

    for (const pattern of experiencePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return "Not specified";
  }

  private extractResponsibilities(text: string): string[] {
    const responsibilities: string[] = [];

    // Look for responsibilities section
    const respMatch = text.match(/responsibilities?:?([\s\S]*?)(?:requirements|qualifications|benefits|$)/i);
    if (respMatch) {
      const respText = respMatch[1];
      // Split by bullet points or newlines
      const items = respText.split(/[\n•\-*]/).filter((item) => item.trim().length > 10);
      responsibilities.push(...items.map((item) => item.trim()).slice(0, 8)); // Limit to 8
    }

    return responsibilities;
  }

  private extractResumeKeywords(text: string, skills: string[]): string[] {
    const keywords = new Set<string>(skills);

    // Add important nouns and action verbs
    const actionVerbs = [
      "develop",
      "design",
      "implement",
      "manage",
      "lead",
      "improve",
      "create",
      "optimize",
      "build",
      "deliver",
    ];
    const nouns = ["system", "application", "platform", "service", "infrastructure", "architecture"];

    const textLower = text.toLowerCase();

    actionVerbs.forEach((verb) => {
      if (textLower.includes(verb)) {
        keywords.add(verb);
      }
    });

    nouns.forEach((noun) => {
      if (textLower.includes(noun)) {
        keywords.add(noun);
      }
    });

    return Array.from(keywords).slice(0, 20);
  }

  private determineDifficulty(text: string): "Easy" | "Medium" | "Hard" {
    const textLower = text.toLowerCase();
    let easyScore = 0;
    let mediumScore = 0;
    let hardScore = 0;

    this.difficultyMarkers.easy.forEach((marker) => {
      if (textLower.includes(marker)) easyScore++;
    });

    this.difficultyMarkers.medium.forEach((marker) => {
      if (textLower.includes(marker)) mediumScore++;
    });

    this.difficultyMarkers.hard.forEach((marker) => {
      if (textLower.includes(marker)) hardScore++;
    });

    if (hardScore > mediumScore && hardScore > easyScore) return "Hard";
    if (mediumScore > easyScore) return "Medium";
    return "Easy";
  }

  private estimatePreparationTime(skills: string[], difficulty: "Easy" | "Medium" | "Hard"): number {
    const baseTime = {
      Easy: 5,
      Medium: 15,
      Hard: 30,
    };

    const timePerSkill = {
      Easy: 1,
      Medium: 3,
      Hard: 5,
    };

    return baseTime[difficulty] + skills.length * timePerSkill[difficulty];
  }

  /**
   * Compare JD analysis with resume
   */
  compareWithResume(
    analysis: JDAnalysis,
    resumeSkills: string[]
  ): {
    matchedSkills: string[];
    missingSkills: string[];
    alignmentScore: number;
  } {
    const resumeSkillsLower = resumeSkills.map((s) => s.toLowerCase());

    const matchedSkills = analysis.requiredSkills.filter((skill) =>
      resumeSkillsLower.some((resumeSkill) => resumeSkill.includes(skill) || skill.includes(resumeSkill))
    );

    const missingSkills = analysis.requiredSkills.filter((skill) => !matchedSkills.includes(skill));

    const alignmentScore =
      analysis.requiredSkills.length > 0
        ? Math.round((matchedSkills.length / analysis.requiredSkills.length) * 100)
        : 50;

    return {
      matchedSkills,
      missingSkills,
      alignmentScore,
    };
  }

  /**
   * Generate actionable insights from JD
   */
  generateInsights(analysis: JDAnalysis): string[] {
    const insights: string[] = [];

    if (analysis.missingSkills && analysis.missingSkills.length > 0) {
      insights.push(`Focus on learning: ${analysis.missingSkills.slice(0, 3).join(", ")}`);
    }

    if (analysis.difficultyRating === "Hard") {
      insights.push(`This is a senior role - ensure your experience section is strong`);
    }

    if (analysis.estimatedPreparationTime > 20) {
      insights.push(`Allocate at least ${analysis.estimatedPreparationTime} hours for thorough preparation`);
    }

    insights.push(`Customize your resume with keywords: ${analysis.keywordsForResume.slice(0, 5).join(", ")}`);

    return insights;
  }
}

export const jdAnalyzer = new JDAnalyzer();
