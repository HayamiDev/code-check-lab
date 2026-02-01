const STORAGE_KEY = 'problem-history'
const COUNT_KEY = 'problem-count'
const MAX_PROBLEMS_PER_LANGUAGE = 20

export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

export function getTotalCounts() {
  try {
    const data = localStorage.getItem(COUNT_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

export function getTotalCountByLanguage(language) {
  const counts = getTotalCounts()
  return counts[language] || 0
}

export function saveToHistory(language, problem, userAnswer, evaluationResult) {
  const history = getHistory()

  if (!history[language]) {
    history[language] = []
  }

  const entry = {
    id: Date.now(),
    problem,
    userAnswer,
    evaluationResult,
    timestamp: new Date().toISOString()
  }

  // 先頭に追加
  history[language].unshift(entry)

  // 20問を超えたら古いものを削除
  if (history[language].length > MAX_PROBLEMS_PER_LANGUAGE) {
    history[language] = history[language].slice(0, MAX_PROBLEMS_PER_LANGUAGE)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))

  // 通算問題数をインクリメント
  incrementTotalCount(language)
}

function incrementTotalCount(language) {
  const counts = getTotalCounts()
  counts[language] = (counts[language] || 0) + 1
  localStorage.setItem(COUNT_KEY, JSON.stringify(counts))
}

export function getHistoryByLanguage(language) {
  const history = getHistory()
  return history[language] || []
}

export function deleteFromHistory(language, id) {
  const history = getHistory()

  if (history[language]) {
    history[language] = history[language].filter(entry => entry.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }
}
