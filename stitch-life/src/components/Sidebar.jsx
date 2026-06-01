import { useState } from 'react'

const MAIN_NAV = [
  { icon: 'home', label: 'Главная' },
  {
    icon: 'newspaper',
    label: 'Новости',
    children: [
      { icon: 'view_stream', label: 'Лента' },
      { icon: 'menu_book', label: 'Журналы' },
      { icon: 'lightbulb', label: 'Предложения' },
      { icon: 'poll', label: 'Опросы' },
    ],
  },
  {
    icon: 'group',
    label: 'Сотрудники',
    children: [
      { icon: 'cake', label: 'Дни рождения' },
      { icon: 'person_add', label: 'Новые' },
      { icon: 'swap_horiz', label: 'Перемещения' },
      { icon: 'work', label: 'Вакансии и Кандидаты' },
    ],
  },
  {
    icon: 'account_tree',
    label: 'Оргструктура',
    children: [
      { icon: 'handshake', label: 'Акционеры и Партнеры' },
      { icon: 'military_tech', label: 'ТОР Сотрудники' },
    ],
  },
  {
    icon: 'diversity_3',
    label: 'Миссия и Ценности',
    children: [
      { icon: 'my_location', label: 'Цель' },
      { icon: 'favorite', label: 'Ценности' },
      { icon: 'history', label: 'История' },
    ],
  },
  { icon: 'record_voice_over', label: 'BI Дауысы' },
]

const SYSTEMS = [
  { icon: 'hub',    label: 'Unity BPM', badge: 4, url: 'https://unitybpm.bi.group' },
  { icon: 'school', label: 'BILIM',     badge: 3, url: 'https://bilim.bi.group'    },
]

