import { useMemo } from 'react'
import hljs from '../lib/highlight'
import { LANGUAGE_TO_HLJS } from '../constants/languages'

export default function ProblemScreen({
  problem,
  selectedLanguage,
  userAnswer,
  setUserAnswer,
  onEvaluate,
  onBack,
  isEvaluating
}) {
  // モックデータの場合はproblem.languageを使用
  const displayLanguage = problem.language || selectedLanguage
  const hljsLang = LANGUAGE_TO_HLJS[displayLanguage] || displayLanguage.toLowerCase()

  const highlightedLines = useMemo(() => {
    if (!problem?.code) return []
    const highlighted = hljs.highlight(problem.code, { language: hljsLang })
    return highlighted.value.split('\n')
  }, [problem?.code, hljsLang])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                コードレビュー問題
              </h1>
              <div className="flex gap-3 mt-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                  {displayLanguage}
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                  レベル {problem.level}/10
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                  必須指摘: {problem.requiredIssuesCount}個
                </span>
              </div>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
            >
              ← 設定に戻る
            </button>
          </div>

          {problem.prerequisite && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">前提条件</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{problem.prerequisite}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">レビュー対象コード</h3>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm">
              <table className="w-full border-collapse">
                <tbody>
                  {highlightedLines.map((line, index) => (
                    <tr key={index} className="hover:bg-gray-200/50 dark:hover:bg-gray-800/50">
                      <td className="select-none text-right pr-4 pl-4 py-0 text-gray-400 dark:text-gray-600 border-r border-gray-300 dark:border-gray-700 align-top w-1">
                        {index + 1}
                      </td>
                      <td className="pl-4 pr-4 py-0 whitespace-pre font-mono text-gray-900 dark:text-gray-100">
                        <code
                          className={`language-${hljsLang}`}
                          dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              あなたの指摘を記入してください
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              このコードの問題点を指摘してください。必須指摘は{problem.requiredIssuesCount}個です。
            </p>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder={`コードレビューの指摘を自由に記述してください\n\n例:\n1. 変数名が不明瞭です。\`data\`ではなく具体的な名前にすべきです。\n2. エラーハンドリングが不足しています。...`}
            />
          </div>

          <button
            onClick={onEvaluate}
            disabled={isEvaluating || !userAnswer.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isEvaluating ? '評価中...' : '回答を送信して採点する'}
          </button>
        </div>
      </div>
    </div>
  )
}
