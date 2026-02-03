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
      className="group rounded-2xl border-none overflow-hidden backdrop-blur-2xl border border-white/20 dark:border-white/5 shadow-2xl transition-all duration-300 bg-white/90 dark:bg-slate-900/90"
    >
      <summary className="px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 flex items-center justify-between list-none">
        <div className="flex items-center gap-4">
          <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 flex items-center justify-center text-[10px] font-black font-mono group-open:bg-purple-500 group-open:text-white transition-colors">
            {index + 1}
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{issue.summary}</span>
        </div>
        {scoreData && (
          <div className={`px-3 py-1 rounded-lg text-[10px] font-black ${getIssueScoreColorClass(scoreData.score)} ring-1 ring-current/20 flex items-center gap-1.5`}>
            {getIssueScoreIcon(scoreData.score)}
            {scoreData.score}/10
          </div>
        )}
      </summary>
      <div className="px-6 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 space-y-4">
        <div>
          <SectionHeader icon={Info} variant="primary" className="text-[10px] tracking-[0.2em] mb-2">
            技術的詳細
          </SectionHeader>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{issue.detail}</p>
        </div>
        {scoreData && (
          <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border-l-2 border-purple-500 shadow-sm">
            <h4 className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-[0.2em] mb-2 text-right">レビュアーからのフィードバック</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{scoreData.feedback}"</p>
          </div>
        )}
      </div>
    </motion.details>
  )
}
