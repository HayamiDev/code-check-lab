import { motion } from 'framer-motion'
import { ChevronLeft, Beaker } from 'lucide-react'
import { MOCK_PROBLEM, MOCK_EVALUATION } from '../constants/mockData'

const MOCK_COUNTS = {
  'Python': 42,
  'TypeScript': 15,
  'Kotlin': 8
}

// より充実したモックヒストリーデータを生成
const generateMockHistory = () => {
  const languages = ['Python', 'TypeScript', 'Kotlin', 'JavaScript', 'Go']
  const history = []
  const now = Date.now()

  // 過去90日分のデータを生成（ヒートマップを充実させる）
  for (let i = 0; i < 90; i++) {
    const daysAgo = i
    const timestamp = new Date(now - daysAgo * 86400000).toISOString()

    // ランダムに0-3セッション/日を生成（学習パターンをリアルに）
    const sessionsPerDay = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 3) + 1

    for (let j = 0; j < sessionsPerDay; j++) {
      const language = languages[Math.floor(Math.random() * languages.length)]
      const level = Math.floor(Math.random() * 11) // 0-10
      const score = Math.floor(Math.random() * 60) + 40 // 40-100

      history.push({
        id: `${i}-${j}`,
        language,
        problem: {
          level,
          code: `// Sample ${language} code for level ${level}`,
          requiredIssuesCount: Math.floor(Math.random() * 3) + 1,
          requiredIssues: [
            { summary: 'サンプル問題', detail: 'モックデータの問題です' }
          ],
          optionalIssues: []
        },
        userAnswer: 'モックレビュー回答',
        evaluationResult: {
          totalScore: score,
          scores: [{ issueIndex: 0, score: Math.floor(score / 10), feedback: 'モックフィードバック' }],
          overallFeedback: 'モック総合評価'
        },
        timestamp: new Date(now - daysAgo * 86400000 - j * 3600000).toISOString()
      })
    }
  }

  return history
}

const MOCK_HISTORY = generateMockHistory()

export default function MockScreen({ onBack, onTestProblem, onTestResult, onTestHistory }) {
  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-4xl mx-auto space-y-8" role="main" aria-label="開発者向けプレイグラウンド">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Beaker className="w-8 h-8 text-blue-500" aria-hidden="true" />
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
          aria-label="セットアップ画面に戻る"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
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
              aria-label="問題画面をモックデータで表示"
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
                aria-label="採点結果画面をモックデータで表示"
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
                aria-label="過去の問題画面をモックデータで表示"
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
                aria-label="ローディング表示を2秒間テスト"
              >
                ローディング表示（2秒）
              </button>
        </motion.div>
      </div>
    </div>
  )
}
