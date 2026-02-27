import { Notification, PlacementSuiteUser, ApplicationStage } from "@/types";

/**
 * Notification Intelligence Layer
 * Triggers behavior-based nudges instead of random notifications
 */
export class NotificationIntelligence {
  /**
   * Analyze user state and generate contextual notifications
   */
  generateContextualNotifications(user: PlacementSuiteUser): Notification[] {
    const notifications: string[] = [];
    const baseTime = new Date().toISOString();

    // Notification 1: New high match job found
    const highScoreJobs = user.jobMatches.filter((j) => j.matchScore >= 80);
    if (highScoreJobs.length > user.applications.length) {
      notifications.push(
        `${highScoreJobs.length} high-match jobs (80%+) found. Start applying!|new_job_match`
      );
    }

    // Notification 2: Resume score below 70
    const currentResume = user.resumeData.find((r) => r.id === user.currentResumeId);
    if (currentResume && currentResume.atsScore < 70) {
      notifications.push(
        `Your resume ATS score is ${currentResume.atsScore}%. Improve it to increase interview chances|low_resume_score`
      );
    }

    // Notification 3: JD analyzed but no resume alignment
    const lowAlignmentJDs = Object.values(user.jdAnalyses).filter((jd) => {
      const skillMatch = user.jobMatches.find((j) => j.id === jd.jobId);
      if (!skillMatch) return false;

      const resumeSkills = currentResume?.sections.find((s) => s.type === "skills")?.content.skills || [];
      const alignment = resumeSkills.filter((skill) =>
        jd.requiredSkills.some((req) => typeof skill === "string" && skill.toLowerCase().includes(req.toLowerCase()))
      ).length;

      return alignment < jd.requiredSkills.length * 0.5; // Less than 50% alignment
    });

    if (lowAlignmentJDs.length > 0) {
      notifications.push(
        `${lowAlignmentJDs.length} analyzed jobs have low resume alignment. Consider learning key skills|jd_analyzed_no_alignment`
      );
    }

    // Notification 4: Interview in 24 hrs
    const upcomingInterviews = user.applications.filter((app) => {
      if (!app.interviewDate) return false;
      const hoursUntilInterview = (new Date(app.interviewDate).getTime() - Date.now()) / (1000 * 60 * 60);
      return hoursUntilInterview > 0 && hoursUntilInterview <= 24;
    });

    if (upcomingInterviews.length > 0) {
      notifications.push(
        `You have ${upcomingInterviews.length} interview(s) in the next 24 hours. Time to prepare!|interview_reminder`
      );
    }

    // Notification 5: No activity for 3 days
    const lastActivityDate = new Date(user.lastActivity).getTime();
    const daysSinceActivity = (Date.now() - lastActivityDate) / (1000 * 60 * 60 * 24);

    if (daysSinceActivity >= 3) {
      notifications.push(
        `No activity for ${Math.round(daysSinceActivity)} days. Apply to new jobs or practice to stay on track|inactivity_alert`
      );
    }

    // Convert to notification objects
    return notifications.map((notif, index) => {
      const [message, type] = notif.split("|");
      return {
        id: `notif-${Date.now()}-${index}`,
        type: type as any,
        title: this.getTitleForType(type as any),
        message,
        read: false,
        createdAt: baseTime,
      };
    });
  }

  private getTitleForType(type: string): string {
    const titles: Record<string, string> = {
      new_job_match: "🎯 New Job Matches",
      low_resume_score: "⚠️ Resume Score Alert",
      jd_analyzed_no_alignment: "📋 Skill Alignment Issue",
      interview_reminder: "📅 Upcoming Interview",
      inactivity_alert: "🔔 Stay Active",
    };
    return titles[type] || "Notification";
  }

  /**
   * Determine if user should receive notification based on preferences
   */
  shouldNotify(user: PlacementSuiteUser, type: string): boolean {
    if (!user.preferences.notificationsEnabled) return false;

    const now = new Date();
    const [hours, minutes] = user.preferences.notificationTime.split(":").map(Number);
    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes, 0);

