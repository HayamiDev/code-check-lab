import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { useKeyboard } from '../hooks/useKeyboard'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  // Escキーで閉じる
  useKeyboard('Escape', onClose, { enabled: isOpen })

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="premium-card max-w-md w-full p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
              </div>
              <h3 id="dialog-title" className="text-xl font-black text-slate-900 dark:text-white">
                {title}
              </h3>
            </div>
            <p id="dialog-description" className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              {message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 secondary-button"
                aria-label="キャンセルしてダイアログを閉じる"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  onConfirm()
                  onClose()
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 active:scale-95 transition-all"
                aria-label="削除を確定する"
              >
                削除
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
