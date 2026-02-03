import { motion } from 'framer-motion'
import { ChevronLeft, Beaker } from 'lucide-react'
import { MOCK_PROBLEM, MOCK_EVALUATION } from '../constants/mockData'
import { Badge, Title } from '../lib/badgeSystem'

const MOCK_HISTORY = generateMockHistory()

// モックヒストリーから言語カウントを計算
const MOCK_COUNTS = MOCK_HISTORY.reduce((acc, entry) => {
  acc[entry.language] = (acc[entry.language] || 0) + 1
  return acc
}, {} as Record<string, number>)

// より充実したモックヒストリーデータを生成
const generateMockHistory = () => {
  const languages = ['Python', 'TypeScript', 'Kotlin', 'JavaScript', 'Go', 'Rust', 'Swift', 'Java']
  const history = []
  const now = Date.now()

  // 過去365日分のデータを生成（1年分のヒートマップ）
  let totalSessions = 0
  let perfectCount = 0
  let maxScore = 0
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0
  let lastSessionDay = -1

  for (let i = 0; i < 365; i++) {
    const daysAgo = i
    const timestamp = new Date(now - daysAgo * 86400000).toISOString()

    // リアルな学習パターン: 平日は70%の確率、週末は40%の確率でセッションあり
    const dayOfWeek = new Date(now - daysAgo * 86400000).getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const sessionProbability = isWeekend ? 0.4 : 0.7
    const hasSession = Math.random() < sessionProbability

    if (!hasSession) {
      if (lastSessionDay === i - 1) {
        // ストリーク途切れ
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 0
      }
      continue
    }

    // ストリーク計算
    if (lastSessionDay === i - 1 || lastSessionDay === -1) {
      tempStreak++
      if (i < 7) currentStreak = tempStreak // 直近7日以内
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
      if (i < 7) currentStreak = 1
    }
    lastSessionDay = i

    // 1日に1-3セッション
    const sessionsPerDay = Math.floor(Math.random() * 3) + 1

    for (let j = 0; j < sessionsPerDay; j++) {
      totalSessions++
      const language = languages[Math.floor(Math.random() * languages.length)]
      const level = Math.floor(Math.random() * 11) // 0-10

      // スコア分布: 高得点が出やすくしてバッジ獲得を可能に
      let score: number
      const rand = Math.random()
      if (rand < 0.15) {
        score = 100 // 15%の確率で満点
        perfectCount++
      } else if (rand < 0.35) {
        score = Math.floor(Math.random() * 5) + 95 // 20%の確率で95-99点
      } else if (rand < 0.60) {
        score = Math.floor(Math.random() * 10) + 85 // 25%の確率で85-94点
      } else if (rand < 0.85) {
        score = Math.floor(Math.random() * 15) + 70 // 25%の確率で70-84点
      } else {
        score = Math.floor(Math.random() * 30) + 40 // 15%の確率で40-69点
      }

      maxScore = Math.max(maxScore, score)

      history.push({
        id: `${i}-${j}`,
        language,
        problem: {
          language,
          level,
          code: `// Sample ${language} code for level ${level}\n// This is a mock problem for testing purposes\n\nfunction example() {\n  // Some code here\n}`,
          requiredIssuesCount: Math.floor(Math.random() * 3) + 2,
          requiredIssues: [
            { summary: 'サンプル問題1', detail: 'モックデータの問題です' },
            { summary: 'サンプル問題2', detail: 'モックデータの問題です' }
          ],
          optionalIssues: []
        },
        userAnswer: `モックレビュー回答\n1. 問題点を指摘\n2. 改善案を提示`,
        evaluationResult: {
          totalScore: score,
          scores: [
            { issueIndex: 0, score: Math.floor(score / 20), feedback: 'よく指摘できています' },
            { issueIndex: 1, score: Math.floor(score / 20), feedback: '的確な指摘です' }
          ],
          overallFeedback: score === 100 ? '完璧です!' : score >= 85 ? '素晴らしい!' : score >= 70 ? '良い指摘です' : '頑張りましょう'
        },
        timestamp: new Date(now - daysAgo * 86400000 - j * 3600000).toISOString()
      })
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak)

  console.log('Mock History Stats:', {
    totalSessions,
    perfectCount,
    maxScore,
    currentStreak,
    longestStreak,
    languagesUsed: new Set(history.map(h => h.language)).size
  })

  return history
}

// モックバッジ
const MOCK_BADGES: Badge[] = [
  {
    id: 'score_70',
    name: 'Good Eye',
    description: '70点以上を獲得',
    category: 'score',
    rarity: 'common',
    icon: '⭐',
    condition: () => true,
    unlocked: true,
    unlockedAt: new Date().toISOString()
  },
  {
    id: 'score_85',
    name: 'Sharp Reviewer',
    description: '85点以上を獲得',
    category: 'score',
    rarity: 'rare',
    icon: '⭐',
    condition: () => true,
    unlocked: true,
    unlockedAt: new Date().toISOString()
  },
  {
    id: 'score_95',
    name: 'Eagle Eye',
    description: '95点以上を獲得',
    category: 'score',
    rarity: 'epic',
    icon: '⭐',
    condition: () => true,
    unlocked: true,
    unlockedAt: new Date().toISOString()
  },
  {
    id: 'perfect_10',
    name: 'Flawless Legend',
    description: '10回満点を達成',
    category: 'perfect',
    rarity: 'legendary',
    icon: '💎',
    condition: () => true,
    unlocked: true,
    unlockedAt: new Date().toISOString()
  }
]

// モック称号
const MOCK_TITLES: Title[] = [
  {
    id: 'title_newcomer',
    name: '新人レビュアー',
    description: '最初のバッジを獲得',
    rarity: 'common',
    requiredBadges: [],
    unlocked: true,
    unlockedAt: new Date().toISOString()
  },
  {
    id: 'title_perfectionist',
    name: '完璧主義者',
    description: '初めての満点を達成',
    rarity: 'rare',
    requiredBadges: ['perfect_1'],
    unlocked: true,
    unlockedAt: new Date().toISOString()
  },
  {
    id: 'title_master',
    name: 'コードレビューマスター',
    description: '100回セッション & 5言語制覇',
    rarity: 'legendary',
    requiredBadges: ['session_100', 'lang_5'],
    unlocked: true,
    unlockedAt: new Date().toISOString()
  }
]

interface MockScreenProps {
  onBack: () => void
  onTestProblem: (problem: any, showLoading?: boolean) => void
  onTestResult: (problem: any, evaluation: any) => void
  onTestHistory: (mockData: any) => void
  onTestBadge: (badge: Badge) => void
  onTestTitle: (title: Title) => void
}

export default function MockScreen({
  onBack,
  onTestProblem,
  onTestResult,
  onTestHistory,
  onTestBadge,
  onTestTitle
}: MockScreenProps) {
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

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">トロフィーアニメーション</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">バッジ通知テスト</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              各レアリティのバッジ通知をテスト
            </p>
            <div className="space-y-2">
              {MOCK_BADGES.map((badge) => (
                <button
                  key={badge.id}
                  onClick={() => onTestBadge(badge)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-left"
                  aria-label={`${badge.name}バッジの通知をテスト`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">{badge.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{badge.rarity}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="premium-card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">称号通知テスト</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              各レアリティの称号通知をテスト
            </p>
            <div className="space-y-2">
              {MOCK_TITLES.map((title) => (
                <button
                  key={title.id}
                  onClick={() => onTestTitle(title)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-left"
                  aria-label={`${title.name}称号の通知をテスト`}
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">{title.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{title.rarity}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="premium-card p-6 md:col-span-2">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">複数トロフィー同時獲得</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              複数のバッジ・称号を連続で表示するテスト
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  MOCK_BADGES.forEach((badge, index) => {
                    setTimeout(() => onTestBadge(badge), index * 100)
                  })
                }}
                className="primary-button flex-1"
                aria-label="全バッジを連続表示"
              >
                全バッジを連続表示
              </button>
              <button
                onClick={() => {
                  MOCK_TITLES.forEach((title, index) => {
                    setTimeout(() => onTestTitle(title), index * 100)
                  })
                }}
                className="primary-button flex-1"
                aria-label="全称号を連続表示"
              >
                全称号を連続表示
              </button>
              <button
                onClick={() => {
                  const all = [
                    ...MOCK_BADGES.map(b => ({ badge: b })),
                    ...MOCK_TITLES.map(t => ({ title: t }))
                  ]
                  all.forEach((item, index) => {
                    setTimeout(() => {
                      if (item.badge) onTestBadge(item.badge)
                      if (item.title) onTestTitle(item.title)
                    }, index * 100)
                  })
                }}
                className="primary-button flex-1"
                aria-label="全トロフィーを連続表示"
              >
                全トロフィーを連続表示
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
