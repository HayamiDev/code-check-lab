import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { ArrowRight, Settings, Info, MessageSquare, Award } from 'lucide-react'
import { getIssueScoreColorClass, getIssueScoreIcon, getScoreIcon } from '../constants/scoreColors'
import CodeViewer from './CodeViewer'
import SectionHeader from './SectionHeader'


interface RequiredIssue {
  summary: string;
  detail: string;
}

interface OptionalIssue {
  summary: string;
  detail: string;
}

interface Problem {
  code: string;
  language: string;
  level: number;
  requiredIssuesCount: number;
  requiredIssues: RequiredIssue[];
  optionalIssues?: OptionalIssue[];
  prerequisite?: string;
}

interface Score {
  issueIndex: number;
  score: number;
  feedback: string;
}

interface EvaluationResult {
  totalScore: number;
  overallFeedback: string;
  scores: Score[];
}

interface ResultScreenProps {
  problem: Problem;
  evaluationResult: EvaluationResult;
  onNextProblem: (() => void) | null;
  onChangeSettings: () => void;
  isGenerating: boolean;
  isHistoryView?: boolean;
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

  useEffect(() => {
    if (evaluationResult.totalScore >= 70) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981']
      })
    }
  }, [evaluationResult.totalScore])

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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="premium-card p-8 flex flex-col items-center justify-center text-center space-y-4 lg:col-span-1 border-b-4 border-b-blue-500 dark:border-b-blue-400"
        >
          <div className="relative">
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className={`text-8xl mb-2 ${evaluationResult.totalScore >= 70
                ? 'text-green-600 dark:text-green-400'
                : evaluationResult.totalScore >= 50
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400'
                }`}
            >
              {getScoreIcon(evaluationResult.totalScore)}
            </motion.div>
          </div>
          <div className="space-y-1">
            <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
              {evaluationResult.totalScore}
            </span>
            <span className="text-xl font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">pts</span>
          </div>
          <p className="text-xs font-black text-blue-500 dark:text-blue-400 uppercase tracking-[0.2em] pt-2">
            正確性スコア
          </p>
        </motion.div>

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
              })}
            </div>
          </section>

          {problem.optionalIssues && problem.optionalIssues.length > 0 && (
            <section className="space-y-4 opacity-100 hover:opacity-100 transition-opacity duration-500">
              <h2 className="flex items-center gap-3 text-slate-500 dark:text-slate-300 text-sm font-black uppercase tracking-widest">
                < Award className="w-4 h-4" />
                追加の考察
              </h2>
              <div className="space-y-2">
                {problem.optionalIssues.map((issue, index) => (
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
          )}
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
