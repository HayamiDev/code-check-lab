import { useEffect } from 'react'
import { LANGUAGES } from '../constants/languages'

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
    if (level <= 3) return 'text-green-600 dark:text-green-400'
    if (level <= 7) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  // キーボードショートカット: Enter で問題生成
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !isGenerating) {
        e.preventDefault()
        onGenerateProblem()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isGenerating, onGenerateProblem])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          コードレビュートレーナー
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          AIが生成する問題でコードレビュー力を鍛えましょう
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              プログラミング言語
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              aria-label="プログラミング言語を選択"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                難易度レベル
              </label>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${getLevelColor(selectedLevel)}`}>
                  {selectedLevel}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(selectedLevel)} bg-opacity-10`}>
                  {getLevelLabel(selectedLevel)}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(Number(e.target.value))}
              aria-label="難易度レベル"
              aria-valuemin="1"
              aria-valuemax="10"
              aria-valuenow={selectedLevel}
              aria-valuetext={`レベル ${selectedLevel} ${getLevelLabel(selectedLevel)}`}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span className="text-green-600 dark:text-green-400">1 初級</span>
              <span className="text-yellow-600 dark:text-yellow-400">5 中級</span>
              <span className="text-red-600 dark:text-red-400">10 上級</span>
            </div>
          </div>

          <button
            onClick={onGenerateProblem}
            disabled={isGenerating}
            aria-label="問題を生成する"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isGenerating ? '問題を生成中...' : '問題を生成する'}
          </button>

          <button
            onClick={onShowHistory}
            disabled={isGenerating}
            aria-label="過去の問題を見る"
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            過去の問題
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <button
            onClick={onShowMock}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            テストモード
          </button>
        </div>
      </div>
    </div>
  )
}
