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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              難易度レベル: {selectedLevel}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>初級</span>
              <span>中級</span>
              <span>上級</span>
            </div>
          </div>

          <button
            onClick={onGenerateProblem}
            disabled={isGenerating}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isGenerating ? '問題を生成中...' : '問題を生成する'}
          </button>

          <button
            onClick={onShowHistory}
            disabled={isGenerating}
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
