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
      className="premium-card p-8 flex flex-col items-center justify-center text-center space-y-6 lg:col-span-1 border-b-4 border-b-blue-500 dark:border-b-blue-400 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/5 z-0 pointer-events-none" />
      <div className="relative z-10">
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
          className={`text-8xl sm:text-9xl mb-4 drop-shadow-2xl ${totalScore >= 70
              ? 'text-green-500 dark:text-green-400'
              : totalScore >= 50
                ? 'text-yellow-500 dark:text-yellow-400'
                : 'text-red-500 dark:text-red-400'
            }`}
        >
          {getScoreIcon(totalScore)}
        </motion.div>
      </div>
      <div className="space-y-2 z-10">
        <div className="flex items-baseline justify-center">
          <span className="text-7xl sm:text-8xl font-black text-slate-900 dark:text-white tracking-tighter filter drop-shadow-sm">
            {totalScore}
          </span>
          <span className="text-2xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">pts</span>
        </div>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto opacity-50" />
      </div>
      <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] pt-2 z-10">
        正確性スコア
      </p>
    </motion.div>
  )
}
