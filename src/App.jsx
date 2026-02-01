import { useState } from 'react'
import { SetupScreen, ProblemScreen, ResultScreen, LoadingOverlay } from './components'
import { generateProblem, evaluateAnswer } from './api/claude'

export default function App() {
  const [stage, setStage] = useState('setup') // 'setup', 'problem', 'result'
  const [selectedLanguage, setSelectedLanguage] = useState('Kotlin')
  const [selectedLevel, setSelectedLevel] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [problem, setProblem] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState(null)

  const handleGenerateProblem = async () => {
    setIsGenerating(true)
    try {
      const problemData = await generateProblem(selectedLanguage, selectedLevel)
      setProblem(problemData)
      setStage('problem')
      setUserAnswer('')
      setEvaluationResult(null)
    } catch (error) {
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

    setIsEvaluating(true)
    try {
      const result = await evaluateAnswer(problem, userAnswer)
      setEvaluationResult(result)
      setStage('result')
    } catch (error) {
      alert('評価に失敗しました: ' + error.message)
    } finally {
      setIsEvaluating(false)
    }
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
          isGenerating={isGenerating}
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
          onNextProblem={handleGenerateProblem}
          onChangeSettings={() => setStage('setup')}
          isGenerating={isGenerating}
        />
      )
    }

    return null
  }

  return (
    <>
      {renderScreen()}
      {isGenerating && <LoadingOverlay message="問題を生成中..." />}
      {isEvaluating && <LoadingOverlay message="回答を評価中..." />}
    </>
  )
}