export default function Sidebar({ collapsed, onToggle, onSystemClick, onHome }) {
  const [active, setActive] = useState('Главная')
  const [expanded, setExpanded] = useState({})

  function toggleExpand(label) {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  function handleParentClick(e, item) {
    e.preventDefault()
    onHome?.()
    if (item.label === 'Главная') {
      setActive('Главная')
      return
    }
    if (item.children) {
      if (!collapsed) toggleExpand(item.label)
      setActive(item.label)
    } else {
      setActive(item.label)
    }
  }

  function handleChildClick(e, childLabel) {
    e.preventDefault()
    onHome?.()
    setActive(childLabel)
  }

  return (
    <aside
      className="fixed left-0 top-16 bottom-0 border-r border-outline-variant bg-surface-container flex flex-col pt-4 pb-8 z-40 hidden md:flex transition-all duration-300"
      style={{ width: collapsed ? 72 : 256 }}
    >
      {/* Collapse toggle — маленький круглый handle на правом крае */}
      <button
        onClick={onToggle}
        title={collapsed ? 'Развернуть' : 'Свернуть'}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white border border-outline-variant shadow-sm flex items-center justify-center hover:bg-surface-container hover:border-primary transition-all duration-200 z-10"
        style={{ color: '#747684' }}
      >
        <span
          className="material-symbols-outlined transition-transform duration-300"
          style={{ fontSize: 14, transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
        >
          chevron_right
        </span>
      </button>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {MAIN_NAV.map((item) => {
          const isActive = active === item.label
          const isExpanded = !!expanded[item.label]
          const hasActiveChild = item.children?.some((c) => c.label === active)
          const highlighted = isActive || hasActiveChild

          return (
            <div key={item.label}>
              <a
                href="#"
                onClick={(e) => handleParentClick(e, item)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-lg my-0.5 transition-all duration-200 ${
                  collapsed ? 'mx-2 px-3 py-3 justify-center' : 'mx-2 px-4 py-3'
                } ${
                  highlighted
                    ? 'bg-primary-container text-on-primary-container border-l-4 border-primary scale-[0.98]'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span
                  className="material-symbols-outlined flex-shrink-0"
                  style={highlighted ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>

                {!collapsed && (
                  <>
                    <span className="text-sm flex-1 whitespace-nowrap">{item.label}</span>
                    {item.children && (
                      <span
                        className="material-symbols-outlined transition-transform duration-200 flex-shrink-0"
                        style={{ fontSize: 18, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        expand_more
                      </span>
                    )}
                  </>
                )}

                {/* Badge-dot в свёрнутом состоянии для систем с детьми */}
                {collapsed && hasActiveChild && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </a>

              {/* Sub-items — показываем только в развёрнутом состоянии */}
              {!collapsed && item.children && isExpanded && (
                <div>
                  {item.children.map((child) => {
                    const isChildActive = active === child.label
                    return (
                      <a
                        key={child.label}
                        href="#"
                        onClick={(e) => handleChildClick(e, child.label)}
                        className={`flex items-center gap-3 rounded-lg mx-2 my-0.5 pl-10 pr-4 py-2 transition-all text-sm ${
                          isChildActive
                            ? 'text-primary font-semibold bg-primary-container/20'
                            : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined flex-shrink-0"
                          style={{
                            fontSize: 18,
                            fontVariationSettings: isChildActive ? "'FILL' 1" : "'FILL' 0",
                          }}
                        >
                          {child.icon}
                        </span>
                        <span className="flex-1">{child.label}</span>
                        {isChildActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* Рабочие системы */}
        <div className="h-px bg-outline-variant/30 my-4 mx-3" />
        {!collapsed && (
          <div className="px-6 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
              Рабочие системы
            </span>
          </div>
        )}
        {SYSTEMS.map((sys) => (
          <a
            key={sys.label}
            href="#"
            title={collapsed ? sys.label : undefined}
            onClick={(e) => { e.preventDefault(); onSystemClick?.({ label: sys.label, url: sys.url }) }}
            className={`flex items-center rounded-lg mx-2 my-0.5 hover:bg-surface-container-high transition-colors relative ${
              collapsed ? 'px-3 py-3 justify-center' : 'justify-between px-4 py-2'
            }`}
          >
            <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
              <span className="material-symbols-outlined text-primary">{sys.icon}</span>
              {!collapsed && <span className="text-sm">{sys.label}</span>}
            </div>
            {sys.badge && !collapsed && (
              <span className="bg-error text-on-error text-[10px] px-1.5 py-0.5 rounded-full font-bold">{sys.badge}</span>
            )}
            {sys.badge && collapsed && (
              <span className="absolute top-1 right-1 bg-error text-on-error text-[8px] w-4 h-4 rounded-full font-bold flex items-center justify-center">{sys.badge}</span>
            )}
          </a>
        ))}

        {/* Инструменты */}
        <div className="h-px bg-outline-variant/30 my-4 mx-3" />
        {!collapsed && (
          <div className="px-6 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
              Инструменты
            </span>
          </div>
        )}
        {[
          { icon: 'view_kanban', label: 'Канбан-доска' },
          { icon: 'menu_book',   label: 'Wiki'          },
        ].map((item) => (
          <a
            key={item.label}
            href="#"
            title={collapsed ? item.label : undefined}
            className={`flex items-center rounded-lg mx-2 my-0.5 hover:bg-surface-container-high transition-colors text-on-surface-variant ${
              collapsed ? 'px-3 py-3 justify-center' : 'gap-3 px-4 py-2'
            }`}
          >
            <span className="material-symbols-outlined text-primary">{item.icon}</span>
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </a>
        ))}
      </nav>

      <div className="border-t border-outline-variant/30 pt-4">
        <a
          href="#"
          title={collapsed ? 'Настройки' : undefined}
          className={`flex items-center gap-3 text-on-surface-variant mx-2 hover:bg-surface-container-high transition-colors rounded-lg ${
            collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'
          }`}
        >
          <span className="material-symbols-outlined">settings</span>
          {!collapsed && <span className="text-sm">Настройки</span>}
        </a>
      </div>
    </aside>
  )
}
