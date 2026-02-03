import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Send, Info, AlertCircle } from 'lucide-react'
import CodeViewer from './CodeViewer'
import SectionHeader from './SectionHeader'
import { useKeyboard } from '../hooks/useKeyboard'

import { Problem, Language } from '../types'

interface ProblemScreenProps {
  problem: Problem
  selectedLanguage: Language
  userAnswer: string
  setUserAnswer: (answer: string) => void
  onEvaluate: () => void
  onBack: () => void
  isEvaluating: boolean
}

export default function ProblemScreen({
  problem,
  selectedLanguage,
  userAnswer,
  setUserAnswer,
  onEvaluate,
  onBack,
  isEvaluating
}: ProblemScreenProps) {
  const displayLanguage = problem.language || selectedLanguage
  const textareaRef = useRef(null)

  // Ctrl+Enter で送信
  useKeyboard(['Ctrl', 'Enter'], () => {
    if (!isEvaluating && userAnswer.trim()) {
      onEvaluate()
    }
  }, { enabled: true, preventDefault: true })

  return (
    <div className="min-h-screen p-6 sm:p-10 flex flex-col max-w-[1600px] mx-auto space-y-8 pb-10" role="main">
      {/* Top Navigation & Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-4">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-bold text-xs uppercase tracking-widest pl-1"
            aria-label="戻る"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            Back
          </button>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
            Review Session
          </h1>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-black uppercase tracking-wider ring-1 ring-blue-500/20 shadow-sm">
              {displayLanguage}
            </span>
            <span className="px-4 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-black uppercase tracking-wider ring-1 ring-purple-500/20 shadow-sm">
              Level {problem.level}/10
            </span>
            <span className="px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-black uppercase tracking-wider ring-1 ring-amber-500/20 shadow-sm">
              必須項目 {problem.requiredIssuesCount}個
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0">
        {/* Left Column: Code and Context */}
        <div className="lg:col-span-7 flex flex-col gap-6 min-h-0">
          {problem.prerequisite && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-6 py-5 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-700/30 backdrop-blur-sm"
            >
              <SectionHeader icon={Info} variant="accent" className="text-amber-700 dark:text-amber-400 mb-2 text-xs">
                前提条件・コンテキスト
              </SectionHeader>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                {problem.prerequisite}
              </p>
            </motion.div>
          )}

          <div className="flex-1 flex flex-col gap-4 min-h-0">
            <h2 className="flex items-center gap-3 text-slate-900 dark:text-white text-xl font-black tracking-tight">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
              ソースコード
            </h2>
            <div className="flex-1 premium-card overflow-hidden ring-1 ring-black/5 dark:ring-white/5 bg-slate-50 dark:bg-slate-950/50 flex flex-col relative">
              {isEvaluating && <div className="scan-animation" />}
              <div className="flex-1 overflow-auto">
                <CodeViewer code={problem.code} language={displayLanguage} className="h-full !rounded-none !bg-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Feedback Form */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-slate-900 dark:text-white text-xl font-black tracking-tight">
              <div className="w-1.5 h-6 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
              あなたのレビュー
            </h2>
            <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
              <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold border border-slate-200 dark:border-slate-700 shadow-sm">Ctrl</kbd>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black">+</span>
              <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold border border-slate-200 dark:border-slate-700 shadow-sm">Enter</kbd>
            </div>
          </div>

          <div className="flex-1 flex flex-col premium-card p-1 relative group focus-within:ring-2 ring-blue-500/20 transition-all duration-300">
            <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[inherit] -z-10" />
            <div className="flex-1 flex flex-col p-6 space-y-4">
              <p id="review-hint" className="text-xs text-slate-500 dark:text-slate-400 font-bold bg-slate-100/50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <AlertCircle className="w-3 h-3 inline-block mr-1.5 -mt-0.5 text-blue-500" aria-hidden="true" />
                上記のコードで見つけたバグ、設計上の欠陥、セキュリティ問題を説明してください。
              </p>
              <textarea
                ref={textareaRef}
                id="review-input"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="flex-1 w-full bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 resize-none font-medium leading-relaxed text-base"
                placeholder={`例:\n1. 変数名をより説明的なものに変更すべきです。\n2. ネットワークエラー時の適切なエラーハンドリングがありません...`}
                spellCheck={false}
                aria-label="コードレビュー内容を入力"
                aria-describedby="review-hint"
                aria-required="true"
              />
            </div>
          </div>

          <button
            onClick={onEvaluate}
            disabled={isEvaluating || !userAnswer.trim()}
            className="primary-button-glow py-5 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none transition-all w-full"
            aria-label={isEvaluating ? "レビューを分析中..." : "評価を送信"}
            aria-disabled={isEvaluating || !userAnswer.trim()}
          >
            {isEvaluating ? (
              <>
                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" role="status" aria-label="分析中"></div>
                <span aria-live="polite">Analying Review...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" aria-hidden="true" />
                <span>Submit Evaluation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
