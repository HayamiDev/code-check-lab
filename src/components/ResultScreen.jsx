export default function ResultScreen({
  problem,
  evaluationResult,
  onNextProblem,
  onChangeSettings,
  isGenerating
}) {
  const getScoreColorClass = (score) => {
    if (score >= 8) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
    }
    if (score >= 5) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
    }
    return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">採点結果</h1>

          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                {evaluationResult.totalScore}点
              </div>
              <div className="text-gray-600 dark:text-gray-300">必須指摘正答率</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">必須指摘</h2>
            <div className="space-y-4">
              {problem.requiredIssues.map((issue, index) => {
                const scoreData = evaluationResult.scores.find(s => s.issueIndex === index)
                return (
                  <details key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg">
                    <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 font-medium flex items-center justify-between text-gray-900 dark:text-white">
                      <span>{index + 1}. {issue.summary}</span>
                      {scoreData && (
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColorClass(scoreData.score)}`}>
                          {scoreData.score}/10点
                        </span>
                      )}
                    </summary>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
                      <div className="mb-3">
                        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">解説</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{issue.detail}</p>
                      </div>
                      {scoreData && (
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">
                            あなたの回答への評価
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{scoreData.feedback}</p>
                        </div>
                      )}
                    </div>
                  </details>
                )
              })}
            </div>
          </div>

          {problem.optionalIssues && problem.optionalIssues.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">任意指摘</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                必須ではありませんが、指摘できるとより良いポイントです
              </p>
              <div className="space-y-4">
                {problem.optionalIssues.map((issue, index) => (
                  <details key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg">
                    <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-gray-900 dark:text-white">
                      {index + 1}. {issue.summary}
                    </summary>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{issue.detail}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">総評</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{evaluationResult.overallFeedback}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onNextProblem}
              disabled={isGenerating}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600"
            >
              {isGenerating ? '生成中...' : '次の問題へ（同じ設定）'}
            </button>
            <button
              onClick={onChangeSettings}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              設定を変更して新しい問題
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
