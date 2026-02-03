import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Award, Crown } from 'lucide-react'
import BadgeCollection from './BadgeCollection'
import TitleSelector from './TitleSelector'
import { Badge, Title, loadBadges, loadTitles } from '../lib/badgeSystem'

interface AchievementScreenProps {
  onBack: () => void
}

const SELECTED_TITLE_KEY = 'selected-title-id'

export default function AchievementScreen({ onBack }: AchievementScreenProps) {
  const [activeTab, setActiveTab] = useState<'badges' | 'titles'>('badges')
  const [badges, setBadges] = useState<Badge[]>([])
  const [titles, setTitles] = useState<Title[]>([])
  const [selectedTitleId, setSelectedTitleId] = useState<string | null>(null)

  useEffect(() => {
    // データを読み込み
    setBadges(loadBadges())
    setTitles(loadTitles())

    // 選択中の称号を読み込み
    const saved = localStorage.getItem(SELECTED_TITLE_KEY)
    if (saved) {
      setSelectedTitleId(saved)
    }
  }, [])

  const handleSelectTitle = (titleId: string | null) => {
    setSelectedTitleId(titleId)
    if (titleId) {
      localStorage.setItem(SELECTED_TITLE_KEY, titleId)
    } else {
      localStorage.removeItem(SELECTED_TITLE_KEY)
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
          aria-label="セットアップ画面に戻る"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          戻る
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
