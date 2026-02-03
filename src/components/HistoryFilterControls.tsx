import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import { LANGUAGES } from '../constants/languages'
import SectionHeader from './SectionHeader'

interface HistoryFilterControlsProps {
  selectedLanguage: string
  setSelectedLanguage: (lang: string) => void
  scoreFilter: string
  setScoreFilter: (filter: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  filteredCount: number
}

export default function HistoryFilterControls({
  selectedLanguage,
  setSelectedLanguage,
  scoreFilter,
  setScoreFilter,
  sortBy,
  setSortBy,
  filteredCount
}: HistoryFilterControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="premium-card p-6"
      role="search"
      aria-label="フィルターと並び替えコントロール"
    >
      <SectionHeader icon={Filter} className="mb-4">
        フィルター・並び替え
      </SectionHeader>
      <div className="mb-0">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
          <select
            id="language-filter"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            aria-label="言語でフィルター"
            className="glass-input-premium text-sm"
          >
            <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">すべての言語</option>
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{lang}</option>
            ))}
          </select>

          <select
            id="score-filter"
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            aria-label="スコアでフィルター"
            className="glass-input-premium text-sm"
          >
            <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">すべてのスコア</option>
            <option value="high" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">70点以上</option>
            <option value="mid" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">50〜69点</option>
            <option value="low" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">50点未満</option>
          </select>

          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="並び替え"
            className="glass-input-premium text-sm"
          >
            <option value="date-desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">日時（新しい順）</option>
            <option value="date-asc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">日時（古い順）</option>
            <option value="score-desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">スコア（高い順）</option>
            <option value="score-asc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">スコア（低い順）</option>
            <option value="level-desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">難易度（高い順）</option>
            <option value="level-asc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">難易度（低い順）</option>
          </select>

          <div className="sm:ml-auto text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left" role="status" aria-live="polite" aria-label={`${filteredCount}件の結果を表示中`}>
            {filteredCount}件表示
          </div>
        </div>
      </div>
    </motion.div>
  )
}
