import { motion } from 'framer-motion'
import { getScoreColorClass, getScoreIcon } from '../constants/scoreColors'
import { HistoryEntry } from '../types'

interface HistoryEntryCardProps {
  entry: HistoryEntry
  index: number
  isMock: boolean
  onSelect: (entry: HistoryEntry) => void
  onDelete: (language: string, id: number | string) => void
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}/${day} ${hours}:${minutes}`
}

export default function HistoryEntryCard({ entry, index, isMock, onSelect, onDelete }: HistoryEntryCardProps) {
  return (
    <motion.div
      key={`${entry.language}-${entry.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="premium-card p-6 hover:scale-[1.01] transition-all duration-300"
      role="listitem"
      aria-label={`${entry.language} レベル${entry.problem.level} スコア${entry.evaluationResult.totalScore}点 ${formatDate(entry.timestamp)}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded text-xs font-medium">
              {entry.language}
            </span>
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 rounded text-xs font-medium">
              Lv.{entry.problem.level}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-bold ${getScoreColorClass(entry.evaluationResult.totalScore)} flex items-center gap-1`}>
              <span>{getScoreIcon(entry.evaluationResult.totalScore)}</span>
              <span>{entry.evaluationResult.totalScore}点</span>
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {formatDate(entry.timestamp)}
            </span>
          </div>
          <pre className="text-sm text-slate-600 dark:text-slate-400 truncate font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded">
            {entry.problem.code.split('\n')[0]}...
          </pre>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSelect(entry)}
            className="primary-button"
            aria-label={`${entry.language} レベル${entry.problem.level}の詳細を表示`}
          >
            詳細
          </button>
          {!isMock && (
            <button
              onClick={() => onDelete(entry.language, entry.id)}
              className="danger-button"
              aria-label={`${entry.language} レベル${entry.problem.level}を削除`}
            >
              削除
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
