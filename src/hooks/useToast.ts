import { useState, useCallback } from 'react'
import { Toast, ToastType } from '../types'

export function useToast() {
  const [toast, setToast] = useState<Toast>({ isOpen: false, message: '', type: 'error' })

  const showToast = useCallback((message: string, type: ToastType = 'error', duration = 5000) => {
    setToast({ isOpen: true, message, type })

    if (duration > 0) {
      setTimeout(() => {
        setToast(prev => ({ ...prev, isOpen: false }))
      }, duration)
    }
  }, [])

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isOpen: false }))
  }, [])

  return {
    toast,
    showToast,
    hideToast
  }
}
