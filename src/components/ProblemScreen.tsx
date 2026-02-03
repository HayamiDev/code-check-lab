import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Send, Info, Code as CodeIcon, AlertCircle } from 'lucide-react'
import CodeViewer from './CodeViewer'
import SectionHeader from './SectionHeader'
import { useKeyboard } from '../hooks/useKeyboard'

export default function ProblemScreen({
  problem,
  selectedLanguage,
  userAnswer,
  setUserAnswer,
  onEvaluate,
  onBack,
  isEvaluating
}) {
  const displayLanguage = problem.language || selectedLanguage
  const textareaRef = useRef(null)

  // Ctrl+Enter で送信
  useKeyboard(['Ctrl', 'Enter'], () => {
    if (!isEvaluating && userAnswer.trim()) {
      onEvaluate()
    }
  }, { enabled: true, preventDefault: true })

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col max-w-7xl mx-auto space-y-8">
      {/* Top Navigation & Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            セットアップに戻る
          </button>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Review Session
          </h1>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-wider ring-1 ring-blue-500/20">
              {displayLanguage}
            </span>
            <span className="px-4 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-black uppercase tracking-wider ring-1 ring-purple-500/20">
              Level {problem.level}/10
            </span>
            <span className="px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-black uppercase tracking-wider ring-1 ring-amber-500/20">
              必須項目 {problem.requiredIssuesCount}個
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Left Column: Code and Context */}
        <div className="lg:col-span-7 space-y-8">
          {problem.prerequisite && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="premium-card p-6 bg-amber-50/80 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700/50"
            >
              <SectionHeader icon={Info} variant="accent" className="text-amber-700 dark:text-amber-400 mb-3">
                前提条件・コンテキスト
              </SectionHeader>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {problem.prerequisite}
              </p>
            </motion.div>
          )}

          <div className="space-y-4">
            <SectionHeader icon={CodeIcon} className="ml-2">
              ソースコード
            </SectionHeader>
            <div className="premium-card overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
              {isEvaluating && <div className="scan-animation" />}
              <CodeViewer code={problem.code} language={displayLanguage} />
            </div>
          </div>
        </div>

        {/* Right Column: Feedback Form */}
        <div className="lg:col-span-5 h-full flex flex-col space-y-4 min-h-[500px]">
          <div className="flex items-center justify-between ml-2">
            <SectionHeader icon={AlertCircle}>
              あなたのレビュー
            </SectionHeader>
            <div className="flex items-center gap-2 opacity-75 hover:opacity-100 transition-opacity">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-[11px] font-semibold border border-slate-300 dark:border-slate-700">Ctrl</kbd>
              <span className="text-slate-900 dark:text-slate-100 text-[11px]">+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-[11px] font-semibold border border-slate-300 dark:border-slate-700">Enter</kbd>
            </div>
          </div>

          <div className="flex-1 flex flex-col premium-card p-6">
            <p className="text-xs text-slate-500 dark:text-slate-500 mb-4 font-bold">
              上記のコードで見つけたバグ、設計上の欠陥、セキュリティ問題を説明してください。
            </p>
            <textarea
              ref={textareaRef}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="flex-1 w-full bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 resize-none font-medium leading-relaxed"
              placeholder={`例:\n1. 変数名をより説明的なものに変更すべきです。\n2. ネットワークエラー時の適切なエラーハンドリングがありません...`}
            />
          </div>

          <button
            onClick={onEvaluate}
            disabled={isEvaluating || !userAnswer.trim()}
            className="neon-button py-5 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            {isEvaluating ? (
              <>
                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>レビューを分析中...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>評価を受ける</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
