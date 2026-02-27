import { ResumData, ResumeSection } from "@/types";

interface ATSCheckResult {
  score: number; // 0-100
  issues: {
    critical: string[];
    warnings: string[];
    suggestions: string[];
  };
  keywords: {
    found: string[];
    missing: string[];
  };
}

/**
 * AI Resume Builder with ATS Scoring
 * Builds and optimizes resumes for ATS systems
 */
export class ResumeBuilder {
  private readonly atsKeywords = {
    must_have: [
      "contact information",
      "professional summary",
      "work experience",
      "education",
      "skills",
    ],
    format_requirements: [
      "no images",
      "no tables",
      "standard fonts",
      "clear headings",
      "bullet points",
      "no graphics",
    ],
    technical_safe: ["Arial", "Calibri", "Times New Roman", "Courier New"],
  };

  /**
   * Calculate ATS score for a resume
   */
  calculateATSScore(resume: ResumData): ATSCheckResult {
    const issues = {
      critical: [] as string[],
      warnings: [] as string[],
      suggestions: [] as string[],
    };

    const keywords = {
      found: [] as string[],
      missing: [] as string[],
    };

    let score = 100;

    // Check for required sections
    const sectionTypes = resume.sections.map((s) => s.type);

    // Must have sections
    if (!sectionTypes.includes("personal")) {
      issues.critical.push("Missing personal information section");
      score -= 15;
    }
    if (!sectionTypes.includes("experience") && !sectionTypes.includes("projects")) {
      issues.critical.push(
        "Missing work experience or projects - at least one is required"
      );
      score -= 15;
    }
    if (!sectionTypes.includes("education")) {
      issues.warnings.push("Missing education section - highly recommended");
      score -= 10;
    }
    if (!sectionTypes.includes("skills")) {
      issues.critical.push("Missing skills section - essential for ATS");
      score -= 15;
    }

    // Check content quality
    const totalChars = resume.sections.reduce(
      (sum, section) => sum + JSON.stringify(section.content).length,
      0
    );

    if (totalChars < 300) {
      issues.warnings.push("Resume content is too short");
      score -= 10;
    }

    // Check for keywords
    const resumeText = JSON.stringify(resume.sections).toLowerCase();
    const commonKeywords = [
      "achieved",
      "managed",
      "improved",
      "increased",
      "implemented",
      "designed",
      "led",
      "coordinated",
      "developed",
      "created",
    ];

    commonKeywords.forEach((keyword) => {
      if (resumeText.includes(keyword)) {
        keywords.found.push(keyword);
      } else {
        keywords.missing.push(keyword);
      }
    });

    if (keywords.missing.length > 5) {
      issues.suggestions.push(
        "Add action verbs like: " + keywords.missing.slice(0, 3).join(", ")
      );
      score -= 10;
    }

    // Check for quantifiable metrics
    const metricPattern = /\d+(?:%|%|x|times?|people|projects|years?)/gi;
    const hasMetrics = metricPattern.test(resumeText);

    if (!hasMetrics) {
      issues.suggestions.push(
        "Add quantifiable metrics and numbers to make achievements more impactful"
      );
      score -= 8;
    }

    // Check for common mistakes
    if (resumeText.includes("responsibilities:")) {
      issues.warnings.push(
        'Avoid listing "Responsibilities:" - use achievements instead'
      );
      score -= 5;
    }

    // Accessibility checks
    if (resume.theme && !this.isACTAccessibleFormat(resume.theme)) {
      issues.suggestions.push(
        "Consider using simpler color theme for better ATS compatibility"
      );
      score -= 3;
    }

    // Ensure score is between 0-100
    score = Math.max(0, Math.min(100, score));

    return {
      score,
      issues,
      keywords,
    };
  }

  private isACTAccessibleFormat(theme: string): boolean {
    const compatibleThemes = ["blue", "purple"];
    return compatibleThemes.includes(theme);
  }

