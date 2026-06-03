import { useState, useRef, useEffect } from 'react'

const NOTIFICATIONS = [
  {
    type: 'task',
    system: 'Unity BPM',
    systemColor: '#1d4ed8',
    systemBg: '#eff6ff',
    title: 'Табель учёта рабочего времени ГПХ',
    desc: 'Ждёт вашего согласования',
    time: '26 мая, 09:14',
    read: false,
  },
  {
    type: 'task',
    system: 'Bagdar',
    systemColor: '#be185d',
    systemBg: '#fdf2f8',
    title: 'Оценка вовлечённости Q2 2026',
    desc: 'Новый опрос — срок до 31 мая',
    time: '27 мая, 10:02',
    read: false,
  },
  {
    type: 'task',
    system: 'Unity BPM',
    systemColor: '#1d4ed8',
    systemBg: '#eff6ff',
    title: 'Заявка на командировку — Алматы',
    desc: 'Ждёт вашего согласования',
    time: '27 мая, 08:45',
    read: false,
  },
  {
    type: 'mention',
    title: 'Хасанова Лаура упомянула вас',
    desc: '«...хорошая работа команде разработки!»',
    time: '25 мая, 09:00',
    read: true,
  },
  {
    type: 'mention',
    title: 'Джаксыбеков Ерлан ответил на ваш пост',
    desc: '«Поддерживаю, давно пора ускорить процесс»',
    time: '26 мая, 15:30',
    read: true,
  },
  {
    type: 'news',
    title: 'Құрбан айт мерекесі құтты болсын!',
    desc: 'Новая статья в разделе Холдинг',
    time: '27 мая',
    read: false,
  },
  {
    type: 'news',
    title: 'Начинается BIG QUEST!',
    desc: 'Новая статья в разделе События',
    time: '25 мая',
    read: true,
  },
]

const TYPE_META = {
  task:    { icon: 'pending_actions', color: '#1d4ed8', label: 'Задача' },
  mention: { icon: 'alternate_email',  color: '#0f766e', label: 'Упоминание' },
  news:    { icon: 'newspaper',        color: '#7c3aed', label: 'Новости' },
}

const LANGUAGES = [
  { code: 'RU', name: 'Русский'        },
  { code: 'KZ', name: 'Қазақша'        },
  { code: 'EN', name: 'English'         },
  { code: 'UZ', name: "O'zbekcha"       },
  { code: 'UA', name: 'Українська'      },
  { code: 'AZ', name: 'Azərbaycanca'   },
]

