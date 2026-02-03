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
      <h2 className="flex items-center gap-3 text-slate-500 dark:text-slate-300 text-sm font-black uppercase tracking-widest">
        <Award className="w-4 h-4" />
        追加の考察
      </h2>
      <div className="space-y-2">
        {optionalIssues.map((issue, index) => (
          <details key={index} className="group rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden backdrop-blur-2xl transition-all duration-300 bg-white/50 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-900/50">
            <summary className="px-4 py-3 cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300 list-none flex justify-between items-center">
              <span>{issue.summary}</span>
            </summary>
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {issue.detail}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
