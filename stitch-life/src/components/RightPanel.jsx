import { useState } from 'react'

// Цвета статусов
const STATUS_STYLES = {
  'Согласование': { color: '#1d4ed8', bg: '#eff6ff' },
  'Подписать':    { color: '#0f766e', bg: '#f0fdfa' },
  'Исполнить':    { color: '#b45309', bg: '#fffbeb' },
  'Ознакомиться': { color: '#6d28d9', bg: '#f5f3ff' },
  'Пройти опрос': { color: '#be185d', bg: '#fdf2f8' },
}

const TASKS = [
  {
    name: 'Табель учёта рабочего времени ГПХ',
    status: 'Согласование',
    docNum: '№ ТАБ-2026-00487',
    date: '26 мая 2026, 09:14',
    actions: [
      { label: 'Согласовать', variant: 'primary' },
      { label: 'Отказать', variant: 'outline' },
    ],
  },
  {
    name: 'Оценка вовлечённости Q2 2026',
    status: 'Пройти опрос',
    docNum: '№ OПР-2026-00124',
    date: '27 мая 2026, 10:02',
    actions: [
      { label: 'Пройти опрос', variant: 'primary' },
    ],
  },
  {
    name: 'Заявка на командировку — Алматы',
    status: 'Согласование',
    docNum: '№ КМД-2026-00891',
    date: '27 мая 2026, 08:45',
    actions: [
      { label: 'Согласовать', variant: 'primary' },
      { label: 'Отказать', variant: 'outline' },
    ],
  },
  {
    name: 'Приказ об изменении графика работы',
    status: 'Ознакомиться',
    docNum: '№ ПРК-2026-00210',
    date: '25 мая 2026, 14:30',
    actions: [
      { label: 'Ознакомиться', variant: 'primary' },
    ],
  },
  {
    name: 'Акт выполненных работ — подрядчик',
    status: 'Подписать',
    docNum: '№ АКТ-2026-01053',
    date: '24 мая 2026, 11:00',
    actions: [
      { label: 'Подписать', variant: 'primary' },
      { label: 'Отказать', variant: 'outline' },
    ],
  },
  {
    name: 'Служебная записка на закупку ноутбуков',
    status: 'Согласование',
    docNum: '№ СЗ-2026-00334',
    date: '24 мая 2026, 16:05',
    actions: [
      { label: 'Согласовать', variant: 'primary' },
      { label: 'Отказать', variant: 'outline' },
    ],
  },
  {
    name: 'Заявка на отпуск — Нурланова А.',
    status: 'Согласование',
    docNum: '№ ОТП-2026-00762',
    date: '23 мая 2026, 08:30',
    actions: [
      { label: 'Согласовать', variant: 'primary' },
      { label: 'Отказать', variant: 'outline' },
    ],
  },
]

const TEAM = [
  { img: '/ava1.png', name: 'Диляра Абельдинова', role: 'HR менеджер' },
  { img: '/ava2.png', name: 'Аида Егинбай', role: 'HR администратор' },
  { img: '/ava3.png', name: 'Султан Бегалин', role: 'Финансовый менеджер' },
  { img: '/ava4.png', name: 'Айнура Тойбекова', role: 'Бухгалтер по ЗП' },
  { img: '/ava5.png', name: 'Мадина Алтаева', role: 'Бухгалтер мат. стола' },
  { img: '/ava6.png', name: 'Нургуль Мусекина', role: 'Юрист' },
]

function actionClass(variant) {
  if (variant === 'primary')
    return 'flex-1 py-1.5 rounded-lg text-[11px] font-bold text-white transition-colors shadow-sm'
  if (variant === 'outline-primary')
    return 'flex-1 py-1.5 rounded-lg text-[11px] font-bold border border-primary text-primary hover:bg-primary-container/5 transition-colors'
  return 'flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition-colors'
}

function actionStyle(variant) {
  if (variant === 'primary')
    return { background: '#16a34a' }
  if (variant === 'outline')
    return { borderColor: '#f87171', color: '#dc2626', background: '#fff5f5' }
  return {}
}

