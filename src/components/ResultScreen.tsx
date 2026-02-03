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
    <div className="min-h-screen p-4 sm:p-8 max-w-6xl mx-auto space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Evaluation Report
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
            {isHistoryView ? '過去のセッションを表示中' : 'レビューセッション完了'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
            {displayLanguage}
          </span>
          <span className="px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
            Lv.{problem.level}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score Card */}
        <ScoreCard totalScore={evaluationResult.totalScore} />

        {/* Overall Feedback */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-8 lg:col-span-2 relative overflow-hidden"
        >
          <Award className="absolute -right-8 -bottom-8 w-48 h-48 text-blue-500/5 dark:text-blue-400/5 rotate-12" />
          <div className="relative z-10 flex flex-col h-full">
            <SectionHeader icon={MessageSquare} variant="primary" className="mb-6">
              AI総合評価
            </SectionHeader>
            <p className="text-slate-700 dark:text-slate-300 text-lg font-medium leading-relaxed italic">
              "{evaluationResult.overallFeedback}"
            </p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Code Comparison/Viewer */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="flex items-center gap-3 text-slate-900 dark:text-white text-xl font-black tracking-tight">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
            レビュー対象コード
          </h2>
          <div className="premium-card overflow-hidden ring-1 ring-black/10 dark:ring-white/10 bg-slate-900 dark:bg-slate-950">
            <CodeViewer code={problem.code} language={displayLanguage} />
          </div>
        </div>

        {/* Issue Analysis */}
        <div className="lg:col-span-5 space-y-8">
          <section className="space-y-6">
            <h2 className="flex items-center gap-3 text-slate-900 dark:text-white text-xl font-black tracking-tight">
              <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
              主要な問題点の分析
            </h2>
            <div className="space-y-4">
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

      <footer className="pt-10 flex flex-col sm:flex-row gap-4 border-t border-slate-200 dark:border-slate-800">
        {!isHistoryView && onNextProblem && (
          <button
            onClick={onNextProblem}
            disabled={isGenerating}
            className="neon-button flex-1 py-5 gap-3"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>次のセッション</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        )}
        <button
          onClick={onChangeSettings}
          className="flex-1 px-8 py-5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3"
        >
          <Settings className="w-5 h-5" />
          <span>設定を変更</span>
        </button>
      </footer>
    </div>
  )
}
