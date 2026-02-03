import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Award, Crown } from 'lucide-react'
import BadgeCollection from './BadgeCollection'
import TitleSelector from './TitleSelector'
import { Badge, Title, loadBadges, loadTitles, BADGE_DEFINITIONS, TITLE_DEFINITIONS } from '../lib/badgeSystem'

interface AchievementScreenProps {
  onBack: () => void
  mockMode?: boolean
}

const SELECTED_TITLE_KEY = 'selected-title-id'

// モックバッジデータ（進捗がわかるように一部だけ解除）
const generateMockBadges = (): Badge[] => {
  const languageBadgeIds = [
    'lang_3', 'lang_5', 'lang_8', 'lang_12',
    'master_python', 'master_javascript', 'master_typescript', 'master_java',
    'master_csharp', 'master_cpp', 'master_php', 'master_go',
    'master_rust', 'master_kotlin', 'master_swift', 'master_ruby'
  ]

  return BADGE_DEFINITIONS.map((def, index) => {
    // 言語カテゴリのバッジは全て解除、それ以外は最初の8個を解除
    const unlocked = languageBadgeIds.includes(def.id) || index < 8
    return {
      ...def,
      unlocked,
      unlockedAt: unlocked ? new Date(Date.now() - (20 - index) * 86400000).toISOString() : undefined
    }
  })
}

// モック称号データ
const generateMockTitles = (): Title[] => {
  return TITLE_DEFINITIONS.map((def, index) => {
    // 最初の3個を解除状態に
    const unlocked = index < 3
    return {
      ...def,
      unlocked,
      unlockedAt: unlocked ? new Date(Date.now() - (3 - index) * 86400000).toISOString() : undefined
    }
  })
}

export default function AchievementScreen({ onBack, mockMode = false }: AchievementScreenProps) {
  const [activeTab, setActiveTab] = useState<'badges' | 'titles'>('badges')
  const [badges, setBadges] = useState<Badge[]>([])
  const [titles, setTitles] = useState<Title[]>([])
  const [selectedTitleId, setSelectedTitleId] = useState<string | null>(null)

  useEffect(() => {
    if (mockMode) {
      // モックデータを使用
      setBadges(generateMockBadges())
      setTitles(generateMockTitles())
      setSelectedTitleId('title_perfectionist')
    } else {
      // 実際のデータを読み込み
      let loadedBadges = loadBadges()
      let loadedTitles = loadTitles()

      // 初回アクセス時: バッジと称号の定義から初期化
      if (loadedBadges.length === 0) {
        loadedBadges = BADGE_DEFINITIONS.map(def => ({
          ...def,
          unlocked: false
        }))
      }
      if (loadedTitles.length === 0) {
        loadedTitles = TITLE_DEFINITIONS.map(def => ({
          ...def,
          unlocked: false
        }))
      }

      setBadges(loadedBadges)
      setTitles(loadedTitles)

      // 選択中の称号を読み込み
      const saved = localStorage.getItem(SELECTED_TITLE_KEY)
      if (saved) {
        setSelectedTitleId(saved)
      }
    }
  }, [mockMode])

  const handleSelectTitle = (titleId: string | null) => {
    setSelectedTitleId(titleId)
    if (!mockMode) {
      if (titleId) {
        localStorage.setItem(SELECTED_TITLE_KEY, titleId)
      } else {
        localStorage.removeItem(SELECTED_TITLE_KEY)
      }
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto space-y-8" role="main" aria-label="実績・称号画面">
      {/* ヘッダー */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Achievements
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
            バッジと称号のコレクション
          </p>
        </div>
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
          aria-label="戻る"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          Back
        </button>
      </header>

      {/* タブ切り替え */}
      <div className="flex gap-4 border-b-2 border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('badges')}
          className={`flex items-center gap-2 px-6 py-3 font-black text-sm uppercase tracking-wider transition-all relative ${
            activeTab === 'badges'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          aria-label="バッジタブ"
          aria-selected={activeTab === 'badges'}
          role="tab"
        >
          <Award className="w-5 h-5" aria-hidden="true" />
          Badges
          {activeTab === 'badges' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
              aria-hidden="true"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('titles')}
          className={`flex items-center gap-2 px-6 py-3 font-black text-sm uppercase tracking-wider transition-all relative ${
            activeTab === 'titles'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          aria-label="称号タブ"
          aria-selected={activeTab === 'titles'}
          role="tab"
        >
          <Crown className="w-5 h-5" aria-hidden="true" />
          Titles
          {activeTab === 'titles' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      {/* タブコンテンツ */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'badges' ? (
          <BadgeCollection badges={badges} />
        ) : (
          <TitleSelector
            titles={titles}
            selectedTitleId={selectedTitleId}
            onSelectTitle={handleSelectTitle}
          />
        )}
      </motion.div>
    </div>
  )
}
