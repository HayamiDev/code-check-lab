import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Trophy, History, Beaker, Play, ChevronDown, Check, Info, X, ExternalLink, AlertTriangle, Zap, Shield, Brain, Layers, Award } from 'lucide-react'
import { LANGUAGES, LANGUAGE_DESCRIPTIONS } from '../constants/languages'
import { useKeyboard } from '../hooks/useKeyboard'

const LANGUAGE_ICONS: Record<string, string> = {
  Kotlin: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg',
  Swift: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg',
  JavaScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
  TypeScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
  Python: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  Java: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
  'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg',
  Go: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg',
  Rust: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg',
  PHP: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg',
  Ruby: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg',
  'C++': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
}

interface SetupScreenProps {
  selectedLanguage: string
  setSelectedLanguage: (lang: string) => void
  selectedLevel: number
  setSelectedLevel: (level: number) => void
  onGenerateProblem: () => void
  onShowHistory: () => void
  onShowMock: () => void
  onShowAchievements: () => void
  isGenerating: boolean
}

export default function SetupScreen({
  selectedLanguage,
  setSelectedLanguage,
  selectedLevel,
  setSelectedLevel,
  onGenerateProblem,
  onShowHistory,
  onShowMock,
  onShowAchievements,
  isGenerating
}: SetupScreenProps) {
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  const getLevelLabel = (level: number) => {
    if (level <= 3) return '初級'
    if (level <= 6) return '中級'
    return '上級'
  }

  const getLevelColor = (level: number) => {
    if (level <= 3) return 'from-green-500 to-emerald-600'
    if (level <= 6) return 'from-yellow-400 to-orange-500'
    return 'from-red-500 to-rose-600'
  }

  // Enter で問題生成
  useKeyboard('Enter', () => {
    if (!isGenerating) {
      onGenerateProblem()
    }
  }, { enabled: true, preventDefault: true })

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12 overflow-hidden relative" role="main">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse" aria-hidden="true"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-75" aria-hidden="true"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-8 sm:p-12 max-w-2xl w-full group overflow-visible"
        role="region"
        aria-label="セットアップフォーム"
      >
        <div className="relative mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20"
            aria-hidden="true"
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

        <form className="space-y-12" onSubmit={(e) => { e.preventDefault(); onGenerateProblem(); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-5">
              <label id="language-label" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
                <Code2 className="w-4 h-4" aria-hidden="true" /> Language
              </label>
              <div className="relative z-20">
                <button
                  type="button"
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  onBlur={() => setTimeout(() => setIsLangOpen(false), 200)}
                  className="w-full glass-input-premium text-left flex items-center justify-between group hover:border-blue-500/30 transition-colors"
                  aria-haspopup="listbox"
                  aria-expanded={isLangOpen}
                  aria-labelledby="language-label"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-white rounded-lg border border-slate-100 shadow-sm shrink-0">
                      <img
                        src={LANGUAGE_ICONS[selectedLanguage]}
                        alt=""
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedLanguage}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-[#1a1b1e] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl max-h-60 overflow-y-auto z-50 focus:outline-none"
                      role="listbox"
                      aria-labelledby="language-label"
                    >
                      {LANGUAGES.map((lang) => (
                        <li
                          key={lang}
                          role="option"
                          aria-selected={selectedLanguage === lang}
                          onClick={() => {
                            setSelectedLanguage(lang)
                            setIsLangOpen(false)
                          }}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${selectedLanguage === lang
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                          <div className="p-1 bg-white rounded-md border border-slate-100 shadow-sm shrink-0">
                            <img
                              src={LANGUAGE_ICONS[lang]}
                              alt=""
                              className="w-4 h-4 object-contain"
                            />
                          </div>
                          <span className="font-bold">{lang}</span>
                          {selectedLanguage === lang && (
                            <motion.div layoutId="check" className="ml-auto">
                              <Check className="w-4 h-4" />
                            </motion.div>
                          )}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Language Description Modal */}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsInfoOpen(true)}
                  className="text-xs text-slate-400 hover:text-blue-500 flex items-center gap-1.5 transition-colors font-medium ml-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Supported Languages Info</span>
                </button>

                {createPortal(
                  <AnimatePresence>
                    {isInfoOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setIsInfoOpen(false)}
                          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                          aria-hidden="true"
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 20 }}
                          className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col"
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl z-10">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                              <Code2 className="w-5 h-5 text-blue-500" />
                              Supported Languages
                            </h3>
                            <button
                              onClick={() => setIsInfoOpen(false)}
                              className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              aria-label="閉じる"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Content */}
                          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <div className="space-y-4">
                              {LANGUAGES.map(lang => (
                                <div key={lang} className={`p-4 rounded-xl border transition-all duration-300 ${selectedLanguage === lang
                                  ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/20'
                                  : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md'
                                  }`}>
                                  {/* Header */}
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                      <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-sm shrink-0">
                                        <img
                                          src={LANGUAGE_ICONS[lang]}
                                          alt=""
                                          className="w-6 h-6 object-contain"
                                        />
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-none mb-1">{lang}</h4>
                                        <span className="text-[10px] text-slate-400 font-medium">Programming Language</span>
                                      </div>
                                    </div>
                                    {selectedLanguage === lang && (
                                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                                        Selected
                                      </span>
                                    )}
                                  </div>

                                  {/* Stats Grid */}
                                  <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col gap-1.5">
                                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        <Zap className="w-3 h-3" /> Perf
                                      </div>
                                      <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                          <div key={i} className={`h-1.5 w-full rounded-full ${i <= LANGUAGE_DESCRIPTIONS[lang]?.stats.performance ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                        ))}
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        <Shield className="w-3 h-3" /> Safe
                                      </div>
                                      <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                          <div key={i} className={`h-1.5 w-full rounded-full ${i <= LANGUAGE_DESCRIPTIONS[lang]?.stats.safety ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                        ))}
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        <Brain className="w-3 h-3" /> Diff
                                      </div>
                                      <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                          <div key={i} className={`h-1.5 w-full rounded-full ${i <= LANGUAGE_DESCRIPTIONS[lang]?.stats.difficulty ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Description */}
                                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4">
                                    {LANGUAGE_DESCRIPTIONS[lang]?.description}
                                  </p>

                                  {/* Tags & Frameworks */}
                                  <div className="space-y-3 mb-4">
                                    <div className="flex flex-wrap gap-1.5">
                                      {LANGUAGE_DESCRIPTIONS[lang]?.tags.map(tag => (
                                        <span key={tag} className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <Layers className="w-3 h-3" /> Tech:
                                      </span>
                                      {LANGUAGE_DESCRIPTIONS[lang]?.frameworks.map(fw => (
                                        <span key={fw} className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded">
                                          {fw}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Review Tips */}
                                  <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-lg p-3.5 mb-3">
                                    <h5 className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-2">
                                      <AlertTriangle className="w-3 h-3" />
                                      Code Review Focus
                                    </h5>
                                    <ul className="space-y-1.5">
                                      {LANGUAGE_DESCRIPTIONS[lang]?.reviewTips.map((tip, idx) => (
                                        <li key={idx} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5 leading-snug">
                                          <span className="text-amber-400 mt-0.5">•</span>
                                          {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <a
                                    href={LANGUAGE_DESCRIPTIONS[lang]?.docUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline decoration-blue-500/30 underline-offset-4 transition-all w-fit"
                                  >
                                    <span className="w-1.5 h-1.5 bg-current rounded-full" />
                                    Official Documentation
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>,
                  document.body
                )}
              </div>
            </div>

            <div className="space-y-5">
              <label htmlFor="difficulty-slider" className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
                <div className="flex items-center gap-2"><Trophy className="w-4 h-4" aria-hidden="true" /> Difficulty</div>
                <span className={`text-base font-black bg-clip-text text-transparent bg-gradient-to-r ${getLevelColor(selectedLevel)}`} aria-live="polite">
                  LV.{selectedLevel} - {getLevelLabel(selectedLevel)}
                </span>
              </label>
              <div className="pt-2 px-2">
                <input
                  id="difficulty-slider"
                  type="range"
                  min="0"
                  max="10"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(Number(e.target.value))}
                  className="w-full"
                  aria-label="難易度レベルを選択"
                  aria-valuemin={0}
                  aria-valuemax={10}
                  aria-valuenow={selectedLevel}
                  aria-valuetext={`レベル${selectedLevel} - ${getLevelLabel(selectedLevel)}`}
                />
                <div className="flex justify-between text-[10px] font-black text-slate-500 dark:text-slate-400 mt-4 uppercase tracking-tighter" role="presentation">
                  <span>Entry</span>
                  <span>Pro</span>
                  <span>Legend</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-4">
            <button
              type="submit"
              disabled={isGenerating}
              className="primary-button-glow w-full gap-3 py-5 text-lg"
              aria-label={isGenerating ? "問題を生成中..." : "レビューセッションを開始"}
            >
              {isGenerating ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" role="status" aria-label="読み込み中"></div>
                  <span aria-live="polite">生成中...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                  <span>Start Session</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onShowHistory}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all border border-slate-200 dark:border-slate-800 backdrop-blur-sm"
                aria-label="過去の履歴を表示"
              >
                <History className="w-5 h-5" aria-hidden="true" />
                <span>History</span>
              </button>

              <button
                type="button"
                onClick={onShowAchievements}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-400 font-bold hover:from-amber-200 hover:to-yellow-200 dark:hover:from-amber-900/50 dark:hover:to-yellow-900/50 transition-all border border-amber-300 dark:border-amber-700 backdrop-blur-sm shadow-sm hover:shadow-md"
                aria-label="実績と称号を表示"
              >
                <Award className="w-5 h-5" aria-hidden="true" />
                <span>Achievements</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
            <button
              type="button"
              onClick={onShowMock}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              aria-label="開発者向けプレイグラウンドを開く"
            >
              <Beaker className="w-3 h-3" aria-hidden="true" />
              Developer Playground
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
