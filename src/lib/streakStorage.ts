import { HistoryEntry } from '../types'

const STREAK_KEY = 'code-review-streak'

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastSessionDate: string | null
  totalSessions: number
}

export interface DayActivity {
  date: string // YYYY-MM-DD
  count: number
  sessions: Array<{
    language: string
    score: number
    timestamp: string
  }>
}

/**
 * 日付を YYYY-MM-DD 形式に変換
 */
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 2つの日付が連続しているかチェック
 */
function isConsecutiveDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

/**
 * ストリークデータを取得
 */
export function getStreakData(): StreakData {
  const stored = localStorage.getItem(STREAK_KEY)
  if (!stored) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: null,
      totalSessions: 0
    }
  }
  return JSON.parse(stored)
}

/**
 * ストリークデータを保存
 */
export function saveStreakData(data: StreakData): void {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data))
}

/**
 * 新しいセッション完了時にストリークを更新
 */
export function updateStreak(): StreakData {
  const today = formatDate(new Date())
  const streakData = getStreakData()

  // 今日既にセッションがある場合は総セッション数だけ増やす
  if (streakData.lastSessionDate === today) {
    streakData.totalSessions++
    saveStreakData(streakData)
    return streakData
  }

  // 新しい日のセッション
  streakData.totalSessions++

  if (!streakData.lastSessionDate) {
    // 初回セッション
    streakData.currentStreak = 1
    streakData.longestStreak = 1
    streakData.lastSessionDate = today
  } else if (isConsecutiveDay(streakData.lastSessionDate, today)) {
    // 連続日
    streakData.currentStreak++
    streakData.longestStreak = Math.max(streakData.longestStreak, streakData.currentStreak)
    streakData.lastSessionDate = today
  } else {
    // 昨日の翌日でない場合、ストリークがリセットされるかチェック
    const lastDate = new Date(streakData.lastSessionDate)
    const currentDate = new Date(today)
    const diffTime = currentDate.getTime() - lastDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      // 同じ日（タイムゾーンの問題などで発生する可能性）
      // 何もしない
    } else if (diffDays > 1) {
      // ストリーク途切れた
      streakData.currentStreak = 1
      streakData.lastSessionDate = today
    } else {
      // 連続日
      streakData.currentStreak++
      streakData.longestStreak = Math.max(streakData.longestStreak, streakData.currentStreak)
      streakData.lastSessionDate = today
    }
  }

  saveStreakData(streakData)
  return streakData
}

/**
 * 履歴データから過去365日のヒートマップデータを生成
 */
export function generateHeatmapData(allHistory: HistoryEntry[]): DayActivity[] {
  const activityMap = new Map<string, DayActivity>()

  // 過去365日分の日付を初期化
  const today = new Date()
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = formatDate(date)
    activityMap.set(dateStr, {
      date: dateStr,
      count: 0,
      sessions: []
    })
  }

  // 履歴データから活動を集計
  allHistory.forEach(entry => {
    const date = formatDate(new Date(entry.timestamp))
    const activity = activityMap.get(date)
    if (activity) {
      activity.count++
      activity.sessions.push({
        language: entry.language,
        score: entry.evaluationResult.totalScore,
        timestamp: entry.timestamp
      })
    }
  })

  return Array.from(activityMap.values())
}

/**
 * アクティビティ数に応じた色のレベルを返す（0-4）
 */
export function getActivityLevel(count: number): number {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count <= 4) return 3
  return 4
}

/**
 * アクティビティレベルに応じた色クラスを返す
 */
export function getActivityColorClass(level: number): string {
  const colors = [
    'bg-slate-100 dark:bg-slate-800',
    'bg-green-200 dark:bg-green-900',
    'bg-green-400 dark:bg-green-700',
    'bg-green-600 dark:bg-green-500',
    'bg-green-800 dark:bg-green-400'
  ]
  return colors[level] || colors[0]
}

/**
 * 履歴データからストリーク情報を計算（モックデータ用）
 */
export function calculateStreakFromHistory(allHistory: HistoryEntry[]): StreakData {
  if (allHistory.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: null,
      totalSessions: 0
    }
  }

  // 日付でソート（新しい順）
  const sorted = [...allHistory].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  // 日付ごとにグループ化
  const dateSet = new Set<string>()
  sorted.forEach(entry => {
    const date = formatDate(new Date(entry.timestamp))
    dateSet.add(date)
  })

  const uniqueDates = Array.from(dateSet).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  )

  if (uniqueDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: null,
      totalSessions: allHistory.length
    }
  }

  // 現在のストリークを計算
  let currentStreak = 1
  let longestStreak = 1
  let tempStreak = 1

  for (let i = 1; i < uniqueDates.length; i++) {
    if (isConsecutiveDay(uniqueDates[i], uniqueDates[i - 1])) {
      tempStreak++
      if (i === tempStreak - 1) {
        currentStreak = tempStreak
      }
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak)
  longestStreak = Math.max(longestStreak, currentStreak)

  return {
    currentStreak,
    longestStreak,
    lastSessionDate: uniqueDates[0],
    totalSessions: allHistory.length
  }
}
