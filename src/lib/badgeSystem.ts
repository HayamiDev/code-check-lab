import { HistoryEntry } from '../types'
import {
  LucideIcon,
  Flame, Zap, Rocket, Footprints,
  Medal, Crown,
  Target, Crosshair, Diamond,
  MessageCircle, BookOpen, Brain, Globe,
  Pencil, Laptop, Glasses,
  Mountain, Flag, Swords, Skull,
  Code2, Sparkles, Binary, FileCode, Terminal, Boxes, Cpu, Hash, FileJson, Wrench, Blocks
} from 'lucide-react'

// ストリークデータの型定義（ストリーク機能は別ブランチだが、バッジシステムで使用）
export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastSessionDate: string | null
  totalSessions: number
}

// バッジの種類
export type BadgeCategory = 'streak' | 'score' | 'language' | 'session' | 'perfect' | 'level'

// バッジのレアリティ
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary'

// バッジ定義
export interface Badge {
  id: string
  name: string
  description: string
  category: BadgeCategory
  rarity: BadgeRarity
  icon: LucideIcon
  color: string // tailwind text color class
  condition: (data: BadgeCheckData) => boolean
  unlocked: boolean
  unlockedAt?: string
  languageIcon?: string // 言語マスターバッジ用の言語名
}

// バッジチェック用のデータ
export interface BadgeCheckData {
  streakData: StreakData
  allHistory: HistoryEntry[]
  languagesUsed: Set<string>
  maxScore: number
  perfectCount: number
  maxLevel: number
  languageLevel10Count: Record<string, number> // 各言語のレベル10クリア回数
}

// 称号定義
export interface Title {
  id: string
  name: string
  description: string
  rarity: BadgeRarity
  requiredBadges: string[] // 必要なバッジID
  unlocked: boolean
  unlockedAt?: string
}

