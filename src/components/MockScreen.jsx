import { MOCK_PROBLEM, MOCK_EVALUATION } from '../constants/mockData'

const MOCK_COUNTS = {
  'Python': 42,
  'TypeScript': 15,
  'Kotlin': 8
}

const MOCK_HISTORY = [
  {
    id: 1,
    language: 'Python',
    problem: {
      level: 3,
      code: 'def get_user(id):\n    return db.query(f"SELECT * FROM users WHERE id = {id}")',
      requiredIssuesCount: 2,
      requiredIssues: [
        { summary: 'SQLインジェクション', detail: 'f-stringでSQLを組み立てている' },
        { summary: 'エラーハンドリング不足', detail: 'DB接続エラーを処理していない' }
      ],
      optionalIssues: []
    },
    userAnswer: 'SQLインジェクションの脆弱性があります',
    evaluationResult: { totalScore: 65, scores: [{ issueIndex: 0, score: 8, feedback: '良い指摘' }, { issueIndex: 1, score: 5, feedback: '不十分' }], overallFeedback: '概ね良好' },
    timestamp: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 2,
    language: 'TypeScript',
    problem: {
      level: 7,
      code: 'const data: any = fetchData();\nconsole.log(data.user.name);',
      requiredIssuesCount: 2,
      requiredIssues: [
        { summary: 'any型の使用', detail: '型安全性が失われている' },
        { summary: 'nullチェック不足', detail: 'undefinedアクセスの可能性' }
      ],
      optionalIssues: []
    },
    userAnswer: 'any型を使わないでください',
    evaluationResult: { totalScore: 45, scores: [{ issueIndex: 0, score: 6, feedback: '指摘できている' }, { issueIndex: 1, score: 3, feedback: '見落とし' }], overallFeedback: '改善の余地あり' },
    timestamp: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 3,
    language: 'Python',
    problem: {
      level: 5,
      code: 'password = input("Enter password: ")\nprint(f"Your password is {password}")',
      requiredIssuesCount: 2,
      requiredIssues: [
        { summary: 'パスワードの平文表示', detail: 'パスワードをログに出力している' },
        { summary: '入力検証なし', detail: 'パスワードの形式チェックがない' }
      ],
      optionalIssues: []
    },
    userAnswer: 'パスワードを表示するのはセキュリティ上問題です',
    evaluationResult: { totalScore: 80, scores: [{ issueIndex: 0, score: 9, feedback: '的確な指摘' }, { issueIndex: 1, score: 7, feedback: '良い' }], overallFeedback: '良い回答です' },
    timestamp: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 4,
    language: 'Kotlin',
    problem: {
      level: 4,
      code: 'fun processData(list: List<String>?) {\n    list!!.forEach { println(it) }\n}',
      requiredIssuesCount: 1,
      requiredIssues: [
        { summary: '強制アンラップ', detail: '!!演算子でNPEの可能性' }
      ],
      optionalIssues: []
    },
    userAnswer: '!!を使わずにsafeCallを使うべき',
    evaluationResult: { totalScore: 90, scores: [{ issueIndex: 0, score: 9, feedback: '完璧' }], overallFeedback: '素晴らしい' },
    timestamp: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: 5,
    language: 'Python',
    problem: {
      level: 6,
      code: 'import pickle\ndata = pickle.loads(user_input)',
      requiredIssuesCount: 1,
      requiredIssues: [
        { summary: 'Pickle脆弱性', detail: '信頼できないデータのデシリアライズ' }
      ],
      optionalIssues: []
    },
    userAnswer: 'pickleは安全ではない',
    evaluationResult: { totalScore: 55, scores: [{ issueIndex: 0, score: 5, feedback: 'もう少し具体的に' }], overallFeedback: '方向性は正しい' },
    timestamp: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: 6,
    language: 'TypeScript',
    problem: {
      level: 5,
      code: 'document.innerHTML = userInput;',
      requiredIssuesCount: 1,
      requiredIssues: [
        { summary: 'XSS脆弱性', detail: 'ユーザー入力を直接DOMに挿入' }
      ],
      optionalIssues: []
    },
    userAnswer: 'XSSの脆弱性があります。サニタイズが必要です。',
    evaluationResult: { totalScore: 85, scores: [{ issueIndex: 0, score: 9, feedback: '正確な指摘' }], overallFeedback: '良い回答' },
    timestamp: new Date(Date.now() - 518400000).toISOString()
  }
]

export default function MockScreen({ onBack, onTestProblem, onTestResult, onTestHistory }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">テストモード</h1>
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
            >
              ← 戻る
            </button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            API呼び出しなしで各画面の表示を確認できます
          </p>

          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2">問題画面</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                コードレビュー問題の表示・回答入力画面
              </p>
              <button
                onClick={() => onTestProblem(MOCK_PROBLEM)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                問題画面を表示
              </button>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2">採点結果画面</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                採点結果・フィードバックの表示画面
              </p>
              <button
                onClick={() => onTestResult(MOCK_PROBLEM, MOCK_EVALUATION)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                採点結果画面を表示
              </button>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2">過去の問題画面</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                履歴一覧の表示画面（モックデータ）
              </p>
              <button
                onClick={() => onTestHistory({ history: MOCK_HISTORY, counts: MOCK_COUNTS })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                過去の問題画面を表示
              </button>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2">ローディング</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                ローディングオーバーレイの表示確認
              </p>
              <button
                onClick={async () => {
                  onTestProblem(MOCK_PROBLEM, true)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                ローディング表示（2秒）
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
