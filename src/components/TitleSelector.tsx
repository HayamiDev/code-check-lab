import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Check, Lock } from 'lucide-react'
import { Title, getRarityColorClass, getRarityLabel, getRarityGlowClass } from '../lib/badgeSystem'

interface TitleSelectorProps {
  titles: Title[]
  selectedTitleId: string | null
  onSelectTitle: (titleId: string | null) => void
}

export default function TitleSelector({ titles, selectedTitleId, onSelectTitle }: TitleSelectorProps) {
  const [hoveredTitleId, setHoveredTitleId] = useState<string | null>(null)

  const unlockedTitles = titles.filter(t => t.unlocked)
  const lockedTitles = titles.filter(t => !t.unlocked)

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="premium-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="w-6 h-6 text-amber-500" aria-hidden="true" />
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">Titles</h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {unlockedTitles.length} / {titles.length} Unlocked
        </p>
      </div>

      {/* 称号なし選択 */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => onSelectTitle(null)}
        className={`premium-card p-4 cursor-pointer transition-all ${
          selectedTitleId === null
            ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-black text-slate-900 dark:text-white">称号なし</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">称号を非表示にする</p>
          </div>
          {selectedTitleId === null && (
            <Check className="w-5 h-5 text-blue-500" aria-hidden="true" />
          )}
        </div>
      </motion.div>

      {/* 獲得済み称号 */}
      {unlockedTitles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider pl-2">
            Unlocked Titles
          </h4>
          {unlockedTitles.map((title) => (
            <motion.div
              key={title.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setHoveredTitleId(title.id)}
              onHoverEnd={() => setHoveredTitleId(null)}
              onClick={() => onSelectTitle(title.id)}
              className={`premium-card p-4 cursor-pointer transition-all ${getRarityGlowClass(title.rarity)} ${
                selectedTitleId === title.id
                  ? 'ring-2 ring-blue-500'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-black text-lg text-slate-900 dark:text-white">
                      {title.name}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${getRarityColorClass(title.rarity)} border`}>
                      {getRarityLabel(title.rarity)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    {title.description}
                  </p>
                  {title.unlockedAt && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      獲得日: {new Date(title.unlockedAt).toLocaleDateString('ja-JP')}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-center gap-2">
                  {selectedTitleId === title.id ? (
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-slate-400" aria-hidden="true" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 未獲得称号 */}
      {lockedTitles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider pl-2">
            Locked Titles
          </h4>
          {lockedTitles.map((title) => (
            <motion.div
              key={title.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="premium-card p-4 opacity-60"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-black text-lg text-slate-600 dark:text-slate-500">
                      {title.name}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600`}>
                      {getRarityLabel(title.rarity)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {title.description}
                  </p>
                </div>
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-slate-400 dark:text-slate-600" aria-hidden="true" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
