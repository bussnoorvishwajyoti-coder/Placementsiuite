# Placement Suite - Unified Ecosystem

Transform your placement journey with one connected platform. **Job → JD Analysis → Resume Optimization → Application Tracking → Readiness Growth**

## 🎯 Vision

Students need flow, not tools. Placement Suite unifies three platforms into one intelligent ecosystem:

- **Job Intelligence Engine** - Precision job discovery & matching
- **JD Analyzer Plus** - Break down requirements & extract insights  
- **AI Resume Builder** - Create ATS-optimized resumes
- **Application Tracker** - Monitor your entire pipeline
- **Unified Readiness Score** - Single metric (0-100)

## ✨ Key Features

### 1. **One Unified Pipeline**
```
Job Discovery → JD Analysis → Resume Optimization → Application Tracking → Readiness Growth
```

### 2. **Smart Automation**
- Save a job → System analyzes JD automatically
- JD analysis → Resume alignment checked instantly
- Skills gaps identified → Resume suggestions generated
- Overall score updated → Next actions recommended

### 3. **Unified Data Model**
Single global user state with all modules connected:
- Job matches, saved jobs, analyses
- Resume data & ATS scores
- Applications & pipeline progress
- Readiness metrics & notifications

### 4. **Core Modules**

#### Job Intelligence Engine
- Match score (0-100) based on multiple factors
- Filter & rank jobs intelligently
- Analyze trends across job postings
- Real-time job discovery

#### JD Analyzer Plus
- Extract required & preferred skills
- Identify experience requirements
- Extract responsibilities & keywords
- Determine difficulty level
- Estimate preparation time
- Compare with existing resume

#### AI Resume Builder
- Create from templates (5 professional designs)
- Real-time ATS scoring (0-100)
- Automatic keyword optimization
- Format validation
- Export to PDF

#### Application Pipeline
- 6 stages: Saved → Applied → Interview Scheduled → Interview Completed → Offer → Rejected
- Track multiple interviews per job
- Interview ratings & feedback
- Pipeline health monitoring
- Momentum analysis

#### Readiness Score Formula
```
Overall Score = 
  Job Match Quality (30%) +
  JD Skill Alignment (25%) +
  Resume ATS Score (25%) +
  Application Progress (10%) +
  Practice Completion (10%)
= 0-100 single metric
```

#### Notification Intelligence
- New high-match jobs found
- Resume score below 70
- JD analyzed but no alignment
- Interview in 24 hours
- No activity for 3 days
- Context-aware nudges, not random alerts

## 📊 Core Routes

```
/                   # Unified Dashboard
/jobs              # Job Intelligence
/analyze           # JD Analyzer Plus
/resume            # AI Resume Builder
/applications      # Application Tracker
/settings          # Preferences
/proof             # Platform Showcase
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand (Global Store)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Project Structure
```
src/
├── app/
│   ├── page.tsx           # Dashboard
│   ├── jobs/
│   ├── analyze/
│   ├── resume/
│   ├── applications/
│   ├── settings/
│   ├── proof/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── StatCard.tsx
│   └── JobMatchCard.tsx
├── modules/
│   ├── job-intelligence.ts      # Platform 1
│   ├── jd-analyzer.ts           # Platform 2
│   ├── resume-builder.ts        # Platform 3
│   ├── readiness-calculator.ts  # Unified scoring
│   ├── automation-flow.ts       # Cross-module flow
│   └── notification.ts          # Smart alerts
├── store/
│   └── placement.ts             # Zustand store
└── types/
    └── index.ts                 # TypeScript types
```

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Build
```bash
npm run build
npm run start
```

## 🔌 Integration Flow Example

**When user saves a job:**

1. **Job saved** in store
2. **JD Analysis triggered** automatically
3. **Skills extracted** from requirements
4. **Resume checked** for skill matches
5. **Missing skills identified**
6. **Resume suggestions generated**
7. **ATS score recalculated**
8. **Readiness score updated**
9. **Next action recommended**
10. **Notification created** if needed

## 📈 Readiness Score Breakdown

### Job Match Quality (30%)
- Average match score of saved jobs
- Boost for active applications

### JD Skill Alignment (25%)
- % of required skills in resume
- Across recent analyses

### Resume ATS Score (25%)
- Format compliance
- Keyword density
- Structure quality
- Direct from Resume Builder

### Application Progress (10%)
- Pipeline stage weights
- Saved (10%) → Applied (30%) → Interview (50%) → Completed (70%) → Offer (100%)

### Practice Completion (10%)
- Coding problems solved
- Mock interviews completed

## 🧠 Automation Example

```typescript
// When job is saved:
1. jdAnalyzer.analyzeJobDescription(jobDesc)
   → Returns: requiredSkills, preferredSkills, keywords

2. resumeBuilder.optimizeForATS(resume, keywords)
   → Returns: optimizedResume

3. readinessCalculator.calculateReadinessScore(user)
   → Updates all 5 metrics

4. notificationIntelligence.generateNotifications(user)
   → Creates contextual alerts
```

## 🎯 Key Differences from Three Separate Apps

| Feature | Before (3 Apps) | Now (1 Platform) |
|---------|---|---|
| Data Flow | Isolated | Connected |
| Job Analysis | Manual | Automatic |
| Resume Sync | None | Built-in |
| Score | 3 metrics | 1 unified |
| Notifications | Random | Context-aware |
| User State | Fragmented | Unified |
| Experience | Scattered | Seamless |

## 📱 Demo Pages

- **Dashboard**: Overview of everything at a glance
- **Jobs**: Job intelligence with matching
- **Analyze**: JD breakdown & analysis
- **Resume**: ATS-optimized resume builder
- **Applications**: Full pipeline tracker
- **Proof**: Showcase all features working together

## 🔐 Privacy & Data

- All data stored locally in browser
- No external API calls (demo mode)
- User control over preferences
- Can export at any time

## 📝 Sample Data

Demo includes sample:
- Jobs (50 opportunities)
- Resume templates (5 designs)
- Applications (3 at different stages)
- Practice problems (benchmarking)
- Mock interviews (tracking)

## 🚀 Next Steps

1. Start with dashboard - see your overview
2. Click "Build Resume" to create or upload
3. Find jobs matching your role
4. Analyze job descriptions  
5. Watch resume align automatically
6. Track applications through pipeline
7. Reach placement 100 score!

## 📞 Support

Questions? Check the proof page or explore each module:
- Job Intelligence: `/jobs`
- JD Analysis: `/analyze`
- Resume Builder: `/resume`
- Applications: `/applications`
- All Connected: `/proof`

## 🎓 The Learning

This unified platform demonstrates that **intelligent automation and thoughtful design can transform how students approach placements**. Not three products. One pipeline. One experience.

---

**Live Demo**: [deployment-link]  
**GitHub**: [repository-link]  
**Status**: ✅ All Modules Connected | ✅ Unified Dashboard | ✅ Smart Automation | ✅ Intelligent Notifications