// バッジ定義リスト
export const BADGE_DEFINITIONS: Omit<Badge, 'unlocked' | 'unlockedAt'>[] = [
  // ストリークバッジ
  {
    id: 'streak_3',
    name: 'Getting Started',
    description: '3日連続で学習',
    category: 'streak',
    rarity: 'common',
    icon: Footprints,
    color: 'text-emerald-500',
    condition: (data) => data.streakData.currentStreak >= 3
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: '7日連続で学習',
    category: 'streak',
    rarity: 'rare',
    icon: Flame,
    color: 'text-orange-500',
    condition: (data) => data.streakData.currentStreak >= 7
  },
  {
    id: 'streak_14',
    name: 'Fortnight Champion',
    description: '14日連続で学習',
    category: 'streak',
    rarity: 'epic',
    icon: Rocket,
    color: 'text-rose-500',
    condition: (data) => data.streakData.currentStreak >= 14
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: '30日連続で学習',
    category: 'streak',
    rarity: 'legendary',
    icon: Zap,
    color: 'text-yellow-500',
    condition: (data) => data.streakData.currentStreak >= 30
  },

  // スコアバッジ
  {
    id: 'score_70',
    name: 'Good Eye',
    description: '70点以上を獲得',
    category: 'score',
    rarity: 'common',
    icon: Medal,
    color: 'text-amber-700', // Bronze
    condition: (data) => data.maxScore >= 70
  },
  {
    id: 'score_85',
    name: 'Sharp Reviewer',
    description: '85点以上を獲得',
    category: 'score',
    rarity: 'rare',
    icon: Medal,
    color: 'text-slate-400', // Silver
    condition: (data) => data.maxScore >= 85
  },
  {
    id: 'score_95',
    name: 'Eagle Eye',
    description: '95点以上を獲得',
    category: 'score',
    rarity: 'epic',
    icon: Medal,
    color: 'text-yellow-400', // Gold
    condition: (data) => data.maxScore >= 95
  },

  // パーフェクトバッジ
  {
    id: 'perfect_1',
    name: 'First Perfect',
    description: '初めての満点',
    category: 'perfect',
    rarity: 'rare',
    icon: Target,
    color: 'text-red-500',
    condition: (data) => data.perfectCount >= 1
  },
  {
    id: 'perfect_5',
    name: 'Perfectionist',
    description: '5回満点を達成',
    category: 'perfect',
    rarity: 'epic',
    icon: Crosshair,
    color: 'text-fuchsia-500',
    condition: (data) => data.perfectCount >= 5
  },
  {
    id: 'perfect_10',
    name: 'Flawless Legend',
    description: '10回満点を達成',
    category: 'perfect',
    rarity: 'legendary',
    icon: Diamond,
    color: 'text-cyan-400',
    condition: (data) => data.perfectCount >= 10
  },

  // 言語バッジ
  {
    id: 'lang_3',
    name: 'Polyglot',
    description: '3つの言語を学習',
    category: 'language',
    rarity: 'common',
    icon: MessageCircle,
    color: 'text-green-500',
    condition: (data) => data.languagesUsed.size >= 3
  },
  {
    id: 'lang_5',
    name: 'Language Master',
    description: '5つの言語を学習',
    category: 'language',
    rarity: 'rare',
    icon: BookOpen,
    color: 'text-blue-500',
    condition: (data) => data.languagesUsed.size >= 5
  },
  {
    id: 'lang_8',
    name: 'Multilingual Expert',
    description: '8つの言語を学習',
    category: 'language',
    rarity: 'epic',
    icon: Brain,
    color: 'text-violet-500',
    condition: (data) => data.languagesUsed.size >= 8
  },
  {
    id: 'lang_12',
    name: 'Universal Developer',
    description: '全12言語を制覇',
    category: 'language',
    rarity: 'legendary',
    icon: Globe,
    color: 'text-indigo-500',
    condition: (data) => data.languagesUsed.size >= 12
  },

  // セッション数バッジ
  {
    id: 'session_10',
    name: 'Beginner',
    description: '10回のセッションを完了',
    category: 'session',
    rarity: 'common',
    icon: Pencil,
    color: 'text-slate-500',
    condition: (data) => data.streakData.totalSessions >= 10
  },
  {
    id: 'session_50',
    name: 'Dedicated Learner',
    description: '50回のセッションを完了',
    category: 'session',
    rarity: 'rare',
    icon: Laptop,
    color: 'text-sky-500',
    condition: (data) => data.streakData.totalSessions >= 50
  },
  {
    id: 'session_100',
    name: 'Veteran Reviewer',
    description: '100回のセッションを完了',
    category: 'session',
    rarity: 'epic',
    icon: Glasses,
    color: 'text-teal-500',
    condition: (data) => data.streakData.totalSessions >= 100
  },
  {
    id: 'session_200',
    name: 'Review Master',
    description: '200回のセッションを完了',
    category: 'session',
    rarity: 'legendary',
    icon: Crown,
    color: 'text-amber-500',
    condition: (data) => data.streakData.totalSessions >= 200
  },

  // レベルバッジ
  {
    id: 'level_5',
    name: 'Intermediate',
    description: 'レベル5以上をクリア',
    category: 'level',
    rarity: 'common',
    icon: Mountain,
    color: 'text-stone-500',
    condition: (data) => data.maxLevel >= 5
  },
  {
    id: 'level_7',
    name: 'Advanced',
    description: 'レベル7以上をクリア',
    category: 'level',
    rarity: 'rare',
    icon: Flag,
    color: 'text-lime-500',
    condition: (data) => data.maxLevel >= 7
  },
  {
    id: 'level_9',
    name: 'Expert',
    description: 'レベル9以上をクリア',
    category: 'level',
    rarity: 'epic',
    icon: Swords,
    color: 'text-red-600',
    condition: (data) => data.maxLevel >= 9
  },
  {
    id: 'level_10',
    name: 'Elite Reviewer',
    description: '最高難易度レベル10をクリア',
    category: 'level',
    rarity: 'legendary',
    icon: Skull,
    color: 'text-purple-600',
    condition: (data) => data.maxLevel >= 10
  },

  // 言語マスターバッジ
  {
    id: 'master_python',
    name: 'Python Master',
    description: 'Pythonレベル10を10回クリア',
    category: 'language',
    rarity: 'epic',
    icon: Code2,
    color: 'text-blue-500',
    languageIcon: 'Python',
    condition: (data) => (data.languageLevel10Count['Python'] || 0) >= 10
  },
  {
    id: 'master_javascript',
    name: 'JavaScript Master',
    description: 'JavaScriptレベル10を10回クリア',
    category: 'language',
    rarity: 'epic',
    icon: FileCode,
    color: 'text-yellow-500',
    languageIcon: 'JavaScript',
    condition: (data) => (data.languageLevel10Count['JavaScript'] || 0) >= 10
  },
  {
    id: 'master_typescript',
    name: 'TypeScript Master',
    description: 'TypeScriptレベル10を10回クリア',
    category: 'language',
    rarity: 'epic',
    icon: FileJson,
    color: 'text-blue-600',
    languageIcon: 'TypeScript',
    condition: (data) => (data.languageLevel10Count['TypeScript'] || 0) >= 10
  },
  {
    id: 'master_java',
    name: 'Java Master',
    description: 'Javaレベル10を10回クリア',
    category: 'language',
    rarity: 'epic',
    icon: Boxes,
    color: 'text-red-600',
    languageIcon: 'Java',
    condition: (data) => (data.languageLevel10Count['Java'] || 0) >= 10
  },
  {
    id: 'master_csharp',
    name: 'C# Master',
    description: 'C#レベル10を10回クリア',
    category: 'language',
    rarity: 'epic',
    icon: Hash,
    color: 'text-purple-600',
    languageIcon: 'C#',
    condition: (data) => (data.languageLevel10Count['C#'] || 0) >= 10
  },
  {
    id: 'master_cpp',
    name: 'C++ Master',
    description: 'C++レベル10を10回クリア',
    category: 'language',
    rarity: 'epic',
    icon: Cpu,
    color: 'text-blue-700',
    languageIcon: 'C++',
    condition: (data) => (data.languageLevel10Count['C++'] || 0) >= 10
  },
  {
    id: 'master_php',
    name: 'PHP Master',
    description: 'PHPレベル10を10回クリア',
    category: 'language',
    rarity: 'epic',
    icon: Terminal,
    color: 'text-indigo-500',
    languageIcon: 'PHP',
    condition: (data) => (data.languageLevel10Count['PHP'] || 0) >= 10
  },
  {
    id: 'master_go',
    name: 'Go Master',
    description: 'Goレベル10を10回クリア',
    category: 'language',
    rarity: 'epic',
    icon: Sparkles,
    color: 'text-cyan-500',
    languageIcon: 'Go',
    condition: (data) => (data.languageLevel10Count['Go'] || 0) >= 10
  },
  {
    id: 'master_rust',
    name: 'Rust Master',
    description: 'Rustレベル10を10回クリア',
    category: 'language',
    rarity: 'epic',
    icon: Wrench,
    color: 'text-orange-600',
    languageIcon: 'Rust',
    condition: (data) => (data.languageLevel10Count['Rust'] || 0) >= 10
  },
  {
    id: 'master_kotlin',
    name: 'Kotlin Master',
    description: 'Kotlinレベル10を10回クリア',
    category: 'language',
    rarity: 'epic',
    icon: Binary,
    color: 'text-purple-500',
    languageIcon: 'Kotlin',
    condition: (data) => (data.languageLevel10Count['Kotlin'] || 0) >= 10
  },
  {
    id: 'master_swift',
    name: 'Swift Master',
    description: 'Swiftレベル10を10回クリア',
    category: 'language',
    rarity: 'epic',
    icon: Blocks,
    color: 'text-orange-500',
    languageIcon: 'Swift',
    condition: (data) => (data.languageLevel10Count['Swift'] || 0) >= 10
  },
  {
    id: 'master_ruby',
    name: 'Ruby Master',
    description: 'Rubyレベル10を10回クリア',
    category: 'language',
    rarity: 'epic',
    icon: Diamond,
    color: 'text-red-500',
    languageIcon: 'Ruby',
    condition: (data) => (data.languageLevel10Count['Ruby'] || 0) >= 10
  }
]

