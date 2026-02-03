import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Lock, Check } from 'lucide-react'
import { Badge, getRarityColorClass, getRarityLabel, getRarityGlowClass } from '../lib/badgeSystem'

interface BadgeCollectionProps {
  badges: Badge[]
}

export default function BadgeCollection({ badges }: BadgeCollectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'All', icon: '🎖️' },
    { id: 'streak', name: 'Streak', icon: '🔥' },
    { id: 'score', name: 'Score', icon: '⭐' },
    { id: 'perfect', name: 'Perfect', icon: '💯' },
    { id: 'language', name: 'Language', icon: '🌐' },
    { id: 'session', name: 'Session', icon: '📚' },
    { id: 'level', name: 'Level', icon: '🎯' }
  ]

  const filteredBadges = selectedCategory === 'all'
    ? badges
    : badges.filter(b => b.category === selectedCategory)

  const unlockedCount = badges.filter(b => b.unlocked).length
  const totalCount = badges.length
  const completionRate = Math.round((unlockedCount / totalCount) * 100)

  return (
    <div className="space-y-6">
      {/* 統計情報 */}
      <div className="premium-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Badge Collection</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {unlockedCount} / {totalCount} Unlocked ({completionRate}%)
            </p>
          </div>
          <div className="text-5xl" aria-hidden="true">🏆</div>
        </div>

        {/* プログレスバー */}
        <div className="relative h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-black text-white drop-shadow-lg">{completionRate}%</span>
          </div>
        </div>
      </div>

      {/* カテゴリフィルター */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            aria-label={`${cat.name}カテゴリを表示`}
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* バッジグリッド */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`premium-card p-4 relative group ${
              badge.unlocked ? getRarityGlowClass(badge.rarity) : 'opacity-60'
            }`}
          >
            {/* レアリティバッジ */}
            {badge.unlocked && (
              <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-black uppercase ${getRarityColorClass(badge.rarity)} border`}>
                {getRarityLabel(badge.rarity)}
              </div>
            )}

            {/* アイコン */}
            <div className="relative mb-3">
              <div className={`text-5xl text-center transition-transform ${
                badge.unlocked ? 'group-hover:scale-110' : 'grayscale'
              }`}>
                {badge.icon}
              </div>
              {!badge.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                </div>
              )}
              {badge.unlocked && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* バッジ名 */}
            <h4 className={`text-sm font-black text-center mb-1 ${
              badge.unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-600'
            }`}>
              {badge.name}
            </h4>

            {/* 説明 */}
            <p className={`text-[10px] text-center leading-tight ${
              badge.unlocked ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400 dark:text-slate-600'
            }`}>
              {badge.description}
            </p>

            {/* 獲得日時 */}
            {badge.unlocked && badge.unlockedAt && (
              <p className="text-[9px] text-center text-slate-400 dark:text-slate-500 mt-2">
                {new Date(badge.unlockedAt).toLocaleDateString('ja-JP')}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
