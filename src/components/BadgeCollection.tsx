import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Lock, Flame, Star, Target, MessageCircle, BookOpen, Mountain } from 'lucide-react'
import { Badge, getRarityColorClass, getRarityLabel, getRarityGlowClass } from '../lib/badgeSystem'

const LANGUAGE_ICONS: Record<string, string> = {
  Kotlin: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg',
  Swift: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg',
  JavaScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
  TypeScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
  Python: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  Java: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
  'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg',
  Go: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg',
  Rust: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg',
  PHP: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg',
  Ruby: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg',
  'C++': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
}

interface BadgeCollectionProps {
  badges: Badge[]
}

export default function BadgeCollection({ badges }: BadgeCollectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'All', icon: Award },
    { id: 'streak', name: 'Streak', icon: Flame },
    { id: 'score', name: 'Score', icon: Star },
    { id: 'perfect', name: 'Perfect', icon: Target },
    { id: 'language', name: 'Language', icon: MessageCircle },
    { id: 'session', name: 'Session', icon: BookOpen },
    { id: 'level', name: 'Level', icon: Mountain }
  ]

  const filteredBadges = selectedCategory === 'all'
    ? badges
    : badges.filter(b => b.category === selectedCategory)

  const unlockedCount = badges.filter(b => b.unlocked).length
  const totalCount = badges.length
  const completionRate = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

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
            className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${selectedCategory === cat.id
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            aria-label={`${cat.name}カテゴリを表示`}
          >
            <cat.icon className="w-4 h-4 mr-2" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* バッジグリッド */}
      {filteredBadges.length === 0 ? (
        <div className="premium-card p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
            {selectedCategory === 'all' ? 'バッジがありません' : 'このカテゴリにバッジがありません'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {selectedCategory === 'all'
              ? '問題を解いてバッジを獲得しましょう！'
              : '他のカテゴリを選択してください'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`premium-card p-4 relative group transition-all overflow-hidden ${badge.unlocked
                ? `${getRarityGlowClass(badge.rarity)} hover:scale-105`
                : 'opacity-60 hover:opacity-80'
                }`}
            >
              {/* Legendaryのキラキラボーダーエフェクト */}
              {badge.unlocked && badge.rarity === 'legendary' && (
                <>
                  <div className="absolute inset-0 rounded-xl border-2 border-amber-400/50 animate-pulse" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-xl opacity-20 blur-sm animate-shimmer"
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 3s linear infinite'
                    }} />
                </>
              )}

              {/* レアリティバッジ */}
              <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-black uppercase border z-10 ${badge.unlocked
                ? getRarityColorClass(badge.rarity)
                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600'
                }`}>
                {getRarityLabel(badge.rarity)}
              </div>

              {/* 解除済みの背景グロー */}
              {badge.unlocked && (
                <div className={`absolute inset-0 rounded-xl opacity-10 ${badge.rarity === 'legendary' ? 'bg-gradient-to-br from-amber-400 to-yellow-400' :
                  badge.rarity === 'epic' ? 'bg-gradient-to-br from-purple-400 to-pink-400' :
                    badge.rarity === 'rare' ? 'bg-gradient-to-br from-blue-400 to-cyan-400' :
                      'bg-slate-300'
                  }`} />
              )}

              {/* アイコン */}
              <div className="relative mb-3 mt-2">
                <div className={`text-5xl text-center transition-transform ${badge.unlocked ? 'group-hover:scale-110' : 'grayscale'
                  }`}>
                  {badge.languageIcon && LANGUAGE_ICONS[badge.languageIcon] ? (
                    <img
                      src={LANGUAGE_ICONS[badge.languageIcon]}
                      alt={badge.languageIcon}
                      className={`w-12 h-12 mx-auto object-contain ${!badge.unlocked ? 'opacity-40' : ''}`}
                    />
                  ) : (
                    <badge.icon
                      className={`w-12 h-12 mx-auto ${badge.unlocked ? badge.color : 'text-slate-400 dark:text-slate-600'}`}
                      strokeWidth={1.5}
                    />
                  )}
                </div>
                {!badge.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                  </div>
                )}
              </div>

              {/* バッジ名 */}
              <h4 className={`text-sm font-black text-center mb-1 ${badge.unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-600'
                }`}>
                {badge.name}
              </h4>

              {/* 説明 */}
              <p className={`text-[10px] text-center leading-tight ${badge.unlocked ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400 dark:text-slate-600'
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
      )}
    </div>
  )
}
