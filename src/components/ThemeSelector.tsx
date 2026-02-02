export default function ThemeSelector({ theme, setTheme }) {
  return (
    <div className="fixed top-8 right-8 z-[60] flex items-center gap-4">
      <div className="premium-card px-4 py-2 flex items-center gap-4 shadow-xl ring-1 ring-white/10 group hover:scale-105 transition-transform duration-300">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-purple-500' : 'bg-blue-500'}`}
            style={{
              boxShadow: theme === 'dark'
                ? '0 0 8px rgba(168, 85, 247, 0.5)'
                : '0 0 8px rgba(59, 130, 246, 0.5)'
            }}
          ></div>
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] hidden md:inline">
            System Appearance
          </span>
        </div>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-transparent text-xs font-black text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer uppercase tracking-tighter"
        >
          <option value="system" className="bg-white dark:bg-slate-900">Auto</option>
          <option value="light" className="bg-white dark:bg-slate-900">Light</option>
          <option value="dark" className="bg-white dark:bg-slate-900">Dark</option>
        </select>
      </div>
    </div>
  )
}
