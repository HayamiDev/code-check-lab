import { useState, useMemo } from 'react'
import { LANGUAGES } from '../constants/languages'
import { getHistory, deleteFromHistory, getTotalCounts } from '../lib/historyStorage'

export default function HistoryScreen({ onBack, onSelectProblem, mockData = null }) {
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [history, setHistory] = useState(() => mockData ? {} : getHistory())

  // モックデータがある場合はそれを使用
  const isMock = mockData !== null
  const mockHistory = mockData?.history || null
  const counts = mockData?.counts || getTotalCounts()

  const filteredHistory = useMemo(() => {
    // モックデータがある場合
    if (mockHistory) {
      if (selectedLanguage === 'all') {
        return [...mockHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      }
      return mockHistory.filter(entry => entry.language === selectedLanguage)
    }

    // 通常の履歴
    if (selectedLanguage === 'all') {
      const all = []
      Object.entries(history).forEach(([lang, entries]) => {
        entries.forEach(entry => {
          all.push({ ...entry, language: lang })
        })
      })
      return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }
    return (history[selectedLanguage] || []).map(entry => ({
      ...entry,
      language: selectedLanguage
    }))
  }, [history, selectedLanguage, mockHistory])

  const handleDelete = (language, id) => {
    if (confirm('この問題を削除しますか？')) {
      deleteFromHistory(language, id)
      setHistory(getHistory())
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">過去の問題</h1>
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
            >
              ← 戻る
            </button>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">すべての言語</option>
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              通算: {selectedLanguage === 'all'
                ? Object.values(counts).reduce((a, b) => a + b, 0)
                : (counts[selectedLanguage] || 0)
              }問
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              保存された問題はありません
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((entry) => (
                <div
                  key={`${entry.language}-${entry.id}`}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
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
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          entry.evaluationResult.totalScore >= 70
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                            : entry.evaluationResult.totalScore >= 50
                            ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
                            : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                        }`}>
                          {entry.evaluationResult.totalScore}点
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                      <pre className="text-sm text-gray-600 dark:text-gray-400 truncate font-mono bg-gray-100 dark:bg-gray-900 p-2 rounded">
                        {entry.problem.code.split('\n')[0]}...
                      </pre>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSelectProblem(entry)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        詳細
                      </button>
                      {!isMock && (
                        <button
                          onClick={() => handleDelete(entry.language, entry.id)}
                          className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
                        >
                          削除
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
