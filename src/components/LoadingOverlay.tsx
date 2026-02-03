import { motion } from 'framer-motion'
import { Disc } from 'lucide-react'

export default function LoadingOverlay({ message = '読み込み中...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl flex items-center justify-center z-[100]"
    >
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          {/* Animated Spinner circles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-t-2 border-r-2 border-blue-500 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border-b-2 border-l-2 border-purple-500 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Disc className="w-8 h-8 text-white animate-pulse" />
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white font-black uppercase tracking-[0.2em] text-base text-center ml-[0.2em]"
          >
            {message}
          </motion.p>

          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  backgroundColor: ['#3b82f6', '#8b5cf6', '#3b82f6']
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-1.5 h-1.5 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