    // Only notify during preferred time window (±2 hours)
    const timeDifference = Math.abs(now.getTime() - notificationTime.getTime()) / (1000 * 60);
    return timeDifference <= 120; // 2 hours window
  }

  /**
   * Prioritize notifications based on urgency
   */
  prioritizeNotifications(notifications: Notification[]): Notification[] {
    const priority: Record<string, number> = {
      interview_reminder: 1, // Most urgent
      low_resume_score: 2,
      jd_analyzed_no_alignment: 3,
      inactivity_alert: 4,
      new_job_match: 5, // Least urgent
    };

    return notifications.sort((a, b) => {
      const priorityA = priority[a.type] || 999;
      const priorityB = priority[b.type] || 999;
      return priorityA - priorityB;
    });
  }

  /**
   * Generate personalized nudges based on user state
   */
  generateNudges(user: PlacementSuiteUser): string[] {
    const nudges: string[] = [];

    // Based on scores
    if (user.readinessScore.overallScore < 30) {
      nudges.push("🚀 Start by uploading or creating your first resume");
      nudges.push("📌 Save 5-10 job postings that match your target role");
    } else if (user.readinessScore.overallScore < 50) {
      nudges.push("📊 Analyze your saved jobs to identify missing skills");
      nudges.push("✨ Update your resume based on job requirements");
    } else if (user.readinessScore.overallScore < 70) {
      nudges.push("💼 Start applying to 3-5 strong job matches");
      nudges.push("🎓 Practice mock interviews to prepare");
    } else if (user.readinessScore.overallScore < 85) {
      nudges.push("🎯 Close gaps in specialized skills");
      nudges.push("📈 Maintain consistent applications and interviews");
    } else {
      nudges.push("🏆 You're ready! Keep applying and practicing");
      nudges.push("💡 Help others in your network");
    }

    // Based on activities
    if (user.applications.length === 0) {
      nudges.push("👉 Apply to your first job today");
    }

    if (user.practiceProblems.filter((p) => p.solved).length === 0) {
      nudges.push("🧠 Solve your first practice problem");
    }

    return nudges;
  }

  /**
   * Check if user needs intervention alerts
   */
  getInterventionAlerts(user: PlacementSuiteUser): string[] {
    const alerts: string[] = [];

    // Resume quality alert
    const currentResume = user.resumeData.find((r) => r.id === user.currentResumeId);
    if (!currentResume || currentResume.atsScore < 50) {
      alerts.push("🔴 CRITICAL: Resume needs urgent improvements");
    }

    // No applications alert
    if (user.applications.length === 0 && user.savedJobs.length > 3) {
      alerts.push("🔴 You've saved jobs but haven't applied - start applying now");
    }

    // Skill gap alert
    const missingSkills = this.identifyMissingSkills(user);
    if (missingSkills.length > 8) {
      alerts.push(`🟡 WARNING: ${missingSkills.length} critical skills gaps identified`);
    }

    // Inactivity alert
    const daysSinceActivity = (Date.now() - new Date(user.lastActivity).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceActivity > 7) {
      alerts.push(`🟡 No activity for ${Math.round(daysSinceActivity)} days - stay active`);
    }

    return alerts;
  }

  private identifyMissingSkills(user: PlacementSuiteUser): string[] {
    const skillGaps = new Map<string, number>();
    const currentResume = user.resumeData.find((r) => r.id === user.currentResumeId);
    const resumeSkills = (currentResume?.sections.find((s) => s.type === "skills")?.content.skills || []) as string[];

    Object.values(user.jdAnalyses).forEach((jd) => {
      jd.requiredSkills?.forEach((skill) => {
        const hasSkill = resumeSkills.some((s) =>
          typeof s === "string" && s.toLowerCase().includes(skill.toLowerCase())
        );
        if (!hasSkill) {
          skillGaps.set(skill, (skillGaps.get(skill) || 0) + 1);
        }
      });
    });

    return Array.from(skillGaps.entries())
      .sort((a, b) => b[1] - a[1])
      .filter((entry) => entry[1] > 1)
      .map((entry) => entry[0]);
  }

  /**
   * Clear old notifications
   */
  clearOldNotifications(notifications: Notification[], daysOld: number = 7): Notification[] {
    const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
    return notifications.filter((n) => new Date(n.createdAt).getTime() > cutoffTime);
  }
}

export const notificationIntelligence = new NotificationIntelligence();
