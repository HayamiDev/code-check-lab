import { motion } from 'framer-motion'
import { Flame, Trophy, Target } from 'lucide-react'
import { StreakData } from '../lib/streakStorage'

interface StreakDisplayProps {
  streakData: StreakData
}

export default function StreakDisplay({ streakData }: StreakDisplayProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Current Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-2xl" aria-hidden="true" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Flame className="w-5 h-5 text-orange-500 dark:text-orange-400" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Current Streak
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white" aria-label={`${streakData.currentStreak}日連続`}>
              {streakData.currentStreak}
            </span>
            <span className="text-lg font-bold text-slate-500 dark:text-slate-400">日連続</span>
          </div>
          {streakData.currentStreak > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Keep going! 🔥
            </p>
          )}
        </div>
      </motion.div>

      {/* Longest Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="premium-card p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-2xl" aria-hidden="true" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Longest Streak
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white" aria-label={`最長${streakData.longestStreak}日`}>
              {streakData.longestStreak}
            </span>
            <span className="text-lg font-bold text-slate-500 dark:text-slate-400">日</span>
          </div>
          {streakData.currentStreak === streakData.longestStreak && streakData.currentStreak > 0 && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 font-bold">
              New Record! 🏆
            </p>
          )}
        </div>
      </motion.div>

      {/* Total Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="premium-card p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl" aria-hidden="true" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Total Sessions
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white" aria-label={`合計${streakData.totalSessions}セッション`}>
              {streakData.totalSessions}
            </span>
            <span className="text-lg font-bold text-slate-500 dark:text-slate-400">回</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Keep practicing!
          </p>
        </div>
      </motion.div>
    </div>
  )
}
