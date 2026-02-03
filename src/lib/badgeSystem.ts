import { HistoryEntry } from '../types'
import { StreakData } from './streakStorage'

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
  icon: string // emoji
  condition: (data: BadgeCheckData) => boolean
  unlocked: boolean
  unlockedAt?: string
}

// バッジチェック用のデータ
export interface BadgeCheckData {
  streakData: StreakData
  allHistory: HistoryEntry[]
  languagesUsed: Set<string>
  maxScore: number
  perfectCount: number
  maxLevel: number
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
    icon: '🔥',
    condition: (data) => data.streakData.currentStreak >= 3
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: '7日連続で学習',
    category: 'streak',
    rarity: 'rare',
    icon: '🔥',
    condition: (data) => data.streakData.currentStreak >= 7
  },
  {
    id: 'streak_14',
    name: 'Two Week Hero',
    description: '14日連続で学習',
    category: 'streak',
    rarity: 'epic',
    icon: '🔥',
    condition: (data) => data.streakData.currentStreak >= 14
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: '30日連続で学習',
    category: 'streak',
    rarity: 'legendary',
    icon: '🔥',
    condition: (data) => data.streakData.currentStreak >= 30
  },
  {
    id: 'streak_100',
    name: 'Centurion',
    description: '100日連続で学習',
    category: 'streak',
    rarity: 'legendary',
    icon: '👑',
    condition: (data) => data.streakData.currentStreak >= 100
  },

  // スコアバッジ
  {
    id: 'score_70',
    name: 'Good Eye',
    description: '70点以上を獲得',
    category: 'score',
    rarity: 'common',
    icon: '⭐',
    condition: (data) => data.maxScore >= 70
  },
  {
    id: 'score_85',
    name: 'Sharp Reviewer',
    description: '85点以上を獲得',
    category: 'score',
    rarity: 'rare',
    icon: '⭐',
    condition: (data) => data.maxScore >= 85
  },
  {
    id: 'score_95',
    name: 'Eagle Eye',
    description: '95点以上を獲得',
    category: 'score',
    rarity: 'epic',
    icon: '⭐',
    condition: (data) => data.maxScore >= 95
  },

  // パーフェクトバッジ
  {
    id: 'perfect_1',
    name: 'First Perfect',
    description: '初めての満点',
    category: 'perfect',
    rarity: 'rare',
    icon: '💯',
    condition: (data) => data.perfectCount >= 1
  },
  {
    id: 'perfect_5',
    name: 'Perfectionist',
    description: '5回満点を達成',
    category: 'perfect',
    rarity: 'epic',
    icon: '💯',
    condition: (data) => data.perfectCount >= 5
  },
  {
    id: 'perfect_10',
    name: 'Flawless Legend',
    description: '10回満点を達成',
    category: 'perfect',
    rarity: 'legendary',
    icon: '💎',
    condition: (data) => data.perfectCount >= 10
  },

  // 言語バッジ
  {
    id: 'lang_3',
    name: 'Polyglot',
    description: '3つの言語を学習',
    category: 'language',
    rarity: 'common',
    icon: '🌐',
    condition: (data) => data.languagesUsed.size >= 3
  },
  {
    id: 'lang_5',
    name: 'Language Master',
    description: '5つの言語を学習',
    category: 'language',
    rarity: 'rare',
    icon: '🌐',
    condition: (data) => data.languagesUsed.size >= 5
  },
  {
    id: 'lang_8',
    name: 'Multilingual Expert',
    description: '8つの言語を学習',
    category: 'language',
    rarity: 'epic',
    icon: '🌏',
    condition: (data) => data.languagesUsed.size >= 8
  },
  {
    id: 'lang_12',
    name: 'Universal Developer',
    description: '全12言語を制覇',
    category: 'language',
    rarity: 'legendary',
    icon: '🌍',
    condition: (data) => data.languagesUsed.size >= 12
  },

  // セッション数バッジ
  {
    id: 'session_10',
    name: 'Beginner',
    description: '10回のセッションを完了',
    category: 'session',
    rarity: 'common',
    icon: '📚',
    condition: (data) => data.streakData.totalSessions >= 10
  },
  {
    id: 'session_50',
    name: 'Dedicated Learner',
    description: '50回のセッションを完了',
    category: 'session',
    rarity: 'rare',
    icon: '📚',
    condition: (data) => data.streakData.totalSessions >= 50
  },
  {
    id: 'session_100',
    name: 'Veteran Reviewer',
    description: '100回のセッションを完了',
    category: 'session',
    rarity: 'epic',
    icon: '📖',
    condition: (data) => data.streakData.totalSessions >= 100
  },
  {
    id: 'session_200',
    name: 'Review Master',
    description: '200回のセッションを完了',
    category: 'session',
    rarity: 'legendary',
    icon: '🏆',
    condition: (data) => data.streakData.totalSessions >= 200
  },

  // レベルバッジ
  {
    id: 'level_5',
    name: 'Intermediate',
    description: 'レベル5以上をクリア',
    category: 'level',
    rarity: 'common',
    icon: '🎯',
    condition: (data) => data.maxLevel >= 5
  },
  {
    id: 'level_7',
    name: 'Advanced',
    description: 'レベル7以上をクリア',
    category: 'level',
    rarity: 'rare',
    icon: '🎯',
    condition: (data) => data.maxLevel >= 7
  },
  {
    id: 'level_9',
    name: 'Expert',
    description: 'レベル9以上をクリア',
    category: 'level',
    rarity: 'epic',
    icon: '🎯',
    condition: (data) => data.maxLevel >= 9
  },
  {
    id: 'level_10',
    name: 'Elite Reviewer',
    description: '最高難易度レベル10をクリア',
    category: 'level',
    rarity: 'legendary',
    icon: '💫',
    condition: (data) => data.maxLevel >= 10
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
    id: 'title_dedicated',
    name: '熱心な学習者',
    description: '1週間連続で学習',
    rarity: 'rare',
    requiredBadges: ['streak_7']
  },
  {
    id: 'title_perfectionist',
    name: '完璧主義者',
    description: '初めての満点を達成',
    rarity: 'rare',
    requiredBadges: ['perfect_1']
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
    description: '30日連続学習 & 100回セッション & 5言語制覇',
    rarity: 'legendary',
    requiredBadges: ['streak_30', 'session_100', 'lang_5']
  },
  {
    id: 'title_legend',
    name: '伝説のレビュアー',
    description: '100日連続 & 200回セッション & 全言語制覇',
    rarity: 'legendary',
    requiredBadges: ['streak_100', 'session_200', 'lang_12']
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
    legendary: 'shadow-xl shadow-amber-500/40 animate-pulse'
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

  allHistory.forEach(entry => {
    languagesUsed.add(entry.language)
    maxScore = Math.max(maxScore, entry.evaluationResult.totalScore)
    maxLevel = Math.max(maxLevel, entry.problem.level)
    if (entry.evaluationResult.totalScore === 100) {
      perfectCount++
    }
  })

  return {
    streakData,
    allHistory,
    languagesUsed,
    maxScore,
    perfectCount,
    maxLevel
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
        ...existing,
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
        ...existing,
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
  return JSON.parse(stored)
}

/**
 * バッジをLocalStorageに保存
 */
export function saveBadges(badges: Badge[]): void {
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
