import { useState } from 'react'
import { motion } from 'framer-motion'
import { DayActivity, getActivityLevel, getActivityColorClass } from '../lib/streakStorage'

interface ActivityHeatmapProps {
  data: DayActivity[]
}

export default function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // データを週ごとにグループ化（日曜日始まり）
  const weeks: DayActivity[][] = []
  let currentWeek: DayActivity[] = []

  // 最初の週の曜日調整
  const firstDate = new Date(data[0].date)
  const firstDayOfWeek = firstDate.getDay()

  // 最初の週の空白を追加
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({
      date: '',
      count: -1,
      sessions: []
    })
  }

  data.forEach((day, index) => {
    currentWeek.push(day)
    const date = new Date(day.date)

    if (date.getDay() === 6 || index === data.length - 1) {
      // 土曜日または最終日で週を区切る
      weeks.push([...currentWeek])
      currentWeek = []
    }
  })

  // 月ラベルの生成
  const months = [
    { name: 'Jan', index: 0 },
    { name: 'Feb', index: 0 },
    { name: 'Mar', index: 0 },
    { name: 'Apr', index: 0 },
    { name: 'May', index: 0 },
    { name: 'Jun', index: 0 },
    { name: 'Jul', index: 0 },
    { name: 'Aug', index: 0 },
    { name: 'Sep', index: 0 },
    { name: 'Oct', index: 0 },
    { name: 'Nov', index: 0 },
    { name: 'Dec', index: 0 }
  ]

  const monthLabels: Array<{ name: string; weekIndex: number }> = []
  let lastMonth = -1

  weeks.forEach((week, weekIndex) => {
    const firstValidDay = week.find(d => d.date !== '')
    if (firstValidDay) {
      const date = new Date(firstValidDay.date)
      const month = date.getMonth()
      if (month !== lastMonth) {
        monthLabels.push({ name: months[month].name, weekIndex })
        lastMonth = month
      }
    }
  })

  const handleMouseEnter = (day: DayActivity, event: React.MouseEvent) => {
    if (day.date === '') return
    setHoveredDay(day)
    setMousePos({ x: event.clientX, y: event.clientY })
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePos({ x: event.clientX, y: event.clientY })
  }

  const formatTooltipDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  return (
    <div className="relative">
      {/* Month Labels */}
      <div className="flex mb-2 ml-6">
        {monthLabels.map((label, index) => (
          <div
            key={index}
            className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
            style={{
              position: 'absolute',
              left: `${24 + label.weekIndex * 14}px`
            }}
          >
            {label.name}
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="flex gap-[3px] overflow-x-auto pb-2 custom-scrollbar">
        {/* Day Labels */}
        <div className="flex flex-col gap-[3px] mr-2">
          <div className="h-[10px]" /> {/* 日曜 - 空白 */}
          <div className="h-[10px] flex items-center">
            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Mon</span>
          </div>
          <div className="h-[10px]" /> {/* 火曜 - 空白 */}
          <div className="h-[10px] flex items-center">
            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Wed</span>
          </div>
          <div className="h-[10px]" /> {/* 木曜 - 空白 */}
          <div className="h-[10px] flex items-center">
            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Fri</span>
          </div>
          <div className="h-[10px]" /> {/* 土曜 - 空白 */}
        </div>

        {/* Activity Squares */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[3px]">
            {week.map((day, dayIndex) => {
              if (day.date === '') {
                return <div key={dayIndex} className="w-[10px] h-[10px]" />
              }

              const level = getActivityLevel(day.count)
              const colorClass = getActivityColorClass(level)

              return (
                <motion.div
                  key={dayIndex}
                  className={`w-[10px] h-[10px] rounded-sm ${colorClass} cursor-pointer transition-all hover:ring-2 hover:ring-blue-500 hover:ring-offset-1 hover:scale-125`}
                  onMouseEnter={(e) => handleMouseEnter(day, e)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoveredDay(null)}
                  whileHover={{ scale: 1.3 }}
                  aria-label={`${formatTooltipDate(day.date)}: ${day.count} sessions`}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div
            key={level}
            className={`w-[10px] h-[10px] rounded-sm ${getActivityColorClass(level)}`}
            aria-hidden="true"
          />
        ))}
        <span>More</span>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-[100] pointer-events-none"
          style={{
            left: `${mousePos.x + 10}px`,
            top: `${mousePos.y - 60}px`
          }}
        >
          <div className="bg-slate-900 dark:bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl text-xs border border-slate-700">
            <div className="font-bold mb-1">{formatTooltipDate(hoveredDay.date)}</div>
            <div className="text-slate-300">
              {hoveredDay.count === 0 ? 'No sessions' : `${hoveredDay.count} session${hoveredDay.count > 1 ? 's' : ''}`}
            </div>
            {hoveredDay.sessions.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-700 space-y-1">
                {hoveredDay.sessions.slice(0, 3).map((session, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-[10px]">
                    <span className="text-blue-400">{session.language}</span>
                    <span className="text-slate-400">{session.score}pts</span>
                  </div>
                ))}
                {hoveredDay.sessions.length > 3 && (
                  <div className="text-[10px] text-slate-500">+{hoveredDay.sessions.length - 3} more</div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
