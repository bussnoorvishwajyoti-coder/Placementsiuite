import { Job } from "@/types";
import { Briefcase, MapPin, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

interface JobMatchCardProps {
  job: Job;
}

export default function JobMatchCard({ job }: JobMatchCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50";
    if (score >= 60) return "bg-blue-50";
    if (score >= 40) return "bg-yellow-50";
    return "bg-red-50";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-dark group-hover:text-primary transition line-clamp-1">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.company}</p>
        </div>
        <div className={`${getScoreBg(job.matchScore)} ${getScoreColor(job.matchScore)} rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0`}>
          {job.matchScore}%
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span className="text-overflow-ellipsis">{job.location}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>
              {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}
            </span>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-700 line-clamp-2 mb-4">{job.description}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {job.requirements.slice(0, 3).map((req, idx) => (
          <span key={idx} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
            {req}
          </span>
        ))}
        {job.requirements.length > 3 && <span className="inline-block text-gray-600 text-xs">+{job.requirements.length - 3} more</span>}
      </div>

      <div className="flex gap-2">
        <Link
          href={`/analyze?jobId=${job.id}`}
          className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm text-center"
        >
          Analyze
        </Link>
        <a
          href={job.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-3 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 transition font-semibold text-sm text-center"
        >
          View Job
        </a>
      </div>
    </div>
  );
}
