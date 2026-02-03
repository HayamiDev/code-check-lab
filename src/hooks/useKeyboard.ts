import { useEffect } from 'react'

interface UseKeyboardOptions {
  enabled?: boolean
  preventDefault?: boolean
}

/**
 * キーボードイベントを簡単に扱うカスタムフック
 */
export function useKeyboard(
  keys: string | string[],
  callback: (e: KeyboardEvent) => void,
  options: UseKeyboardOptions = {}
) {
  const { enabled = true, preventDefault = false } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyArray = Array.isArray(keys) ? keys : [keys]

      // 特殊キー組み合わせの処理
      if (keyArray.length === 2) {
        const [modifier, key] = keyArray
        const isModifierPressed =
          (modifier === 'Ctrl' && (e.ctrlKey || e.metaKey)) ||
          (modifier === 'Shift' && e.shiftKey) ||
          (modifier === 'Alt' && e.altKey)

        if (isModifierPressed && e.key === key) {
          if (preventDefault) e.preventDefault()
          callback(e)
        }
      } else {
        // 単一キーの処理
        if (e.key === keyArray[0]) {
          if (preventDefault) e.preventDefault()
          callback(e)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [keys, callback, enabled, preventDefault])
}
