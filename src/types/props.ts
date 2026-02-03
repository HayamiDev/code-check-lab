import { Problem, EvaluationResult, Language, Level, HistoryEntry, Theme, MockData } from './index'

// SetupScreen Props
export interface SetupScreenProps {
  selectedLanguage: Language
  setSelectedLanguage: (language: Language) => void
  selectedLevel: Level
  setSelectedLevel: (level: Level) => void
  onGenerateProblem: () => void
  onShowHistory: () => void
  onShowMock: () => void
  isGenerating: boolean
}

// ProblemScreen Props
export interface ProblemScreenProps {
  problem: Problem
  selectedLanguage: Language
  userAnswer: string
  setUserAnswer: (answer: string) => void
  onEvaluate: () => void
  onBack: () => void
  isEvaluating: boolean
}

// ResultScreen Props
export interface ResultScreenProps {
  problem: Problem
  evaluationResult: EvaluationResult
  onNextProblem?: (() => void) | null
  onChangeSettings: () => void
  isGenerating: boolean
  isHistoryView?: boolean
}

// HistoryScreen Props
export interface HistoryScreenProps {
  onBack: () => void
  onSelectProblem: (entry: HistoryEntry) => void
  mockData?: { history: HistoryEntry[]; counts: Record<string, number> } | null
}

// MockScreen Props
export interface MockScreenProps {
  onBack: () => void
  onTestProblem: (problem: Problem, showLoading?: boolean) => void
  onTestResult: (problem: Problem, evaluation: EvaluationResult) => void
  onTestHistory: (data: MockData) => void
}

// ThemeSelector Props
export interface ThemeSelectorProps {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// LoadingOverlay Props
export interface LoadingOverlayProps {
  message?: string
}

// ConfirmDialog Props
export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

// CodeViewer Props
export interface CodeViewerProps {
  code: string
  language: Language
  className?: string
}
