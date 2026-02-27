import { create } from "zustand";
import {
  PlacementSuiteUser,
  Job,
  ResumData,
  Application,
  JDAnalysis,
  ReadinessScoreBreakdown,
  Notification,
  ApplicationStage,
} from "@/types";

interface PlacementStore {
  // User State
  user: PlacementSuiteUser | null;
  setUser: (user: PlacementSuiteUser) => void;
  updateUser: (updates: Partial<PlacementSuiteUser>) => void;

  // Job Management
  addJob: (job: Job) => void;
  saveJob: (jobId: string) => void;
  unsaveJob: (jobId: string) => void;
  updateJobMatchScore: (jobId: string, score: number) => void;
  getSavedJobs: () => Job[];
  getJobById: (jobId: string) => Job | undefined;

  // Resume Management
  addResume: (resume: ResumData) => void;
  updateResume: (resumeId: string, updates: Partial<ResumData>) => void;
  setCurrentResume: (resumeId: string) => void;
  getResumes: () => ResumData[];
  getCurrentResume: () => ResumData | undefined;
  updateAtsScore: (resumeId: string, score: number) => void;

  // JD Analysis
  addJDAnalysis: (analysis: JDAnalysis) => void;
  getJDAnalysis: (jobId: string) => JDAnalysis | undefined;
  updateJDAnalysis: (jobId: string, updates: Partial<JDAnalysis>) => void;

  // Application Tracking
  addApplication: (app: Application) => void;
  updateApplicationStage: (appId: string, stage: ApplicationStage) => void;
  getApplicationsByStage: (stage: ApplicationStage) => Application[];
  getApplications: () => Application[];
  getApplicationById: (appId: string) => Application | undefined;

  // Readiness Score
  updateReadinessScore: (score: ReadinessScoreBreakdown) => void;
  calculateReadinessScore: () => number;
  getReadinessBreakdown: () => ReadinessScoreBreakdown;

  // Notifications
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  getUnreadNotifications: () => Notification[];
  getNotifications: () => Notification[];

  // Utility
  updateLastActivity: () => void;
  clearStore: () => void;
}

const initialReadinessScore: ReadinessScoreBreakdown = {
  jobMatchQuality: 0,
  jdSkillAlignment: 0,
  resumeAtsScore: 0,
  applicationProgress: 0,
  practiceCompletion: 0,
  overallScore: 0,
};

export const usePlacementStore = create<PlacementStore>((set, get) => ({
  user: null,

  setUser: (user) => set({ user }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates, updatedAt: new Date().toISOString() } : null,
    })),

  // Job Management
  addJob: (job) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            jobMatches: [...state.user.jobMatches, job],
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  saveJob: (jobId) =>
    set((state) => {
      if (!state.user) return {};
      const job = state.user.jobMatches.find((j) => j.id === jobId);
      return {
        user: job
          ? {
              ...state.user,
              savedJobs: [...state.user.savedJobs, job],
              jobMatches: state.user.jobMatches.map((j) =>
                j.id === jobId ? { ...j, saved: true } : j
              ),
              updatedAt: new Date().toISOString(),
            }
          : state.user,
      };
    }),

  unsaveJob: (jobId) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            savedJobs: state.user.savedJobs.filter((j) => j.id !== jobId),
            jobMatches: state.user.jobMatches.map((j) =>
              j.id === jobId ? { ...j, saved: false } : j
            ),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  updateJobMatchScore: (jobId, score) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            jobMatches: state.user.jobMatches.map((j) =>
              j.id === jobId ? { ...j, matchScore: score } : j
            ),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  getSavedJobs: () => get().user?.savedJobs || [],

  getJobById: (jobId) => get().user?.jobMatches.find((j) => j.id === jobId),

  // Resume Management
  addResume: (resume) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            resumeData: [...state.user.resumeData, resume],
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  updateResume: (resumeId, updates) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            resumeData: state.user.resumeData.map((r) =>
              r.id === resumeId ? { ...r, ...updates } : r
            ),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  setCurrentResume: (resumeId) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            currentResumeId: resumeId,
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  getResumes: () => get().user?.resumeData || [],

  getCurrentResume: () => {
    const user = get().user;
    if (!user || !user.currentResumeId) return undefined;
    return user.resumeData.find((r) => r.id === user.currentResumeId);
  },

  updateAtsScore: (resumeId, score) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            resumeData: state.user.resumeData.map((r) =>
              r.id === resumeId ? { ...r, atsScore: score } : r
            ),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  // JD Analysis
  addJDAnalysis: (analysis) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            jdAnalyses: {
              ...state.user.jdAnalyses,
              [analysis.jobId]: analysis,
            },
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  getJDAnalysis: (jobId) => get().user?.jdAnalyses[jobId],

  updateJDAnalysis: (jobId, updates) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            jdAnalyses: {
              ...state.user.jdAnalyses,
              [jobId]: { ...state.user.jdAnalyses[jobId], ...updates },
            },
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  // Application Tracking
  addApplication: (app) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            applications: [...state.user.applications, app],
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  updateApplicationStage: (appId, stage) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            applications: state.user.applications.map((a) =>
              a.id === appId ? { ...a, stage } : a
            ),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  getApplicationsByStage: (stage) => get().user?.applications.filter((a) => a.stage === stage) || [],

  getApplications: () => get().user?.applications || [],

  getApplicationById: (appId) => get().user?.applications.find((a) => a.id === appId),

  // Readiness Score
  updateReadinessScore: (score) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            readinessScore: score,
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  calculateReadinessScore: () => {
    const user = get().user;
    if (!user) return 0;

    const breakdown = user.readinessScore;
    return (
      breakdown.jobMatchQuality * 0.3 +
      breakdown.jdSkillAlignment * 0.25 +
      breakdown.resumeAtsScore * 0.25 +
      breakdown.applicationProgress * 0.1 +
      breakdown.practiceCompletion * 0.1
    );
  },

  getReadinessBreakdown: () => get().user?.readinessScore || initialReadinessScore,

  // Notifications
  addNotification: (notification) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            notifications: [...state.user.notifications, notification],
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  markNotificationAsRead: (notificationId) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            notifications: state.user.notifications.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n
            ),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  getUnreadNotifications: () => get().user?.notifications.filter((n) => !n.read) || [],

  getNotifications: () => get().user?.notifications || [],

  // Utility
  updateLastActivity: () =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            lastActivity: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  clearStore: () => set({ user: null }),
}));
