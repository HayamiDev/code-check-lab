import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge, Title, getRarityColorClass, getRarityLabel } from '../lib/badgeSystem'

interface TrophyNotificationProps {
  badge?: Badge
  title?: Title
  onClose: () => void
}

export default function TrophyNotification({ badge, title, onClose }: TrophyNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [soundPlayed, setSoundPlayed] = useState(false)

  const item = badge || title
  const isBadge = !!badge

  useEffect(() => {
    if (!item) return

    // PlayStation風の効果音（ビープ音）を鳴らす
    if (!soundPlayed) {
      playTrophySound(item.rarity)
      setSoundPlayed(true)
    }

    // 5秒後に自動で閉じる
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 500)
    }, 5000)

    return () => clearTimeout(timer)
  }, [item, onClose, soundPlayed])

  if (!item) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed left-6 bottom-6 z-[200] w-96"
          role="alert"
          aria-live="assertive"
        >
          {/* PlayStation風のカード */}
          <div className="relative overflow-hidden rounded-xl shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700">
            {/* 背景のグロー効果 */}
            <div className={`absolute inset-0 opacity-20 ${
              item.rarity === 'legendary' ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
              item.rarity === 'epic' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
              item.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
              'bg-slate-600'
            }`} aria-hidden="true" />

            {/* メインコンテンツ */}
            <div className="relative p-5">
              {/* ヘッダー */}
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  <span className="text-2xl">{isBadge ? '🏆' : '👑'}</span>
                </motion.div>
                <div className="flex-1">
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                  >
                    {isBadge ? 'Badge Unlocked' : 'Title Earned'}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase mt-1 ${getRarityColorClass(item.rarity)} border`}>
                      {getRarityLabel(item.rarity)}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* バッジ/称号情報 */}
              <div className="flex items-center gap-4">
                {/* アイコン */}
                {isBadge && (
                  <motion.div
                    initial={{ scale: 0, rotate: 360 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
                    className="text-6xl"
                    aria-hidden="true"
                  >
                    {badge.icon}
                  </motion.div>
                )}

                {/* テキスト */}
                <div className="flex-1">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-xl font-black text-white mb-1 leading-tight"
                  >
                    {item.name}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm text-slate-300 leading-snug"
                  >
                    {item.description}
                  </motion.p>
                </div>
              </div>

              {/* プログレスバー */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 4.2 }}
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left"
                aria-hidden="true"
              />
            </div>

            {/* パーティクル効果 */}
            {item.rarity === 'legendary' && (
              <>
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: 200,
                      y: 80,
                      scale: 0,
                      opacity: 1
                    }}
                    animate={{
                      x: Math.random() * 400 - 200,
                      y: Math.random() * 200 - 100,
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0]
                    }}
                    transition={{
                      delay: 0.5 + i * 0.05,
                      duration: 1.5,
                      ease: 'easeOut'
                    }}
                    className="absolute w-2 h-2 rounded-full bg-amber-400"
                    style={{
                      left: '50%',
                      top: '50%'
                    }}
                    aria-hidden="true"
                  />
                ))}
              </>
            )}
          </div>

          {/* 閉じるボタン */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 500)
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-colors"
            aria-label="通知を閉じる"
          >
            ✕
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * レアリティに応じたトロフィー音を再生（Web Audio API）
 */
function playTrophySound(rarity: string) {
  if (typeof window === 'undefined' || !window.AudioContext) return

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  // レアリティごとに異なる音程
  const frequencies = {
    common: [523.25, 659.25], // C5 -> E5
    rare: [523.25, 698.46, 830.61], // C5 -> F5 -> G#5
    epic: [659.25, 830.61, 987.77], // E5 -> G#5 -> B5
    legendary: [523.25, 659.25, 783.99, 1046.50] // C5 -> E5 -> G5 -> C6
  }

  const notes = frequencies[rarity as keyof typeof frequencies] || frequencies.common

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(notes[0], audioContext.currentTime)

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

  // 音程を変化させる
  notes.forEach((freq, i) => {
    if (i > 0) {
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.15)
    }
  })

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.5)
}
