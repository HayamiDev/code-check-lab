import { useMemo } from 'react'
import hljs from '../lib/highlight'
import { LANGUAGE_TO_HLJS } from '../constants/languages'

/**
 * シンタックスハイライト付きのコードビューアコンポーネント
 * @param {Object} props
 * @param {string} props.code - 表示するコード
 * @param {string} props.language - プログラミング言語
 * @param {string} props.className - 追加のCSSクラス
 */
export default function CodeViewer({ code, language, className = '' }) {
  const hljsLang = LANGUAGE_TO_HLJS[language] || language?.toLowerCase()

  const highlightedLines = useMemo(() => {
    if (!code) return []
    const highlighted = hljs.highlight(code, { language: hljsLang })
    return highlighted.value.split('\n')
  }, [code, hljsLang])

  return (
    <div className={`bg-slate-100 dark:bg-slate-900 rounded-lg overflow-x-auto text-xs sm:text-sm ${className}`}>
      <table className="w-full border-collapse">
        <tbody>
          {highlightedLines.map((line, index) => (
            <tr key={index} className="hover:bg-slate-200/50 dark:hover:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 last:border-b-0">
              <td className="sticky left-0 select-none text-right pr-4 pl-4 py-2 text-slate-500 dark:text-slate-400 border-r border-slate-300 dark:border-slate-700 align-top w-1 bg-slate-100 dark:bg-slate-900 text-[11px] font-mono">
                {index + 1}
              </td>
              <td className="pl-4 pr-4 py-2 whitespace-pre font-mono text-slate-900 dark:text-slate-100 text-sm">
                <code
                  className={`language-${hljsLang}`}
                  dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
