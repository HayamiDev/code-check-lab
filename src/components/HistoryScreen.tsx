import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, TrendingUp, Filter } from 'lucide-react'
import { LANGUAGES } from '../constants/languages'
import { getHistory, deleteFromHistory, getTotalCounts } from '../lib/historyStorage'
import { getScoreColorClass, getScoreIcon } from '../constants/scoreColors'
import ConfirmDialog from './ConfirmDialog'
import SectionHeader from './SectionHeader'

function ScoreChart({ data }) {
  if (data.length < 2) {
    return (
      <div className="h-40 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
        グラフ表示には2件以上のデータが必要です
      </div>
    )
  }

  // 古い順にソート（グラフは左から右へ時系列）
  const sortedData = [...data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  const scores = sortedData.map(d => d.evaluationResult.totalScore)
  const maxScore = 100
  const minScore = 0

  // 固定20スロット（最大保存件数）で横幅を分割
  const maxSlots = 20
  const width = 400
  const height = 120
  const paddingLeft = 25
  const paddingRight = 10
  const paddingY = 15
  const graphWidth = width - paddingLeft - paddingRight
  const graphHeight = height - paddingY * 2
  const slotWidth = graphWidth / (maxSlots - 1)

  const points = scores.map((score, i) => {
    const x = paddingLeft + i * slotWidth
    const y = paddingY + graphHeight - ((score - minScore) / (maxScore - minScore)) * graphHeight
    return `${x},${y}`
  }).join(' ')

  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 premium-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <SectionHeader icon={TrendingUp} variant="primary">
          スコア推移
        </SectionHeader>
        <span className="text-sm text-slate-500 dark:text-slate-400 font-bold">平均: {avg}点</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40 mb-3" preserveAspectRatio="xMinYMid meet">
        {/* Y軸グリッドライン */}
        {[0, 25, 50, 75, 100].map(val => {
          const y = paddingY + graphHeight - (val / 100) * graphHeight
          const isGuide = val === 50 || val === 70
          return (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="currentColor"
                className={
                  val === 50
                    ? "text-yellow-400 dark:text-yellow-400"
                    : val === 70
                    ? "text-green-400 dark:text-green-400"
                    : "text-slate-200 dark:text-slate-500"
                }
                strokeWidth={isGuide ? "1" : "0.5"}
                strokeDasharray={isGuide ? "4,2" : "none"}
                opacity={isGuide ? 0.7 : 1}
              />
              <text
                x={paddingLeft - 5}
                y={y + 3}
                textAnchor="end"
                fill="currentColor"
                className="text-slate-500 dark:text-slate-300"
                fontSize="11"
                fontWeight="600"
              >
                {val}
              </text>
            </g>
          )
        })}

        {/* 70点ライン */}
        <line
          x1={paddingLeft}
          y1={paddingY + graphHeight - (70 / 100) * graphHeight}
          x2={width - paddingRight}
          y2={paddingY + graphHeight - (70 / 100) * graphHeight}
          stroke="currentColor"
          className="text-green-400 dark:text-green-400"
          strokeWidth="1"
          strokeDasharray="4,2"
          opacity="0.7"
        />

        {/* スコアライン */}
        <polyline
          fill="none"
          stroke="currentColor"
          className="text-blue-500 dark:text-blue-400"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* データポイント */}
        {scores.map((score, i) => {
          const x = paddingLeft + i * slotWidth
          const y = paddingY + graphHeight - ((score - minScore) / (maxScore - minScore)) * graphHeight
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="currentColor"
              className="text-blue-600 dark:text-blue-300"
            />
          )
        })}
      </svg>
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-green-400"></div>
          <span className="text-slate-600 dark:text-slate-300 font-semibold">70点ライン（合格）</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-yellow-400"></div>
          <span className="text-slate-600 dark:text-slate-300 font-semibold">50点ライン</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-300"></div>
          <span className="text-slate-600 dark:text-slate-300 font-semibold">あなたのスコア</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function HistoryScreen({ onBack, onSelectProblem, mockData = null }) {
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [scoreFilter, setScoreFilter] = useState('all')
  const [history, setHistory] = useState(() => mockData ? {} : getHistory())
  const [confirmDelete, setConfirmDelete] = useState(null)

  // モックデータがある場合はそれを使用
  const isMock = mockData !== null
  const mockHistory = mockData?.history || null
  const counts = mockData?.counts || getTotalCounts()

  // 言語でフィルタした基本データ
  const baseHistory = useMemo(() => {
    if (mockHistory) {
      if (selectedLanguage === 'all') {
        return [...mockHistory]
      }
      return mockHistory.filter(entry => entry.language === selectedLanguage)
    }

    if (selectedLanguage === 'all') {
      const all = []
      Object.entries(history).forEach(([lang, entries]) => {
        entries.forEach(entry => {
          all.push({ ...entry, language: lang })
        })
      })
      return all
    }
    return (history[selectedLanguage] || []).map(entry => ({
      ...entry,
      language: selectedLanguage
    }))
  }, [history, selectedLanguage, mockHistory])

  // スコアフィルタ適用
  const scoreFilteredHistory = useMemo(() => {
    if (scoreFilter === 'all') return baseHistory
    if (scoreFilter === 'high') return baseHistory.filter(e => e.evaluationResult.totalScore >= 70)
    if (scoreFilter === 'mid') return baseHistory.filter(e => e.evaluationResult.totalScore >= 50 && e.evaluationResult.totalScore < 70)
    if (scoreFilter === 'low') return baseHistory.filter(e => e.evaluationResult.totalScore < 50)
    return baseHistory
  }, [baseHistory, scoreFilter])

  // ソート適用
  const filteredHistory = useMemo(() => {
    const sorted = [...scoreFilteredHistory]
    switch (sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      case 'score-desc':
        return sorted.sort((a, b) => b.evaluationResult.totalScore - a.evaluationResult.totalScore)
      case 'score-asc':
        return sorted.sort((a, b) => a.evaluationResult.totalScore - b.evaluationResult.totalScore)
      case 'level-desc':
        return sorted.sort((a, b) => b.problem.level - a.problem.level)
      case 'level-asc':
        return sorted.sort((a, b) => a.problem.level - b.problem.level)
      default:
        return sorted
    }
  }, [scoreFilteredHistory, sortBy])

  const handleDeleteClick = (language, id) => {
    setConfirmDelete({ language, id })
  }

  const handleDeleteConfirm = () => {
    if (confirmDelete) {
      deleteFromHistory(confirmDelete.language, confirmDelete.id)
      setHistory(getHistory())
      setConfirmDelete(null)
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            History
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-2">
            過去のレビューセッション
          </p>
        </div>
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
      </header>

      <div className="space-y-8">

        {/* スコア推移グラフ */}
        {baseHistory.length > 0 && <ScoreChart data={baseHistory} />}

        {/* フィルター・ソートコントロール */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="premium-card p-6"
        >
          <SectionHeader icon={Filter} className="mb-4">
            Filter & Sort
          </SectionHeader>
          <div className="mb-0">
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <select
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

              <div className="sm:ml-auto text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left">
                通算: {selectedLanguage === 'all'
                  ? Object.values(counts).reduce((a, b) => a + b, 0)
                  : (counts[selectedLanguage] || 0)
                }問 / 表示: {filteredHistory.length}件
              </div>
            </div>
          </div>
        </motion.div>

        {filteredHistory.length === 0 ? (
          <div className="premium-card p-12 text-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {baseHistory.length === 0 ? '保存された問題はありません' : '条件に一致する問題はありません'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((entry, index) => (
              <motion.div
                key={`${entry.language}-${entry.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="premium-card p-6 hover:scale-[1.01] transition-all duration-300"
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
                        onClick={() => onSelectProblem(entry)}
                        className="primary-button"
                      >
                        詳細
                      </button>
                      {!isMock && (
                        <button
                          onClick={() => handleDeleteClick(entry.language, entry.id)}
                          className="danger-button"
                        >
                          削除
                        </button>
                      )}
                    </div>
                  </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="問題を削除"
        message="この問題を削除してもよろしいですか？この操作は取り消せません。"
      />
    </div>
  )
}