  /**
   * Generate ATS-optimized resume content
   */
  optimizeForATS(resume: ResumData, jobKeywords: string[]): ResumData {
    const optimized = { ...resume };

    // Ensure sections are properly formatted
    optimized.sections = optimized.sections.map((section) => {
      if (section.type === "skills") {
        // Ensure skills include job keywords
        const existingSkills = section.content.skills || [];
        const enhancedSkills = Array.from(
          new Set([...existingSkills, ...jobKeywords])
        ).slice(0, 15);

        return {
          ...section,
          content: {
            ...section.content,
            skills: enhancedSkills,
          },
        };
      }

      if (section.type === "summary") {
        // Ensure summary includes relevant keywords
        const summaryText = section.content.summary || "";
        const hasKeywords = jobKeywords.some((kw) =>
          summaryText.toLowerCase().includes(kw.toLowerCase())
        );

        if (!hasKeywords && jobKeywords.length > 0) {
          return {
            ...section,
            content: {
              ...section.content,
              summary:
                summaryText +
                ` Experienced with ${jobKeywords.slice(0, 2).join(", ")}.`,
            },
          };
        }
      }

      return section;
    });

    return optimized;
  }

  /**
   * Get resume suggestions based on ATS analysis
   */
  getImprovementSuggestions(atsResult: ATSCheckResult): string[] {
    const suggestions: string[] = [];

    // Critical issues first
    if (atsResult.issues.critical.length > 0) {
      suggestions.push(
        `CRITICAL: ${atsResult.issues.critical[0]} - Fix immediately`
      );
    }

    // Warnings
    if (atsResult.issues.warnings.length > 0) {
      suggestions.push(
        `WARNING: ${atsResult.issues.warnings[0]} - Highly recommended to fix`
      );
    }

    // General suggestions
    if (atsResult.score < 70) {
      suggestions.push("Your resume needs significant improvements for ATS");
    }

    if (atsResult.keywords.missing.length > 0) {
      suggestions.push(
        `Add action verbs: ${atsResult.keywords.missing.slice(0, 3).join(", ")}`
      );
    }

    suggestions.push(...atsResult.issues.suggestions);

    return suggestions.slice(0, 5);
  }

  /**
   * Generate a sample resume structure
   */
  generateSampleResume(): ResumData {
    return {
      id: Date.now().toString(),
      title: "My Resume",
      template: "professional",
      theme: "blue",
      atsScore: 0,
      lastUpdated: new Date().toISOString(),
      content: "",
      sections: [
        {
          id: "1",
          type: "personal",
          content: {
            name: "Your Name",
            email: "your.email@example.com",
            phone: "+1 (555) 123-4567",
            location: "City, State",
          },
        },
        {
          id: "2",
          type: "summary",
          content: {
            summary:
              "Results-driven professional with strong technical skills and proven track record of delivering projects on time.",
          },
        },
        {
          id: "3",
          type: "experience",
          content: {
            experiences: [
              {
                position: "Senior Developer",
                company: "Tech Company",
                duration: "2023 - Present",
                achievements: [
                  "Led development of high-impact features",
                  "Improved system performance by 40%",
                  "Managed team of 3 engineers",
                ],
              },
            ],
          },
        },
        {
          id: "4",
          type: "education",
          content: {
            education: [
              {
                degree: "Bachelor of Science in Computer Science",
                institution: "University Name",
                year: "2020",
              },
            ],
          },
        },
        {
          id: "5",
          type: "skills",
          content: {
            skills: [
              "JavaScript",
              "React",
              "TypeScript",
              "Node.js",
              "SQL",
              "AWS",
              "Docker",
              "Problem Solving",
              "Leadership",
            ],
          },
        },
      ],
    };
  }

  /**
   * Convert resume to PDF-friendly format (text)
   */
  generatePlainText(resume: ResumData): string {
    let text = "";

    resume.sections.forEach((section) => {
      switch (section.type) {
        case "personal":
          text += `${section.content.name}\n`;
          text += `${section.content.email} | ${section.content.phone}\n`;
          text += `${section.content.location}\n\n`;
          break;

        case "summary":
          text += `PROFESSIONAL SUMMARY\n`;
          text += `${section.content.summary}\n\n`;
          break;

        case "experience":
          text += `EXPERIENCE\n`;
          section.content.experiences?.forEach((exp: any) => {
            text += `${exp.position} at ${exp.company}\n`;
            text += `${exp.duration}\n`;
            exp.achievements?.forEach((achievement: string) => {
              text += `• ${achievement}\n`;
            });
            text += "\n";
          });
          break;

        case "education":
          text += `EDUCATION\n`;
          section.content.education?.forEach((edu: any) => {
            text += `${edu.degree} from ${edu.institution} (${edu.year})\n`;
          });
          text += "\n";
          break;

        case "skills":
          text += `SKILLS\n`;
          text += `${section.content.skills?.join(", ")}\n\n`;
          break;
      }
    });

    return text;
  }
}

export const resumeBuilder = new ResumeBuilder();
