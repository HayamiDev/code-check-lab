/**
 * スコアに基づいて色分けクラスを返す
 * @param {number} score - スコア（0-100）
 * @returns {string} Tailwind CSSクラス
 */
export function getScoreColorClass(score: number) {
  if (score >= 70) {
    return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
  }
  if (score >= 50) {
    return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
  }
  return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
}

/**
 * 個別指摘用のスコア色分け（10点満点）
 * @param {number} score - スコア（0-10）
 * @returns {string} Tailwind CSSクラス
 */
export function getIssueScoreColorClass(score: number) {
  if (score >= 8) {
    return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
  }
  if (score >= 5) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
  }
  return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
}

/**
 * スコアに基づいてアイコンを返す（色覚異常対応）
 * @param {number} score - スコア（0-100）
 * @returns {string} アイコン文字
 */
export function getScoreIcon(score: number) {
  if (score >= 70) return '✓'
  if (score >= 50) return '△'
  return '×'
}

/**
 * 個別指摘用のスコアアイコン（10点満点）
 * @param {number} score - スコア（0-10）
 * @returns {string} アイコン文字
 */
export function getIssueScoreIcon(score: number) {
  if (score >= 8) return '✓'
  if (score >= 5) return '△'
  return '×'
}
