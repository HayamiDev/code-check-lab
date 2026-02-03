import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { getScoreIcon } from '../constants/scoreColors'

interface ScoreCardProps {
  totalScore: number
}

export default function ScoreCard({ totalScore }: ScoreCardProps) {
  useEffect(() => {
    if (totalScore >= 70) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981']
      })
    }
  }, [totalScore])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="premium-card p-8 flex flex-col items-center justify-center text-center space-y-4 lg:col-span-1 border-b-4 border-b-blue-500 dark:border-b-blue-400"
    >
      <div className="relative">
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className={`text-8xl mb-2 ${
            totalScore >= 70
              ? 'text-green-600 dark:text-green-400'
              : totalScore >= 50
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {getScoreIcon(totalScore)}
        </motion.div>
      </div>
      <div className="space-y-1">
        <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
          {totalScore}
        </span>
        <span className="text-xl font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">pts</span>
      </div>
      <p className="text-xs font-black text-blue-500 dark:text-blue-400 uppercase tracking-[0.2em] pt-2">
        正確性スコア
      </p>
    </motion.div>
  )
}
