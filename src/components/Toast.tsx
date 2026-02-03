import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, CheckCircle, Info, LucideIcon } from 'lucide-react'
import { ToastType } from '../types'

interface ToastProps {
  message: string
  type?: ToastType
  isOpen: boolean
  onClose: () => void
}

export default function Toast({ message, type = 'error', isOpen, onClose }: ToastProps) {
  const icons: Record<ToastType, LucideIcon> = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info
  }

  const colors: Record<ToastType, string> = {
    error: 'bg-red-500',
    success: 'bg-green-500',
    info: 'bg-blue-500'
  }

  const Icon = icons[type]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-8 right-8 z-[200] max-w-md"
        >
          <div className="premium-card p-4 flex items-center gap-3 shadow-2xl">
            <div className={`w-10 h-10 rounded-full ${colors[type]} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="flex-1 text-base font-semibold text-slate-900 dark:text-white">
              {message}
            </p>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
