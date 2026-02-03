import { Award } from 'lucide-react'

interface OptionalIssue {
  summary: string
  detail: string
}

interface OptionalIssuesSectionProps {
  optionalIssues: OptionalIssue[]
}

export default function OptionalIssuesSection({ optionalIssues }: OptionalIssuesSectionProps) {
  if (!optionalIssues || optionalIssues.length === 0) {
    return null
  }

  return (
    <section className="space-y-4 opacity-100 hover:opacity-100 transition-opacity duration-500">
      <h2 className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest pl-1">
        <Award className="w-4 h-4" />
        追加の考察
      </h2>
      <div className="space-y-3">
        {optionalIssues.map((issue, index) => (
          <details key={index} className="group rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden backdrop-blur-md transition-all duration-300 bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-900/60 hover:shadow-md">
            <summary className="px-5 py-4 cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300 list-none flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <span>{issue.summary}</span>
              <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/50 text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-900/20">
              {issue.detail}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
