export default function ThemeSelector({ theme, setTheme }) {
  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
      <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
        表示テーマ
      </span>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        <option value="system">端末設定</option>
        <option value="light">ライト</option>
        <option value="dark">ダーク</option>
      </select>
    </div>
  )
}
