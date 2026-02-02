import { useState, useEffect } from 'react'
import { SetupScreen, ProblemScreen, ResultScreen, LoadingOverlay, ThemeSelector, HistoryScreen, MockScreen } from './components'
import { generateProblem, evaluateAnswer } from './api/claude'
import { MOCK_EVALUATION } from './constants/mockData'
import { useTheme } from './hooks/useTheme'
import { saveToHistory } from './lib/historyStorage'

export default function App() {
  const [theme, setTheme] = useTheme()
  const [stage, setStage] = useState('setup')

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
  const [selectedLanguage, setSelectedLanguage] = useState('Kotlin')
  const [selectedLevel, setSelectedLevel] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [problem, setProblem] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [isMockMode, setIsMockMode] = useState(false)
  const [isHistoryView, setIsHistoryView] = useState(false)
  const [mockHistoryData, setMockHistoryData] = useState(null)

  const handleGenerateProblem = async () => {
    setIsGenerating(true)
    setIsMockMode(false)
    setIsHistoryView(false)

    // カスタムイベントの計測: 問題生成
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_problem', {
        language: selectedLanguage,
        level: selectedLevel
      });
    }

    try {
      const problemData = await generateProblem(selectedLanguage, selectedLevel)
      setProblem(problemData)
      setStage('problem')
      setUserAnswer('')
      setEvaluationResult(null)
    } catch (error) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'exception', {
          'description': `Generate Problem Error: ${error.message}`,
          'fatal': false
        });
      }
      alert('問題の生成に失敗しました: ' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim()) {
      alert('回答を入力してください')
      return
    }

    if (isMockMode) {
      setIsEvaluating(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setEvaluationResult(MOCK_EVALUATION)
      setStage('result')
      setIsEvaluating(false)
      return
    }

    setIsEvaluating(true)
    try {
      const result = await evaluateAnswer(problem, userAnswer)
      setEvaluationResult(result)
      setStage('result')

      // 履歴に保存（モックモード以外）
      const language = problem.language || selectedLanguage
      saveToHistory(language, problem, userAnswer, result)
    } catch (error) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'exception', {
          'description': `Evaluate Answer Error: ${error.message}`,
          'fatal': false
        });
      }
      alert('評価に失敗しました: ' + error.message)
    } finally {
      setIsEvaluating(false)
    }
  }

  const handleSelectHistoryProblem = (entry) => {
    setProblem({ ...entry.problem, language: entry.language })
    setUserAnswer(entry.userAnswer)
    setEvaluationResult(entry.evaluationResult)
    setStage('result')
    setIsMockMode(false)
    setIsHistoryView(true)
  }

  // モック用ハンドラ
  const handleTestProblem = async (mockProblem, showLoading = false) => {
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

  const handleTestResult = (mockProblem, mockEvaluation) => {
    setProblem(mockProblem)
    setEvaluationResult(mockEvaluation)
    setStage('result')
    setIsMockMode(true)
    setIsHistoryView(false)
  }

  const handleTestHistory = (mockHistory) => {
    setMockHistoryData(mockHistory)
    setStage('mock-history')
  }

  const renderScreen = () => {
    if (stage === 'setup') {
      return (
        <SetupScreen
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          onGenerateProblem={handleGenerateProblem}
          onShowHistory={() => setStage('history')}
          onShowMock={() => setStage('mock')}
          isGenerating={isGenerating}
        />
      )
    }

    if (stage === 'mock') {
      return (
        <MockScreen
          onBack={() => setStage('setup')}
          onTestProblem={handleTestProblem}
          onTestResult={handleTestResult}
          onTestHistory={handleTestHistory}
        />
      )
    }

    if (stage === 'history') {
      return (
        <HistoryScreen
          onBack={() => setStage('setup')}
          onSelectProblem={handleSelectHistoryProblem}
        />
      )
    }

    if (stage === 'mock-history') {
      return (
        <HistoryScreen
          onBack={() => setStage('mock')}
          onSelectProblem={handleSelectHistoryProblem}
          mockData={mockHistoryData}
        />
      )
    }

    if (stage === 'problem') {
      return (
        <ProblemScreen
          problem={problem}
          selectedLanguage={selectedLanguage}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          onEvaluate={handleEvaluateAnswer}
          onBack={() => setStage('setup')}
          isEvaluating={isEvaluating}
        />
      )
    }

    if (stage === 'result') {
      return (
        <ResultScreen
          problem={problem}
          evaluationResult={evaluationResult}
          onNextProblem={isHistoryView ? null : handleGenerateProblem}
          onChangeSettings={() => setStage('setup')}
          isGenerating={isGenerating}
          isHistoryView={isHistoryView}
        />
      )
    }

    return null
  }

  return (
    <>
      <ThemeSelector theme={theme} setTheme={setTheme} />
      {renderScreen()}
      {isGenerating && <LoadingOverlay message="問題を生成中..." />}
      {isEvaluating && <LoadingOverlay message="回答を評価中..." />}
    </>
  )
}
