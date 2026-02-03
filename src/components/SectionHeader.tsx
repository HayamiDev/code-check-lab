import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface SectionHeaderProps {
  icon?: LucideIcon
  children: ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'accent'
  className?: string
}

/**
 * セクション見出しコンポーネント
 * アイコン付きの統一されたセクションヘッダーを提供
 */
export default function SectionHeader({
  icon: Icon,
  children,
  variant = 'default',
  className = ''
}: SectionHeaderProps) {
  const variants = {
    default: 'text-slate-600 dark:text-slate-400',
    primary: 'text-blue-500',
    secondary: 'text-purple-500',
    accent: 'text-amber-500'
  }

  const colorClass = variants[variant] || variants.default

  return (
    <div className={`flex items-center gap-2 font-black text-xs uppercase tracking-widest ${colorClass} ${className}`}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </div>
  )
}