// 称号定義リスト
export const TITLE_DEFINITIONS: Omit<Title, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'title_newcomer',
    name: '新人レビュアー',
    description: '最初のバッジを獲得',
    rarity: 'common',
    requiredBadges: [] // 任意の1つのバッジ
  },
  {
    id: 'title_perfectionist',
    name: '完璧主義者',
    description: '初めての満点を達成',
    rarity: 'rare',
    requiredBadges: ['perfect_1']
  },
  {
    id: 'title_consistent',
    name: '継続は力なり',
    description: '3日連続で学習',
    rarity: 'common',
    requiredBadges: [] // ストリーク機能実装時に条件追加
  },
  {
    id: 'title_dedicated',
    name: '熱心な学習者',
    description: '7日連続で学習',
    rarity: 'rare',
    requiredBadges: [] // ストリーク機能実装時に条件追加
  },
  {
    id: 'title_polyglot',
    name: 'マルチリンガル',
    description: '5つの言語を学習',
    rarity: 'epic',
    requiredBadges: ['lang_5']
  },
  {
    id: 'title_veteran',
    name: 'ベテランレビュアー',
    description: '100回のセッションを完了',
    rarity: 'epic',
    requiredBadges: ['session_100']
  },
  {
    id: 'title_master',
    name: 'コードレビューマスター',
    description: '100回セッション & 5言語制覇',
    rarity: 'legendary',
    requiredBadges: ['session_100', 'lang_5']
  },
  {
    id: 'title_legend',
    name: '伝説のレビュアー',
    description: '200回セッション & 全言語制覇',
    rarity: 'legendary',
    requiredBadges: ['session_200', 'lang_12']
  },
  {
    id: 'title_flawless',
    name: '無欠の目',
    description: '10回の満点 & レベル10クリア',
    rarity: 'legendary',
    requiredBadges: ['perfect_10', 'level_10']
  }
]

