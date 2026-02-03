import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SetupScreen from './components/SetupScreen'
import ProblemScreen from './components/ProblemScreen'
import ResultScreen from './components/ResultScreen'
import HistoryScreen from './components/HistoryScreen'
import ThemeSelector from './components/ThemeSelector'
import LoadingOverlay from './components/LoadingOverlay'
import MockScreen from './components/MockScreen'
import Toast from './components/Toast'
import AchievementScreen from './components/AchievementScreen'
import TrophyNotification from './components/TrophyNotification'
import { generateProblem, evaluateAnswer } from './api/claude'
import { saveToHistory, getAllHistoryEntries } from './lib/historyStorage'
import { updateBadgesAndTitles, Badge, Title } from './lib/badgeSystem'
import { MOCK_EVALUATION } from './constants/mockData'
import { useTheme } from './hooks/useTheme'
import { useToast } from './hooks/useToast'
import { Problem, EvaluationResult, Language, Level, Stage, HistoryEntry, MockData } from './types'

declare global {
  interface Window {
    gtag: (command: string, action: string, params?: unknown) => void
  }
}

export default function App() {
  const [theme, setTheme] = useTheme()
  const { toast, showToast, hideToast } = useToast()
  const [stage, setStage] = useState<Stage>('setup')
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('Python')
  const [selectedLevel, setSelectedLevel] = useState<Level>(5)
  const [problem, setProblem] = useState<Problem | null>(null)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null)
  const [isHistoryView, setIsHistoryView] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false)
  const [mockHistoryData, setMockHistoryData] = useState<MockData | null>(null)
  const [isMockMode, setIsMockMode] = useState<boolean>(false)
  const [trophyQueue, setTrophyQueue] = useState<Array<{ badge?: Badge; title?: Title }>>([])
  const [currentTrophy, setCurrentTrophy] = useState<{ badge?: Badge; title?: Title } | null>(null)

  // ブラウザの戻る/進むボタンでステージ変更に対応
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.stage) {
        setStage(event.state.stage)
      }
    }

    window.addEventListener('popstate', handlePopState)

    // 初回マウント時に現在のURLからステージを復元
    const path = window.location.pathname
    const stageFromPath = path.replace(/^\/code-check-lab\/?/, '') || 'setup'
    if (stageFromPath) {
      setStage(stageFromPath as Stage)
    }

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // ステージ変更時にブラウザ履歴を更新
  useEffect(() => {
    const baseUrl = '/code-check-lab'
    const url = stage === 'setup' ? baseUrl : `${baseUrl}/${stage}`

    // 現在のURLと異なる場合のみ履歴を追加
    if (window.location.pathname !== url) {
      window.history.pushState({ stage }, '', url)
    }
  }, [stage])

  // トロフィーキューの処理
  useEffect(() => {
    if (trophyQueue.length > 0 && !currentTrophy) {
      setCurrentTrophy(trophyQueue[0])
      setTrophyQueue(prev => prev.slice(1))
    }
  }, [trophyQueue, currentTrophy])

  // 仮想ページビューの計測
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: `/${stage}`,
        page_title: `Stage: ${stage}`,
        send_to: '%VITE_GA_MEASUREMENT_ID%'
      });
    }
  }, [stage]);

  const onGenerateProblem = async () => {
    setIsGenerating(true)
    setIsMockMode(false)
    setIsHistoryView(false)
    try {
      const newProblem = await generateProblem(selectedLanguage, selectedLevel)
      setProblem(newProblem)
      setStage('problem')
      setUserAnswer('')
      setEvaluationResult(null)
    } catch (error) {
      console.error('Failed to generate problem:', error)
      showToast('問題の生成に失敗しました。時間をおいて再度お試しください。')
    } finally {
      setIsGenerating(false)
    }
  }

  const onEvaluate = async () => {
    if (!problem) return
    setIsEvaluating(true)
    try {
      if (isMockMode) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setEvaluationResult(MOCK_EVALUATION)
      } else {
        const result = await evaluateAnswer(problem, userAnswer)
        setEvaluationResult(result)
        saveToHistory(problem.language || selectedLanguage, problem, userAnswer, result)

        // バッジと称号をチェック
        const allHistory = getAllHistoryEntries()
        const dummyStreakData = {
          currentStreak: 0,
          longestStreak: 0,
          lastSessionDate: null,
          totalSessions: allHistory.length
        }
        const { newBadges, newTitles } = updateBadgesAndTitles(dummyStreakData, allHistory)

        // 新規獲得したバッジと称号をキューに追加
        const newTrophies: Array<{ badge?: Badge; title?: Title }> = [
          ...newBadges.map(badge => ({ badge })),
          ...newTitles.map(title => ({ title }))
        ]
        if (newTrophies.length > 0) {
          setTrophyQueue(prev => [...prev, ...newTrophies])
        }
      }
      setStage('result')
    } catch (error) {
      console.error('Failed to evaluate answer:', error)
      showToast('評価に失敗しました。ネットワークを確認してください。')
    } finally {
      setIsEvaluating(false)
    }
  }

  const handleSelectHistoryProblem = (entry: HistoryEntry) => {
    setProblem({ ...entry.problem, language: entry.language })
    setUserAnswer(entry.userAnswer)
    setEvaluationResult(entry.evaluationResult)
    setStage('result')
    setIsMockMode(false)
    setIsHistoryView(true)
  }

  const handleTestProblem = async (mockProblem: Problem, showLoading = false) => {
    if (showLoading) {
      setIsGenerating(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsGenerating(false)
    }
    setProblem(mockProblem)
    setStage('problem')
    setUserAnswer('')
    setEvaluationResult(null)
    setIsMockMode(true)
    setIsHistoryView(false)
  }

  const handleTestResult = (mockProblem: Problem, mockEvaluation: EvaluationResult) => {
    setProblem(mockProblem)
    setEvaluationResult(mockEvaluation)
    setStage('result')
    setIsMockMode(true)
    setIsHistoryView(false)
  }

  const handleTestHistory = (mockHistory: MockData) => {
    setMockHistoryData(mockHistory)
    setStage('mock-history')
  }

  const handleTestBadge = (badge: Badge) => {
    setTrophyQueue(prev => [...prev, { badge }])
  }

  const handleTestTitle = (title: Title) => {
    setTrophyQueue(prev => [...prev, { title }])
  }

  const handleTestAchievements = () => {
    setStage('mock-achievement')
  }

  const renderScreen = () => {
    switch (stage) {
      case 'setup':
        return (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <SetupScreen
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={(lang) => setSelectedLanguage(lang as Language)}
              selectedLevel={selectedLevel}
              setSelectedLevel={(level) => setSelectedLevel(level as Level)}
              onGenerateProblem={onGenerateProblem}
              onShowHistory={() => setStage('history')}
              onShowMock={() => setStage('mock')}
              onShowAchievements={() => setStage('achievement')}
              isGenerating={isGenerating}
            />
          </motion.div>
        )
      case 'mock':
        return (
          <motion.div
            key="mock"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MockScreen
              onBack={() => setStage('setup')}
              onTestProblem={handleTestProblem}
              onTestResult={handleTestResult}
              onTestHistory={handleTestHistory}
              onTestBadge={handleTestBadge}
              onTestTitle={handleTestTitle}
              onTestAchievements={handleTestAchievements}
            />
          </motion.div>
        )
      case 'history':
        return (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <HistoryScreen
              onBack={() => setStage('setup')}
              onSelectProblem={handleSelectHistoryProblem}
            />
          </motion.div>
        )
      case 'mock-history':
        return (
          <motion.div
            key="mock-history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HistoryScreen
              onBack={() => setStage('mock')}
              onSelectProblem={handleSelectHistoryProblem}
              mockData={mockHistoryData}
            />
          </motion.div>
        )
      case 'problem':
        return (
          <motion.div
            key="problem"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            <ProblemScreen
              problem={problem!}
              selectedLanguage={selectedLanguage}
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              onEvaluate={onEvaluate}
              onBack={() => setStage('setup')}
              isEvaluating={isEvaluating}
            />
          </motion.div>
        )
      case 'result':
        return (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <ResultScreen
              problem={problem!}
              evaluationResult={evaluationResult!}
              onNextProblem={isHistoryView ? null : onGenerateProblem}
              onChangeSettings={() => {
                setStage('setup')
                setIsHistoryView(false)
              }}
              isGenerating={isGenerating}
              isHistoryView={isHistoryView}
            />
          </motion.div>
        )
      case 'achievement':
        return (
          <motion.div
            key="achievement"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AchievementScreen onBack={() => setStage('setup')} />
          </motion.div>
        )
      case 'mock-achievement':
        return (
          <motion.div
            key="mock-achievement"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AchievementScreen onBack={() => setStage('mock')} mockMode={true} />
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <ThemeSelector theme={theme} setTheme={setTheme} />
      <Toast {...toast} onClose={hideToast} />
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
      {isGenerating && <LoadingOverlay message="問題を生成中..." />}
      {isEvaluating && <LoadingOverlay message="回答を評価中..." />}
      {currentTrophy && (
        <TrophyNotification
          badge={currentTrophy.badge}
          title={currentTrophy.title}
          onClose={() => setCurrentTrophy(null)}
        />
      )}
    </div>
  )
}
