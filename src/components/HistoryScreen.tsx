import { useState, useMemo } from 'react'
import { ChevronLeft } from 'lucide-react'
import { getHistory, deleteFromHistory, getTotalCounts } from '../lib/historyStorage'
import ConfirmDialog from './ConfirmDialog'
import ScoreChart from './ScoreChart'
import HistoryFilterControls from './HistoryFilterControls'
import HistoryEntryCard from './HistoryEntryCard'

interface HistoryEntry {
  language: string
  id: number
  problem: {
    level: number
    code: string
  }
  evaluationResult: {
    totalScore: number
  }
  timestamp: string
}

interface MockData {
  history: HistoryEntry[]
  counts: Record<string, number>
}

interface HistoryScreenProps {
  onBack: () => void
  onSelectProblem: (entry: HistoryEntry) => void
  mockData?: MockData | null
}

export default function HistoryScreen({ onBack, onSelectProblem, mockData = null }: HistoryScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [scoreFilter, setScoreFilter] = useState('all')
  const [history, setHistory] = useState(() => mockData ? {} : getHistory())
  const [confirmDelete, setConfirmDelete] = useState<{ language: string; id: number } | null>(null)

  // モックデータがある場合はそれを使用
  const isMock = mockData !== null
  const mockHistory = mockData?.history || null

  // 言語でフィルタした基本データ
  const baseHistory = useMemo(() => {
    if (mockHistory) {
      if (selectedLanguage === 'all') {
        return [...mockHistory]
      }
      return mockHistory.filter(entry => entry.language === selectedLanguage)
    }

    if (selectedLanguage === 'all') {
      const all: HistoryEntry[] = []
      Object.entries(history).forEach(([lang, entries]: [string, any[]]) => {
        entries.forEach(entry => {
          all.push({ ...entry, language: lang })
        })
      })
      return all
    }
    return ((history as any)[selectedLanguage] || []).map((entry: any) => ({
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
        return sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
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

  const handleDeleteClick = (language: string, id: number) => {
    setConfirmDelete({ language, id })
  }

  const handleDeleteConfirm = () => {
    if (confirmDelete) {
      deleteFromHistory(confirmDelete.language, confirmDelete.id)
      setHistory(getHistory())
      setConfirmDelete(null)
    }
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
          戻る
        </button>
      </header>

      <div className="space-y-8">
        {/* スコア推移グラフ */}
        {baseHistory.length > 0 && <ScoreChart data={baseHistory} />}

        {/* フィルター・ソートコントロール */}
        <HistoryFilterControls
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          scoreFilter={scoreFilter}
          setScoreFilter={setScoreFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filteredCount={filteredHistory.length}
        />

        {/* 履歴一覧 */}
        {filteredHistory.length === 0 ? (
          <div className="premium-card p-16 text-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {baseHistory.length === 0 ? '保存された問題はありません' : '条件に一致する問題はありません'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((entry, index) => (
              <HistoryEntryCard
                key={`${entry.language}-${entry.id}`}
                entry={entry}
                index={index}
                isMock={isMock}
                onSelect={onSelectProblem}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="削除の確認"
        message="この履歴を削除してもよろしいですか？この操作は取り消せません。"
      />
    </div>
  )
}
