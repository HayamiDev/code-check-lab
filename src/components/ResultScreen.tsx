import { motion } from 'framer-motion'
import { ArrowRight, Settings, MessageSquare, Award } from 'lucide-react'
import CodeViewer from './CodeViewer'
import SectionHeader from './SectionHeader'
import ScoreCard from './ScoreCard'
import IssueAnalysisCard from './IssueAnalysisCard'
import OptionalIssuesSection from './OptionalIssuesSection'

interface RequiredIssue {
  summary: string
  detail: string
}

interface OptionalIssue {
  summary: string
  detail: string
}

interface Problem {
  code: string
  language: string
  level: number
  requiredIssuesCount: number
  requiredIssues: RequiredIssue[]
  optionalIssues?: OptionalIssue[]
  prerequisite?: string
}

interface Score {
  issueIndex: number
  score: number
  feedback: string
}

interface EvaluationResult {
  totalScore: number
  overallFeedback: string
  scores: Score[]
}

interface ResultScreenProps {
  problem: Problem
  evaluationResult: EvaluationResult
  onNextProblem: (() => void) | null
  onChangeSettings: () => void
  isGenerating: boolean
  isHistoryView?: boolean
}

export default function ResultScreen({
  problem,
  evaluationResult,
  onNextProblem,
  onChangeSettings,
  isGenerating,
  isHistoryView = false
}: ResultScreenProps) {
  const displayLanguage = problem.language

  return (
    <div className="min-h-screen p-6 sm:p-10 max-w-7xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
            Evaluation Report
          </h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">
            {isHistoryView ? '過去のセッションを表示中' : 'レビューセッション完了'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-white dark:bg-slate-900 rounded-lg text-xs font-black uppercase tracking-widest border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm">
            {displayLanguage}
          </span>
          <span className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest border shadow-sm ${problem.level >= 8 ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300' :
              problem.level >= 4 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' :
                'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
            }`}>
            Lv.{problem.level}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score Card */}
        <div className="lg:col-span-1 h-full">
          <ScoreCard totalScore={evaluationResult.totalScore} />
        </div>

        {/* Overall Feedback */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-8 lg:col-span-2 relative overflow-hidden flex flex-col justify-center min-h-[300px]"
        >
          <Award className="absolute -right-8 -bottom-8 w-64 h-64 text-blue-500/5 dark:text-blue-400/5 rotate-12 z-0" />
          <div className="relative z-10 flex flex-col h-full space-y-4">
            <SectionHeader icon={MessageSquare} variant="primary" className="mb-2">
              AI総合評価
            </SectionHeader>
            <div className="flex-1 flex items-center">
              <p className="text-slate-700 dark:text-slate-300 text-lg md:text-xl font-medium leading-relaxed italic relative">
                <span className="text-4xl text-blue-200 dark:text-blue-800 absolute -top-4 -left-4">"</span>
                {evaluationResult.overallFeedback}
                <span className="text-4xl text-blue-200 dark:text-blue-800 absolute -bottom-8 -right-4">"</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Code Comparison/Viewer */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="flex items-center gap-3 text-slate-900 dark:text-white text-xl font-black tracking-tight">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
            レビュー対象コード
          </h2>
          <div className="premium-card overflow-hidden ring-1 ring-black/5 dark:ring-white/5 bg-slate-50 dark:bg-slate-950/50">
            <CodeViewer code={problem.code} language={displayLanguage} />
          </div>
        </div>

        {/* Issue Analysis */}
        <div className="lg:col-span-5 space-y-10">
          <section className="space-y-6">
            <h2 className="flex items-center gap-3 text-slate-900 dark:text-white text-xl font-black tracking-tight">
              <div className="w-1.5 h-6 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
              主要な問題点の分析
            </h2>
            <div className="space-y-5">
              {problem.requiredIssues.map((issue, index) => {
                const scoreData = evaluationResult.scores.find(s => s.issueIndex === index)
                return (
                  <IssueAnalysisCard
                    key={index}
                    issue={issue}
                    index={index}
                    scoreData={scoreData}
                  />
                )
              })}
            </div>
          </section>

          <OptionalIssuesSection optionalIssues={problem.optionalIssues || []} />
        </div>
      </div>

      <footer className="pt-10 flex flex-col sm:flex-row gap-5 border-t border-slate-200 dark:border-slate-800">
        {!isHistoryView && onNextProblem && (
          <button
            onClick={onNextProblem}
            disabled={isGenerating}
            className="primary-button-glow flex-1 py-5 gap-3 text-lg"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Next Session</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        )}
        <button
          onClick={onChangeSettings}
          className="flex-1 px-8 py-5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3 shadow-sm hover:shadow"
        >
          <Settings className="w-5 h-5" />
          <span>Change Settings</span>
        </button>
      </footer>
    </div>
  )
}
