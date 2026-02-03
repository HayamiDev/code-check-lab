import { useMemo } from 'react'
import hljs from '../lib/highlight'
import { LANGUAGE_TO_HLJS } from '../constants/languages'

interface CodeViewerProps {
  code: string
  language: string
  className?: string
}

/**
 * シンタックスハイライト付きのコードビューアコンポーネント
 */
export default function CodeViewer({ code, language, className = '' }: CodeViewerProps) {
  const hljsLang = LANGUAGE_TO_HLJS[language as keyof typeof LANGUAGE_TO_HLJS] || language?.toLowerCase()

  const highlightedLines = useMemo(() => {
    if (!code) return []
    const highlighted = hljs.highlight(code, { language: hljsLang })
    return highlighted.value.split('\n')
  }, [code, hljsLang])

  return (
    <div className={`rounded-xl overflow-hidden bg-white/50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-800 shadow-sm relative group flex flex-col ${className}`}>
      {/* Code Content */}
      <div className="overflow-auto flex-1 w-full pt-2">
        <table className="w-full border-collapse text-xs sm:text-sm font-mono leading-6">
          <tbody>
            {highlightedLines.map((line, index) => (
              <tr key={index} className="hover:bg-slate-100 dark:hover:bg-[#2a2d2e] transition-colors">
                <td className="sticky left-0 select-none text-right pr-4 pl-4 py-0.5 text-slate-400 dark:text-slate-600 bg-slate-50/50 dark:bg-[#1e1e1e] w-[1%] min-w-[3rem] border-r border-slate-200 dark:border-slate-800/50 align-top">
                  {index + 1}
                </td>
                <td className="pl-4 pr-4 py-0.5 whitespace-pre-wrap break-all w-full">
                  <div className="text-slate-800 dark:text-[#d4d4d4]">
                    <code
                      className={`language-${hljsLang} !bg-transparent !p-0`}
                      dangerouslySetInnerHTML={{ __html: line || ' ' }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