// レアリティの色クラス
export function getRarityColorClass(rarity: BadgeRarity): string {
  const colors = {
    common: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
    rare: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
    epic: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
    legendary: 'text-amber-600 dark:text-amber-400 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-amber-400 dark:border-amber-600'
  }
  return colors[rarity]
}

// レアリティのラベル
export function getRarityLabel(rarity: BadgeRarity): string {
  const labels = {
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary'
  }
  return labels[rarity]
}

// レアリティのグロー効果
export function getRarityGlowClass(rarity: BadgeRarity): string {
  const glows = {
    common: '',
    rare: 'shadow-lg shadow-blue-500/20',
    epic: 'shadow-lg shadow-purple-500/30',
    legendary: 'shadow-xl shadow-amber-500/40'
  }
  return glows[rarity]
}

/**
 * 履歴データからバッジチェック用のデータを生成
 */
export function generateBadgeCheckData(
  streakData: StreakData,
  allHistory: HistoryEntry[]
): BadgeCheckData {
  const languagesUsed = new Set<string>()
  let maxScore = 0
  let perfectCount = 0
  let maxLevel = 0
  const languageLevel10Count: Record<string, number> = {}

  allHistory.forEach(entry => {
    languagesUsed.add(entry.language)
    maxScore = Math.max(maxScore, entry.evaluationResult.totalScore)
    maxLevel = Math.max(maxLevel, entry.problem.level)
    if (entry.evaluationResult.totalScore === 100) {
      perfectCount++
    }
    // レベル10をクリアした回数をカウント
    if (entry.problem.level === 10) {
      languageLevel10Count[entry.language] = (languageLevel10Count[entry.language] || 0) + 1
    }
  })

  return {
    streakData,
    allHistory,
    languagesUsed,
    maxScore,
    perfectCount,
    maxLevel,
    languageLevel10Count
  }
}

/**
 * バッジの獲得状況をチェック
 */
export function checkBadges(data: BadgeCheckData, existingBadges: Badge[] = []): Badge[] {
  const now = new Date().toISOString()
  const existingBadgeMap = new Map(existingBadges.map(b => [b.id, b]))

  return BADGE_DEFINITIONS.map(def => {
    const existing = existingBadgeMap.get(def.id)
    const unlocked = def.condition(data)

    if (existing) {
      return {
        ...def,
        unlocked,
        unlockedAt: unlocked && !existing.unlocked ? now : existing.unlockedAt
      }
    }

    return {
      ...def,
      unlocked,
      unlockedAt: unlocked ? now : undefined
    }
  })
}

/**
 * 称号の獲得状況をチェック
 */