export default function Header({ onHome }) {
  const [notifOpen, setNotifOpen]   = useState(false)
  const [newsNotif, setNewsNotif]   = useState(true)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [lang, setLang]             = useState('RU')
  const [langOpen, setLangOpen]     = useState(false)
  const panelRef  = useRef(null)
  const langRef   = useRef(null)

  const visible = notifications.filter(n => n.type !== 'news' || newsNotif)
  const unread  = visible.filter(n => !n.read).length

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  useEffect(() => {
    function handler(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setNotifOpen(false)
    }
    if (notifOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [notifOpen])

  useEffect(() => {
    function handler(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    if (langOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [langOpen])

  return (
    <header className="fixed top-0 right-0 z-50 h-16 flex items-center gap-4 px-6" style={{ background: '#f8f7ff', left: 256 }}>
      {/* Поиск по центру */}
      <div className="relative flex-1 max-w-lg">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: 18, color: '#9ca3af' }}>search</span>
        <input
          className="w-full rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none"
          style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#1a1b22' }}
          placeholder="Поиск по сотрудникам, новостям, документам..."
          type="text"
        />
      </div>
      <div className="flex items-center gap-4 ml-auto" ref={panelRef}>
        {/* Переключатель языка */}
        <div className="relative hidden md:block" ref={langRef}>
          <button
            onClick={() => setLangOpen(v => !v)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold hover:bg-outline-variant/20 transition-colors"
            style={{ fontSize: 13, color: '#002068', letterSpacing: '0.05em' }}
          >
            {lang}
            <span className="material-symbols-outlined transition-transform duration-200" style={{ fontSize: 16, transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              expand_more
            </span>
          </button>

          {langOpen && (
            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-outline-variant/20 overflow-hidden z-50" style={{ width: 180 }}>
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setLangOpen(false) }}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-surface-container transition-colors"
                  style={{ background: lang === l.code ? '#eeedf6' : '#fff' }}
                >
                  <span style={{ fontSize: 13, color: '#1a1b22', fontWeight: lang === l.code ? 600 : 400 }}>{l.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: lang === l.code ? '#002068' : '#c4c5d5', letterSpacing: '0.05em' }}>{l.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Колокольчик */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="p-2 rounded-full hover:bg-outline-variant/20 transition-colors relative"
            style={{ color: '#002068' }}
          >
            <span className="material-symbols-outlined">notifications</span>
            {unread > 0 && (
              <span
                className="absolute top-1.5 right-1.5 flex items-center justify-center rounded-full border-2 font-bold"
                style={{ width: 17, height: 17, fontSize: 9, background: '#dc2626', color: '#fff', borderColor: '#f8f7ff' }}
              >
                {unread}
              </span>
            )}
          </button>

          {/* Панель уведомлений */}
          {notifOpen && (
            <div
              className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden z-50"
              style={{ width: 380 }}
            >
              {/* Шапка */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20">
                <span className="font-bold" style={{ fontSize: 15, color: '#1a1b22' }}>Уведомления</span>
                {unread > 0 && (
                  <button onClick={markAllRead} className="font-semibold hover:underline" style={{ fontSize: 12, color: '#002068' }}>
                    Отметить все прочитанными
                  </button>
                )}
              </div>

              {/* Список */}
              <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 400 }}>
                {visible.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2" style={{ color: '#747684' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 36 }}>notifications_off</span>
                    <span style={{ fontSize: 13 }}>Нет уведомлений</span>
                  </div>
                ) : (
                  visible.map((n, i) => {
                    const meta = TYPE_META[n.type]
                    return (
                      <div
                        key={i}
                        className="flex gap-3 px-4 py-3 hover:bg-surface-container/50 transition-colors cursor-pointer border-b border-outline-variant/10"
                        style={{ background: n.read ? '#fff' : '#f0f4ff' }}
                      >
                        {/* Иконка */}
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: n.systemBg ?? `${meta.color}15` }}>
                          {n.system ? (
                            <span style={{ fontSize: 10, fontWeight: 700, color: n.systemColor }}>{n.system.split(' ')[0]}</span>
                          ) : (
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: meta.color }}>{meta.icon}</span>
                          )}
                        </div>

                        {/* Контент */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${meta.color}15`, color: meta.color }}>
                              {meta.label}
                            </span>
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                          </div>
                          <p className="font-semibold leading-tight" style={{ fontSize: 12, color: '#1a1b22' }}>{n.title}</p>
                          <p className="leading-snug mt-0.5" style={{ fontSize: 11, color: '#747684' }}>{n.desc}</p>
                          <p className="mt-1" style={{ fontSize: 10, color: '#c4c5d5' }}>{n.time}</p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Подвал — настройка */}
              <div className="px-4 py-3 border-t border-outline-variant/20 flex items-center justify-between" style={{ background: '#fafafa' }}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsNotif}
                    onChange={e => setNewsNotif(e.target.checked)}
                    className="rounded"
                    style={{ accentColor: '#002068', width: 14, height: 14 }}
                  />
                  <span style={{ fontSize: 11, color: '#444653' }}>Получать уведомления о Новостях и Предложениях</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <button className="p-2 rounded-full hover:bg-outline-variant/20 transition-colors" style={{ color: '#002068' }}>
          <span className="material-symbols-outlined">calendar_month</span>
        </button>
        <button className="p-2 rounded-full hover:bg-outline-variant/20 transition-colors" style={{ color: '#002068' }}>
          <span className="material-symbols-outlined">apps</span>
        </button>
        <div className="ml-2 flex items-center gap-3 cursor-pointer">
          <img alt="Профиль" className="w-10 h-10 rounded-full object-cover border-2" style={{ borderColor: '#ddd6fe' }} src="/iam1.png" />
        </div>
      </div>
    </header>
  )
}
