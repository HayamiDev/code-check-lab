import { motion } from 'framer-motion'
import { Crown, Check, Lock } from 'lucide-react'
import { Title, getRarityColorClass, getRarityLabel, getRarityGlowClass } from '../lib/badgeSystem'

interface TitleSelectorProps {
  titles: Title[]
  selectedTitleId: string | null
  onSelectTitle: (titleId: string | null) => void
}

export default function TitleSelector({ titles, selectedTitleId, onSelectTitle }: TitleSelectorProps) {

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
        className={`premium-card p-4 cursor-pointer transition-all ${selectedTitleId === null
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
      {unlockedTitles.length > 0 ? (
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
              onClick={() => onSelectTitle(title.id)}
              className={`premium-card p-5 cursor-pointer transition-all relative ${getRarityGlowClass(title.rarity)} ${selectedTitleId === title.id
                ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
            >
              {/* 選択中インジケーター */}
              {selectedTitleId === title.id && (
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500 rounded-full">
                    <Check className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                    <span className="text-[10px] font-black text-white uppercase tracking-wide">装備中</span>
                  </div>
                </div>
              )}

              <div className="pr-20">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  <h4 className="font-black text-lg text-slate-900 dark:text-white">
                    {title.name}
                  </h4>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase ${getRarityColorClass(title.rarity)} border mb-2`}>
                  {getRarityLabel(title.rarity)}
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {title.description}
                </p>
                {title.unlockedAt && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    獲得日: {new Date(title.unlockedAt).toLocaleDateString('ja-JP')}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        titles.length > 0 && (
          <div className="premium-card p-12 text-center">
            <div className="text-6xl mb-4">👑</div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              まだ称号を獲得していません
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              バッジを獲得して称号をアンロックしましょう！
            </p>
          </div>
        )
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
              className="premium-card p-5 opacity-60 relative"
            >
              {/* ロックアイコン */}
              <div className="absolute top-3 right-3">
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-600" aria-hidden="true" />
                </div>
              </div>

              <div className="pr-12">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-slate-400" aria-hidden="true" />
                  <h4 className="font-black text-lg text-slate-600 dark:text-slate-500">
                    {title.name}
                  </h4>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 mb-2`}>
                  {getRarityLabel(title.rarity)}
                </span>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  {title.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
