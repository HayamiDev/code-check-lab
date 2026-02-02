import { motion } from 'framer-motion'
import { ChevronLeft, Beaker } from 'lucide-react'
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
    <div className="min-h-screen p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Beaker className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Developer Playground
            </h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
            API呼び出しなしでUIコンポーネントをテスト
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card p-6"
          >
            <h2 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">問題画面</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              コードレビュー問題の表示・回答入力画面
            </p>
            <button
              onClick={() => onTestProblem(MOCK_PROBLEM)}
              className="primary-button w-full"
            >
              問題画面を表示
            </button>
          </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card p-6">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-2">採点結果画面</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                採点結果・フィードバックの表示画面
              </p>
              <button
                onClick={() => onTestResult(MOCK_PROBLEM, MOCK_EVALUATION)}
                className="primary-button w-full"
              >
                採点結果画面を表示
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card p-6">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-2">過去の問題画面</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                履歴一覧の表示画面（モックデータ）
              </p>
              <button
                onClick={() => onTestHistory({ history: MOCK_HISTORY, counts: MOCK_COUNTS })}
                className="primary-button w-full"
              >
                過去の問題画面を表示
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card p-6">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-2">ローディング</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                ローディングオーバーレイの表示確認
              </p>
              <button
                onClick={async () => {
                  onTestProblem(MOCK_PROBLEM, true)
                }}
                className="primary-button w-full"
              >
                ローディング表示（2秒）
              </button>
        </motion.div>
      </div>
    </div>
  )
}