export function checkTitles(badges: Badge[], existingTitles: Title[] = []): Title[] {
  const now = new Date().toISOString()
  const existingTitleMap = new Map(existingTitles.map(t => [t.id, t]))
  const unlockedBadgeIds = new Set(badges.filter(b => b.unlocked).map(b => b.id))

  // 最初のバッジを獲得したかチェック（newcomer称号用）
  const hasAnyBadge = badges.some(b => b.unlocked)

  return TITLE_DEFINITIONS.map(def => {
    const existing = existingTitleMap.get(def.id)

    let unlocked: boolean
    if (def.id === 'title_newcomer') {
      unlocked = hasAnyBadge
    } else {
      unlocked = def.requiredBadges.every(badgeId => unlockedBadgeIds.has(badgeId))
    }

    if (existing) {
      return {
        ...def,
        unlocked,
        unlockedAt: unlocked && !existing.unlocked ? now : existing.unlockedAt
      }
    }

    return {
      ...def,
      unlocked,
      unlockedAt: unlocked ? now : undefined
    }
  })
}

const BADGE_STORAGE_KEY = 'code-review-badges'
const TITLE_STORAGE_KEY = 'code-review-titles'

/**
 * バッジをLocalStorageから読み込み
 */
export function loadBadges(): Badge[] {
  const stored = localStorage.getItem(BADGE_STORAGE_KEY)
  if (!stored) return []
  // 保存されたデータはJSONだが、iconプロパティはコンポーネント関数ではなく文字列やオブジェクトになる可能性がある
  // 復元時に定義データとマージしてiconを復旧する必要がある
  // しかし、Badge型はすでにiconがLucideIconになっている
  // ここで不整合が起きる可能性があるが、読み込み後にBADGE_DEFINITIONSとマージされるタイミングがあればよい

  // JSON.parseしたデータのiconは失われているか文字列になっている
  // ここでは型アサーションでごまかすが、実際にはupdateBadgesAndTitlesで再生成されるときに
  // BADGE_DEFINITIONSのiconが使われるか確認が必要
  return JSON.parse(stored)
}

/**
 * バッジをLocalStorageに保存
 */
export function saveBadges(badges: Badge[]): void {
  // アイコンコンポーネントはJSON.stringifyできない（消えるか{}になる）
  // そのため、保存時はiconを除外するか、気にせず保存して読み込み時に復元するか
  // 簡易的にはそのまま保存して、読み込み側で定義データとIDマッチングさせてiconを復元すべきだが
  // 今回のスコープではそこまで厳密にやらなくとも、毎回BADGE_DEFINITIONSからマッピングし直すロジックがあればよい
  // checkBadges関数はBADGE_DEFINITIONSをベースにしているので、iconは常に新しい定義から来るはず
  localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(badges))
}

/**
 * 称号をLocalStorageから読み込み
 */
export function loadTitles(): Title[] {
  const stored = localStorage.getItem(TITLE_STORAGE_KEY)
  if (!stored) return []
  return JSON.parse(stored)
}

/**
 * 称号をLocalStorageに保存
 */
export function saveTitles(titles: Title[]): void {
  localStorage.setItem(TITLE_STORAGE_KEY, JSON.stringify(titles))
}

/**
 * バッジと称号を更新（セッション完了時に呼び出す）
 */
export function updateBadgesAndTitles(
  streakData: StreakData,
  allHistory: HistoryEntry[]
): { badges: Badge[]; titles: Title[]; newBadges: Badge[]; newTitles: Title[] } {
  const existingBadges = loadBadges()
  const existingTitles = loadTitles()

  const data = generateBadgeCheckData(streakData, allHistory)
  const updatedBadges = checkBadges(data, existingBadges)
  const updatedTitles = checkTitles(updatedBadges, existingTitles)

  // 新規獲得したバッジと称号を検出
  const existingBadgeIds = new Set(existingBadges.filter(b => b.unlocked).map(b => b.id))
  const existingTitleIds = new Set(existingTitles.filter(t => t.unlocked).map(t => t.id))

  const newBadges = updatedBadges.filter(b => b.unlocked && !existingBadgeIds.has(b.id))
  const newTitles = updatedTitles.filter(t => t.unlocked && !existingTitleIds.has(t.id))

  saveBadges(updatedBadges)
  saveTitles(updatedTitles)

  return {
    badges: updatedBadges,
    titles: updatedTitles,
    newBadges,
    newTitles
  }
}
