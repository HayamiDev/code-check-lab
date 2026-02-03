import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import SectionHeader from './SectionHeader'

interface HistoryEntry {
  timestamp: string
  evaluationResult: {
    totalScore: number
  }
}

interface ScoreChartProps {
  data: HistoryEntry[]
}

export default function ScoreChart({ data }: ScoreChartProps) {
  if (data.length < 2) {
    return (
      <div className="h-40 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm" role="status" aria-live="polite">
        グラフ表示には2件以上のデータが必要です
      </div>
    )
  }

  // 古い順にソート（グラフは左から右へ時系列）
  const sortedData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  const scores = sortedData.map(d => d.evaluationResult.totalScore)
  const maxScore = 100
  const minScore = 0

  // 固定20スロット（最大保存件数）で横幅を分割
  const maxSlots = 20
  const width = 400
  const height = 120
  const paddingLeft = 25
  const paddingRight = 10
  const paddingY = 15
  const graphWidth = width - paddingLeft - paddingRight
  const graphHeight = height - paddingY * 2
  const slotWidth = graphWidth / (maxSlots - 1)

  const points = scores.map((score, i) => {
    const x = paddingLeft + i * slotWidth
    const y = paddingY + graphHeight - ((score - minScore) / (maxScore - minScore)) * graphHeight
    return `${x},${y}`
  }).join(' ')

  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 premium-card p-6"
      role="region"
      aria-label="スコア推移グラフ"
    >
      <div className="flex items-center justify-between mb-4">
        <SectionHeader icon={TrendingUp} variant="primary">
          スコア推移
        </SectionHeader>
        <span className="text-sm text-slate-500 dark:text-slate-400 font-bold" aria-label={`平均スコア ${avg}点`}>平均: {avg}点</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40 mb-3" preserveAspectRatio="xMinYMid meet" role="img" aria-label="スコア推移を示す折れ線グラフ">
        {/* Y軸グリッドライン */}
        {[0, 25, 50, 75, 100].map(val => {
          const y = paddingY + graphHeight - (val / 100) * graphHeight
          const isGuide = val === 50 || val === 70
          return (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="currentColor"
                className={
                  val === 50
                    ? "text-yellow-400 dark:text-yellow-400"
                    : val === 70
                    ? "text-green-400 dark:text-green-400"
                    : "text-slate-200 dark:text-slate-500"
                }
                strokeWidth={isGuide ? "1" : "0.5"}
                strokeDasharray={isGuide ? "4,2" : "none"}
                opacity={isGuide ? 0.7 : 1}
              />
              <text
                x={paddingLeft - 5}
                y={y + 3}
                textAnchor="end"
                fill="currentColor"
                className="text-slate-500 dark:text-slate-300"
                fontSize="11"
                fontWeight="600"
              >
                {val}
              </text>
            </g>
          )
        })}

        {/* 70点ライン */}
        <line
          x1={paddingLeft}
          y1={paddingY + graphHeight - (70 / 100) * graphHeight}
          x2={width - paddingRight}
          y2={paddingY + graphHeight - (70 / 100) * graphHeight}
          stroke="currentColor"
          className="text-green-400 dark:text-green-400"
          strokeWidth="1"
          strokeDasharray="4,2"
          opacity="0.7"
        />

        {/* スコアライン */}
        <polyline
          fill="none"
          stroke="currentColor"
          className="text-blue-500 dark:text-blue-400"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* データポイント */}
        {scores.map((score, i) => {
          const x = paddingLeft + i * slotWidth
          const y = paddingY + graphHeight - ((score - minScore) / (maxScore - minScore)) * graphHeight
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="currentColor"
              className="text-blue-600 dark:text-blue-300"
            />
          )
        })}
      </svg>
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-green-400"></div>
          <span className="text-slate-600 dark:text-slate-300 font-semibold">70点ライン（合格）</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-yellow-400"></div>
          <span className="text-slate-600 dark:text-slate-300 font-semibold">50点ライン</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-300"></div>
          <span className="text-slate-600 dark:text-slate-300 font-semibold">あなたのスコア</span>
        </div>
      </div>
    </motion.div>
  )
}