function TaskCard({ task }) {
  const st = STATUS_STYLES[task.status] ?? { color: '#444653', bg: '#eeedf6' }
  return (
    <div className="rounded-2xl bg-white shadow-sm hover:shadow-md transition-all p-3 border border-outline-variant/10">
      <p className="font-semibold leading-snug mb-2" style={{ fontSize: 12, color: '#1a1b22' }}>{task.name}</p>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{task.status}</span>
        <span style={{ fontSize: 10, color: '#747684' }}>{task.docNum}</span>
      </div>
      <p style={{ fontSize: 10, color: 'rgba(68,70,83,0.5)', marginBottom: 10 }}>{task.date}</p>
      <div className="flex gap-2">
        {task.actions.map((action) => (
          <button key={action.label} className={actionClass(action.variant)} style={actionStyle(action.variant)}>{action.label}</button>
        ))}
      </div>
    </div>
  )
}

export default function RightPanel({ drawerOpen = false, onDrawerOpen, onDrawerClose }) {

  return (
    <>
      {/* Drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.25)' }}
          onClick={onDrawerClose}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-16 bottom-0 right-0 z-50 bg-white border-l border-outline-variant flex flex-col overflow-hidden transition-all duration-300 custom-scrollbar"
        style={{ width: drawerOpen ? 480 : 0, opacity: drawerOpen ? 1 : 0, pointerEvents: drawerOpen ? 'auto' : 'none' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 flex-shrink-0">
          <h2 className="font-bold flex items-center gap-2" style={{ fontSize: 16 }}>
            <span className="material-symbols-outlined text-error" style={{ fontSize: 20 }}>pending_actions</span>
            Все задачи
            <span className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#fef2f2', color: '#dc2626' }}>{TASKS.length}</span>
          </h2>
          <button
            onClick={onDrawerClose}
            className="p-1.5 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {TASKS.map((task) => <TaskCard key={task.docNum} task={task} />)}
        </div>
      </div>

    <aside className="fixed right-0 top-16 bottom-0 w-80 bg-surface overflow-y-auto hidden xl:flex flex-col p-6 z-40 custom-scrollbar" style={{ boxShadow: '-2px 0 20px rgba(0,0,0,0.06)' }}>

      {/* Задачи — скрыто, будет во второй итерации */}
      {false && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2" style={{ fontSize: 16 }}>
              <span className="material-symbols-outlined text-error" style={{ fontSize: 20 }}>pending_actions</span>
              Задачи
            </h3>
            <button onClick={onDrawerOpen} className="font-bold hover:underline bg-transparent border-none cursor-pointer" style={{ fontSize: 12, color: '#002068' }}>
              Все ({TASKS.length})
            </button>
          </div>
          <div className="space-y-2">
            {TASKS.slice(0, 3).map((task) => (
              <TaskCard key={task.docNum} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Слово дня */}
      <div className="rounded-2xl p-4 text-white mb-6" style={{ background: 'linear-gradient(135deg, #001650 0%, #0038b8 100%)' }}>
        <p className="font-semibold uppercase mb-2" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)' }}>
          Слово дня
        </p>
        <p className="font-bold mb-2" style={{ fontSize: 15, color: '#fff' }}>Префаб</p>
        <p className="leading-relaxed" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: '18px' }}>
          Готовая деталь каркаса или фасада, производимая на фабрике для сухой сборки на стройплощадке.
        </p>
      </div>

      {/* Моя команда */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4" style={{ fontSize: 16 }}>Моя команда</h3>
        <div className="space-y-3">
          {TEAM.map((m) => (
            <div key={m.name} className="flex items-center gap-3">
              <img src={m.img} className="w-9 h-9 rounded-full object-cover flex-shrink-0" alt={m.name} />
              <div className="min-w-0">
                <p className="font-semibold leading-tight truncate" style={{ fontSize: 12 }}>{m.name}</p>
                <p style={{ fontSize: 11, color: '#444653' }}>{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
    </>
  )
}
