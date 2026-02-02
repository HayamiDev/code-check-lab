// 問題の難易度レベル（1-10）
export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

// プログラミング言語
export type Language =
  | 'Kotlin'
  | 'Swift'
  | 'JavaScript'
  | 'TypeScript'
  | 'Python'
  | 'Java'
  | 'C#'
  | 'Go'
  | 'Rust'
  | 'PHP'
  | 'Ruby'
  | 'C++'

// 指摘項目
export interface Issue {
  summary: string
  detail: string
}

// コードレビュー問題
export interface Problem {
  language: Language
  prerequisite?: string
  code: string
  level: Level
  requiredIssuesCount: number
  requiredIssues: Issue[]
  optionalIssues?: Issue[]
}

// 個別指摘のスコア
export interface IssueScore {
  issueIndex: number
  score: number // 0-10
  feedback: string
}

// 評価結果
export interface EvaluationResult {
  scores: IssueScore[]
  totalScore: number // 0-100
  overallFeedback: string
}

// 履歴エントリ
export interface HistoryEntry {
  id: number | string
  language: Language
  problem: Problem
  userAnswer: string
  evaluationResult: EvaluationResult
  timestamp: string
}

// 履歴データ（言語ごと）
export type HistoryData = {
  [key in Language]?: HistoryEntry[]
}

// 言語別カウント
export type LanguageCounts = {
  [key in Language]?: number
}

// テーマ設定
export type Theme = 'light' | 'dark' | 'system'

// ステージ
export type Stage = 'setup' | 'problem' | 'result' | 'history' | 'mock' | 'mock-history'

// トースト通知タイプ
export type ToastType = 'error' | 'success' | 'info'

// トースト通知
export interface Toast {
  isOpen: boolean
  message: string
  type: ToastType
}

// ソート順
export type SortBy =
  | 'date-desc'
  | 'date-asc'
  | 'score-desc'
  | 'score-asc'
  | 'level-desc'
  | 'level-asc'

// スコアフィルター
export type ScoreFilter = 'all' | 'high' | 'mid' | 'low'
