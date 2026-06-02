import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Feed from './components/Feed'
import RightPanel from './components/RightPanel'

function IframeView({ system, onClose, collapsed }) {
  const [blocked, setBlocked] = useState(false)
  const ml = collapsed ? 'md:ml-[72px]' : 'md:ml-64'

  return (
    <div className="flex-1 md:ml-[72px] flex flex-col transition-all duration-300" style={{ height: '100vh' }}>
      <div className="flex items-center gap-3 px-4 h-11 bg-white border-b border-outline-variant flex-shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant text-sm hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Назад
        </button>
        <span className="text-sm font-medium text-on-surface flex-1">{system.label}</span>
        <a href={system.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
          Открыть в браузере
        </a>
      </div>
      {blocked ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined" style={{ fontSize: 48 }}>lock</span>
          <div className="text-sm font-medium text-on-surface">{system.label} не разрешает встраивание</div>
          <div className="text-sm">Откройте систему в отдельной вкладке</div>
          <a
            href={system.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm hover:opacity-90 transition-opacity"
          >
            Открыть {system.label}
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
          </a>
        </div>
      ) : (
        <iframe
          src={system.url}
          className="flex-1 w-full border-none"
          title={system.label}
          onError={() => setBlocked(true)}
        />
      )}
    </div>
  )
}

export default function App() {
  const [activeSystem, setActiveSystem] = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const [tasksDrawerOpen, setTasksDrawerOpen] = useState(false)

  const ml = collapsed ? 'md:ml-[72px]' : 'md:ml-64'

  function openSystem(system) {
    setActiveSystem(system)
    setCollapsed(true)
  }

  return (
    <div className="bg-background text-on-background min-h-screen">
      {!activeSystem && <Header onHome={() => setActiveSystem(null)} />}
      <div className="flex">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          onSystemClick={openSystem}
          onHome={() => setActiveSystem(null)}
        />
        {activeSystem ? (
          <IframeView system={activeSystem} onClose={() => setActiveSystem(null)} collapsed={collapsed} />
        ) : (
          <>
            <main className={`flex-1 ${ml} xl:mr-80 px-6 py-6 pb-20 md:pb-6 transition-all duration-300`}>
              <Feed onSystemClick={openSystem} onOpenTasks={() => setTasksDrawerOpen(true)} />
            </main>
            <RightPanel drawerOpen={tasksDrawerOpen} onDrawerOpen={() => setTasksDrawerOpen(true)} onDrawerClose={() => setTasksDrawerOpen(false)} />
          </>
        )}
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white grid grid-cols-5 md:hidden z-50 h-16 rounded-t-2xl"
        style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.1)' }}
      >
        <button className="flex flex-col items-center justify-center gap-0.5 relative">
          <span className="absolute top-1 w-8 h-1 rounded-full bg-primary opacity-90" />
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#002068', fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="text-[10px] font-semibold" style={{ color: '#002068' }}>Главная</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-0.5 text-on-surface-variant">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>newspaper</span>
          <span className="text-[10px]">Новости</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-0.5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center -mt-5" style={{ background: 'linear-gradient(135deg, #001752, #0038b8)', boxShadow: '0 4px 14px rgba(0,32,104,0.4)' }}>
            <span className="material-symbols-outlined text-white" style={{ fontSize: 22 }}>add</span>
          </div>
          <span className="text-[10px] text-on-surface-variant mt-0.5">Создать</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-0.5 text-on-surface-variant">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>hub</span>
          <span className="text-[10px]">Сервисы</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-0.5 text-on-surface-variant">
          <img src="/iam1.png" className="w-7 h-7 rounded-full object-cover" alt="Профиль" />
          <span className="text-[10px]">Профиль</span>
        </button>
      </nav>
    </div>
  )
}
