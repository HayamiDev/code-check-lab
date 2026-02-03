import { motion } from 'framer-motion'
import { Code2, Trophy, History, Beaker, Play } from 'lucide-react'
import { LANGUAGES } from '../constants/languages'
import { useKeyboard } from '../hooks/useKeyboard'

export default function SetupScreen({
  selectedLanguage,
  setSelectedLanguage,
  selectedLevel,
  setSelectedLevel,
  onGenerateProblem,
  onShowHistory,
  onShowMock,
  isGenerating
}) {
  const getLevelLabel = (level) => {
    if (level <= 3) return '初級'
    if (level <= 7) return '中級'
    return '上級'
  }

  const getLevelColor = (level) => {
    if (level <= 3) return 'from-green-500 to-emerald-600'
    if (level <= 7) return 'from-yellow-400 to-orange-500'
    return 'from-red-500 to-rose-600'
  }

  // Enter で問題生成
  useKeyboard('Enter', () => {
    if (!isGenerating) {
      onGenerateProblem()
    }
  }, { enabled: true, preventDefault: true })

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-75"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-8 sm:p-12 max-w-2xl w-full group overflow-visible"
      >
        <div className="relative mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20"
          >
            <Code2 className="text-white w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
            Code Review <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Lab</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl">
            AIが生成するコードから欠陥を見つけ出し、<br className="hidden sm:block" />
            プロフェッショナルのレビュースキルを鍛えよう。
          </p>
        </div>

        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-5">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
                <Code2 className="w-4 h-4" /> Language
              </label>
              <div className="relative group">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full glass-input-premium appearance-none cursor-pointer text-lg font-bold hover:border-blue-500/30 transition-colors"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{lang}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-slate-900 dark:text-slate-100 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <label className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
                <div className="flex items-center gap-2"><Trophy className="w-4 h-4" /> Difficulty</div>
                <span className={`text-base font-black bg-clip-text text-transparent bg-gradient-to-r ${getLevelColor(selectedLevel)}`}>
                  LV.{selectedLevel} - {getLevelLabel(selectedLevel)}
                </span>
              </label>
              <div className="pt-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <div className="flex justify-between text-[10px] font-black text-slate-400 dark:text-slate-600 mt-3 uppercase tracking-tighter">
                  <span>Entry</span>
                  <span>Pro</span>
                  <span>Legend</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 pt-4">
            <button
              onClick={onGenerateProblem}
              disabled={isGenerating}
              className="primary-button-glow flex-1 gap-3 py-5 text-lg"
            >
              {isGenerating ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Session</span>
                </>
              )}
            </button>

            <button
              onClick={onShowHistory}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-8 py-5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all border border-slate-200 dark:border-slate-800 backdrop-blur-sm"
            >
              <History className="w-5 h-5" />
              <span>History</span>
            </button>
          </div>

          <div className="flex items-center justify-center pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
            <button
              onClick={onShowMock}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <Beaker className="w-3 h-3" />
              Developer Playground
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
