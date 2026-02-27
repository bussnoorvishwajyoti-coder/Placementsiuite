// ============================================
// UNIFIED PLACEMENT SUITE DATA TYPES
// ============================================

// Job Intelligence Engine Types
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  jobUrl: string;
  postedDate: string;
  appliedDate?: string;
  saved: boolean;
  matchScore: number; // 0-100
  source: string;
}

// JD Analysis Types
export interface JDAnalysis {
  id: string;
  jobId: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceRequired: string;
  responsibilities: string[];
  keywordsForResume: string[];
  difficultyRating: "Easy" | "Medium" | "Hard";
  estimatedPreparationTime: number; // in hours
  analysisDate: string;
}

// Resume Data Types
export interface ResumeSection {
  id: string;
  type: "personal" | "summary" | "experience" | "education" | "skills" | "projects" | "certifications";
  content: Record<string, any>;
}

export interface ResumData {
  id: string;
  title: string;
  sections: ResumeSection[];
  template: "classic" | "modern" | "minimal" | "creative" | "professional";
  theme: "blue" | "green" | "red" | "purple" | "orange";
  atsScore: number; // 0-100
  lastUpdated: string;
  content: string;
}

// Application Tracking Types
export type ApplicationStage = "saved" | "applied" | "interview_scheduled" | "interview_completed" | "offer" | "rejected";

export interface Application {
  id: string;
  jobId: string;
  resumeId: string;
  stage: ApplicationStage;
  appliedDate: string;
  interviewDate?: string;
  interviewType?: "phone" | "technical" | "hr" | "final";
  interviewRating?: number; // 0-10
  notes: string;
  documents: {
    resume: string;
    coverLetter?: string;
  };
}

// Readiness Score Types
export interface ReadinessScoreBreakdown {
  jobMatchQuality: number; // 30%
  jdSkillAlignment: number; // 25%
  resumeAtsScore: number; // 25%
  applicationProgress: number; // 10%
  practiceCompletion: number; // 10%
  overallScore: number; // 0-100
}

// Practice & Learning Types
export interface PracticeProblem {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  solved: boolean;
  attempts: number;
  lastAttempt?: string;
}

export interface MockInterview {
  id: string;
  title: string;
  type: "technical" | "behavioral" | "hr";
  duration: number; // in minutes
  completed: boolean;
  rating?: number; // 0-10
  feedback?: string;
  date: string;
}

// Notification Types
export type NotificationType = 
  | "new_job_match" 
  | "low_resume_score" 
  | "jd_analyzed_no_alignment" 
  | "interview_reminder" 
  | "inactivity_alert";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: string;
  triggeredAt?: string;
}

// Global Platform User Schema
export interface PlacementSuiteUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  targetRole: string;
  targetCompanies: string[];
  currentLevel: "fresher" | "junior" | "mid" | "senior";
  
  // Module Data
  preferences: {
    jobCategories: string[];
    experienceLevel: string;
    salaryRange: { min: number; max: number };
    locations: string[];
    notificationsEnabled: boolean;
    notificationTime: string; // HH:mm format
  };
  
  resumeData: ResumData[];
  currentResumeId?: string;
  
  jobMatches: Job[];
  savedJobs: Job[];
  
  applications: Application[];
  jdAnalyses: Record<string, JDAnalysis>;
  
  readinessScore: ReadinessScoreBreakdown;
  practiceProblems: PracticeProblem[];
  mockInterviews: MockInterview[];
  
  notifications: Notification[];
  
  // Activity Tracking
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Summary Types
export interface DashboardSummary {
  topJobMatches: Job[]; // Top 5
  resumeAtsScore: number;
  jdReadinessScore: number;
  applicationPipeline: {
    saved: number;
    applied: number;
    interviewScheduled: number;
    offers: number;
  };
  weakSkillAlerts: string[]; // Skills to work on
  nextActionRecommendation: string;
  readinessScore: number; // Overall 0-100
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
