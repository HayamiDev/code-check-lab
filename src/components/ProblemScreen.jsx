import { useEffect, useRef } from 'react'
import hljs from 'highlight.js/lib/core'

// 必要な言語のみインポート
import kotlin from 'highlight.js/lib/languages/kotlin'
import swift from 'highlight.js/lib/languages/swift'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import csharp from 'highlight.js/lib/languages/csharp'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import php from 'highlight.js/lib/languages/php'
import ruby from 'highlight.js/lib/languages/ruby'
import cpp from 'highlight.js/lib/languages/cpp'

// 言語を登録
hljs.registerLanguage('kotlin', kotlin)
hljs.registerLanguage('swift', swift)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('go', go)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('php', php)
hljs.registerLanguage('ruby', ruby)
hljs.registerLanguage('cpp', cpp)

export default function ProblemScreen({
  problem,
  selectedLanguage,
  userAnswer,
  setUserAnswer,
  onEvaluate,
  onBack,
  isEvaluating
}) {
  const codeRef = useRef(null)

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.removeAttribute('data-highlighted')
      hljs.highlightElement(codeRef.current)
    }
  }, [problem?.code])

  const getLanguageClass = (lang) => {
    if (lang.toLowerCase() === 'c#') return 'csharp'
    return lang.toLowerCase()
  }

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
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {selectedLanguage}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  レベル {problem.level}/10
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
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
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code
                ref={codeRef}
                className={`language-${getLanguageClass(selectedLanguage)}`}
              >
                {problem.code}
              </code>
            </pre>
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
