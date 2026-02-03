import { HistoryData, HistoryEntry, EvaluationResult, Problem, Language } from '../types'

const STORAGE_KEY = 'problem-history'
const COUNT_KEY = 'problem-count'
const MAX_PROBLEMS_PER_LANGUAGE = 20

export function getHistory(): HistoryData {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

export function getTotalCounts(): Record<string, number> {
  try {
    const data = localStorage.getItem(COUNT_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

export function getTotalCountByLanguage(language: string): number {
  const counts = getTotalCounts()
  return counts[language] || 0
}

export function saveToHistory(language: Language, problem: Problem, userAnswer: string, evaluationResult: EvaluationResult) {
  const history = getHistory()

  if (!history[language]) {
    history[language] = []
  }

  const entry: HistoryEntry = {
    id: Date.now(),
    language,
    problem,
    userAnswer,
    evaluationResult,
    timestamp: new Date().toISOString()
  }

  // 先頭に追加
  history[language]!.unshift(entry)

  // 20問を超えたら古いものを削除
  if (history[language]!.length > MAX_PROBLEMS_PER_LANGUAGE) {
    history[language] = history[language]!.slice(0, MAX_PROBLEMS_PER_LANGUAGE)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))

  // 通算問題数をインクリメント
  incrementTotalCount(language)
}

function incrementTotalCount(language: string) {
  const counts = getTotalCounts()
  counts[language] = (counts[language] || 0) + 1
  localStorage.setItem(COUNT_KEY, JSON.stringify(counts))
}

export function getHistoryByLanguage(language: Language): HistoryEntry[] {
  const history = getHistory()
  return history[language] || []
}

export function deleteFromHistory(language: string, id: number | string) {
  const history = getHistory()

  // language can be 'all' or specific. But here it's likely specific key. 
  // history is typed as HistoryData, keys are Language.
  // But usage in HistoryScreen passes `language` string.
  // We need to cast or access carefully.
  const langKey = language as Language

  if (history[langKey]) {
    history[langKey] = history[langKey]!.filter(entry => entry.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }
}
