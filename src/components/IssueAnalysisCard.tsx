import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { getIssueScoreColorClass, getIssueScoreIcon } from '../constants/scoreColors'
import SectionHeader from './SectionHeader'

interface RequiredIssue {
  summary: string
  detail: string
}

interface Score {
  issueIndex: number
  score: number
  feedback: string
}

interface IssueAnalysisCardProps {
  issue: RequiredIssue
  index: number
  scoreData?: Score
}

export default function IssueAnalysisCard({ issue, index, scoreData }: IssueAnalysisCardProps) {
  return (
    <motion.details
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      key={index}
      className="group rounded-2xl border-none overflow-hidden backdrop-blur-xl border border-white/20 dark:border-slate-700 shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800 hover:shadow-xl hover:bg-white/90 dark:hover:bg-slate-750"
      aria-labelledby={`issue-${index}-title`}
    >
      <summary className="px-6 py-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/50 flex items-center justify-between list-none transition-colors" aria-label={`問題 ${index + 1}: ${issue.summary}`}>
        <div className="flex items-center gap-5">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex items-center justify-center text-xs font-black font-mono group-open:bg-blue-600 group-open:text-white transition-all shadow-sm ring-1 ring-slate-200 dark:ring-slate-700" aria-hidden="true">
            {index + 1}
          </span>
          <span id={`issue-${index}-title`} className="text-base font-bold text-slate-800 dark:text-slate-100 group-open:text-blue-600 dark:group-open:text-blue-400 transition-colors">
            {issue.summary}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {scoreData && (
            <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black ${getIssueScoreColorClass(scoreData.score)} ring-1 ring-current/20 flex items-center gap-1.5 shadow-sm`}>
              {getIssueScoreIcon(scoreData.score)}
              {scoreData.score}/10
            </div>
          )}
          <svg className="w-5 h-5 text-slate-400 dark:text-slate-500 group-open:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </summary>
      <div className="px-6 py-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30 space-y-6">
        <div>
          <SectionHeader icon={Info} variant="primary" className="text-[10px] tracking-[0.2em] mb-3 opacity-70">
            技術的詳細
          </SectionHeader>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            {issue.detail}
          </p>
        </div>
        {scoreData && (
          <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
            <h4 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              レビュアーからのフィードバック
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
              "{scoreData.feedback}"
            </p>
          </div>
        )}
      </div>
    </motion.details>
  )
}
