import { useState, useRef, useEffect } from 'react'

const ALL_NEWS = [
  {
    img: '/news1.png',
    tab: 'news',
    category: 'Холдинг',
    categoryStyle: { color: '#002068' },
    title: 'Құрбан айт мерекесі құтты болсын!',
    text: 'BI Group поздравляет всех сотрудников с великим праздником Курбан айт. Желаем мира, благополучия и процветания вашим семьям.',
    date: '27 мая',
    featured: true,
  },
  {
    img: '/news2.png',
    tab: 'news',
    category: 'Обучение',
    categoryStyle: { color: '#5f6365' },
    title: 'Первые шаги в профессию: стажёры Foreman D',
    date: '26 мая',
  },
  {
    img: '/news3.png',
    tab: 'news',
    category: 'События',
    categoryStyle: { color: '#4f1100' },
    title: 'Включайтесь в игру: начинается BIG QUEST!',
    date: '25 мая',
  },
  {
    img: '/news4.png',
    tab: 'news',
    category: 'Холдинг',
    categoryStyle: { color: '#002068' },
    title: 'С днём рождения, BI Group — нам 31 год!',
    date: '22 мая',
  },
  {
    img: '/news5.png',
    tab: 'suggestions',
    category: 'Предложение',
    categoryStyle: { color: '#0f766e' },
    title: 'Предлагаю сделать пятницу коротким днём',
    text: 'Коллеги поддерживают идею заканчивать работу в 17:00 по пятницам для повышения продуктивности в течение недели.',
    date: '26 мая',
    featured: true,
  },
  {
    img: '/news6.png',
    tab: 'suggestions',
    category: 'Предложение',
    categoryStyle: { color: '#0f766e' },
    title: 'Добавить велопарковку у главного офиса',
    date: '24 мая',
  },
  {
    img: '/news1.png',
    tab: 'suggestions',
    category: 'Предложение',
    categoryStyle: { color: '#0f766e' },
    title: 'Организовать корпоративную библиотеку',
    date: '22 мая',
  },
  {
    img: '/news2.png',
    tab: 'surveys',
    category: 'Опрос · HR',
    categoryStyle: { color: '#be185d' },
    title: 'Оценка вовлечённости сотрудников Q2 2026',
    text: 'Пройдите анонимный опрос — ваше мнение поможет улучшить условия работы в холдинге. Срок: до 31 мая.',
    date: '27 мая',
    featured: true,
  },
  {
    img: '/news3.png',
    tab: 'surveys',
    category: 'Опрос · PR',
    categoryStyle: { color: '#7c3aed' },
    title: 'Как вы оцениваете внутренние коммуникации?',
    date: '25 мая',
  },
  {
    img: '/news4.png',
    tab: 'surveys',
    category: 'Опрос · HR',
    categoryStyle: { color: '#be185d' },
    title: 'Удовлетворённость условиями труда 2026',
    date: '20 мая',
  },
]

const NEWS_TABS = [
  { key: 'all',         label: 'Лента'        },
  { key: 'news',        label: 'Новости'      },
  { key: 'suggestions', label: 'Предложения'  },
  { key: 'surveys',     label: 'Опросы'       },
]

const DAUYS_POSTS = [
  {
    time: '1 день назад',
    text: 'Армысыз, коллеги! Есть кто играет в падел в Астане? Ищу компанию для игр.',
    likes: 2,
    comments: 1,
  },
  {
    name: 'Хасанова Лаура',
    img: '/dau1.png',
    time: '25 мая',
    text: 'BILife стал намного удобнее после последнего обновления. Хорошая работа команде разработки! Дизайн стал чище.',
    likes: 67,
    comments: 4,
    useHeart: true,
  },
  {
    name: 'Еділхан Малика',
    img: '/dau2.png',
    time: '1 день назад',
    text: 'Здравствуйте! Очень нужна помощь. Ищем добрую семью в Астане, готовую приютить собачку Ши-тцу. Она ласковая, спокойная и идеальна для квартиры.',
    likes: 12,
    comments: 0,
    photos: 1,
  },
  {
    time: 'вчера, 10:11',
    text: 'Спасибо команде IT за быстрое решение проблемы с доступом в BPM. Реально помогли!',
    likes: 52,
    comments: 2,
  },
  {
    time: 'вчера, 16:42',
    text: 'Столовая на 2-м этаже закрыта уже третий день. Можно ли что-то с этим сделать?',
    likes: 31,
    comments: 7,
  },
  {
    time: 'сегодня, 11:05',
    text: 'Когда сделают нормальный онбординг? Первые две недели непонятно куда идти и что делать.',
    likes: 14,
    comments: 3,
  },
  {
    name: 'Джаксыбеков Ерлан',
    img: '/dau3.png',
    time: '26 мая, 14:30',
    text: 'Почему процесс согласования командировки занимает 5 дней? Можно ли ускорить?',
    likes: 28,
    comments: 11,
  },
  {
    time: '25 мая, 12:00',
    text: 'Парковка на подземном уровне будет закрыта 29 мая с 8:00 до 14:00 в связи с техническими работами.',
    likes: 19,
    comments: 0,
  },
  {
    time: '25 мая, 09:15',
    text: 'У кого есть опыт работы с SAP HR? Нужна помощь с настройкой модуля отчётности.',
    likes: 8,
    comments: 3,
  },
  {
    name: 'Джаксыбеков Ерлан',
    img: '/dau3.png',
    time: '25 мая, 17:15',
    text: 'Кто едет на корпоратив 5 июня? Давайте организуем совместный трансфер из офиса на Достык!',
    likes: 45,
    comments: 12,
  },
  {
    time: '24 мая, 16:30',
    text: 'Ищу напарника по бегу по утрам в парке Жетысу. Бегаю в 7:00, темп спокойный. Есть желающие?',
    likes: 6,
    comments: 4,
  },
  {
    time: '24 мая, 11:45',
    text: 'Вопрос к HR: когда будет следующая волна повышений? Уже год без индексации.',
    likes: 38,
    comments: 9,
  },
  {
    name: 'Хасанова Лаура',
    img: '/dau1.png',
    time: '23 мая, 14:00',
    text: 'Коллеги, напоминаю — до конца недели нужно сдать обходные листы. Без этого не закроем май.',
    likes: 22,
    comments: 5,
  },
  {
    time: '23 мая, 10:30',
    text: 'Есть кто работает в BIM? Хотел бы пообщаться насчёт интеграции с нашим отделом.',
    likes: 4,
    comments: 2,
  },
  {
    time: '22 мая, 18:00',
    text: 'BI Group, поздравляю нас всех с 31-летием! Горжусь что работаю здесь уже 7 лет 🎉',
    likes: 112,
    comments: 24,
  },
  {
    time: '22 мая, 09:00',
    text: 'Кондиционер в переговорной на 5 этаже не работает вторую неделю. АХО, помогите пожалуйста!',
    likes: 17,
    comments: 6,
  },
  {
    name: 'Еділхан Малика',
    img: '/dau2.png',
    time: '21 мая, 12:45',
    text: 'Открылась запись на мастер-класс по публичным выступлениям от нашего корпоративного тренера. Очень рекомендую, сама прошла в прошлом году.',
    likes: 33,
    comments: 8,
  },
  {
    time: '21 мая, 08:30',
    text: 'Кто знает, когда откроется новая столовая в корпусе Б? Слышал что там будет нормальная еда.',
    likes: 51,
    comments: 15,
  },
  {
    time: '20 мая, 16:10',
    text: 'Продаю билеты на концерт Dimash 1 июня, 2 штуки. Цена договорная. Писать в личку.',
    likes: 9,
    comments: 7,
  },
  {
    name: 'Джаксыбеков Ерлан',
    img: '/dau3.png',
    time: '20 мая, 11:00',
    text: 'Запустили внутренний Telegram-бот для заявок в Service Desk. Попробовал — реально удобнее чем звонить. Рекомендую.',
    likes: 76,
    comments: 18,
  },
]

const BI_CLUBS = [
  {
    logo: '/club1.png',
    short: 'Fin Club',
    name: 'Клуб финансистов',
    desc: 'Профессиональное сообщество финансистов холдинга. Обмен опытом, кейсы, обучение и нетворкинг внутри BI Group.',
    color: '#1d4ed8',
    bg: '#eff6ff',
  },
  {
    logo: '/club2.png',
    short: 'BI Stars',
    name: 'Клуб лучших сотрудников',
    desc: 'Признание и развитие топ-сотрудников холдинга. Менторство, карьерные треки и специальные привилегии.',
    color: '#b45309',
    bg: '#fffbeb',
  },
  {
    logo: '/club3.png',
    short: 'Gold Fund',
    name: 'Золотой фонд BI',
    desc: 'Программа долгосрочного поощрения ключевых специалистов. Бонусы, инвестиции в развитие и удержание талантов.',
    color: '#92400e',
    bg: '#fef3c7',
  },
  {
    logo: '/club4.png',
    short: 'Talent Pool',
    name: 'Кадровый резерв',
    desc: 'Best Talent Pool — программа выявления и развития высокопотенциальных сотрудников для руководящих позиций.',
    color: '#0369a1',
    bg: '#e0f2fe',
  },
  {
    logo: '/club5.png',
    short: 'BI Cares',
    name: 'Социальный клуб',
    desc: 'Волонтёрство, благотворительность и корпоративная социальная ответственность. Вместе делаем мир лучше.',
    color: '#be185d',
    bg: '#fdf2f8',
  },
]

const BIRTHDAYS = [
  { img: '/bd1.png',  name: 'Айдар Акшабаев',      when: 'Сегодня', today: true  },
  { img: '/bd2.png',  name: 'Даурен Балгабаев',     when: '29 мая',  today: false },
  { img: '/bd3.png',  name: 'Ильяс Жанарбаев',      when: '1 июня',  today: false },
  { img: '/bd4.png',  name: 'Абдулла Абаев',         when: '3 июня',  today: false },
  { img: '/bd5.png',  name: 'Нұрсейт Адай',          when: '5 июня',  today: false },
  { img: '/bd6.png',  name: 'Адель Есқазы',          when: '7 июня',  today: false },
  { img: '/bd7.png',  name: 'Асел Жабагина',         when: '9 июня',  today: false },
  { img: '/bd8.png',  name: 'Илон Маск',             when: '11 июня', today: false },
  { img: '/bd9.png',  name: 'Энн Хэтэуэй',          when: '13 июня', today: false },
  { img: '/bd10.png', name: 'Анджелина Джоли',       when: '15 июня', today: false },
  { img: '/bd3.png',  name: 'Болат Омаров',           when: '17 июня', today: false },
  { img: '/bd5.png',  name: 'Айгерим Нурланова',     when: '18 июня', today: false },
  { img: '/bd2.png',  name: 'Серік Ахметов',         when: '19 июня', today: false },
  { img: '/bd7.png',  name: 'Дина Касымова',          when: '20 июня', today: false },
  { img: '/bd4.png',  name: 'Марат Жексенбеков',     when: '21 июня', today: false },
  { img: '/bd6.png',  name: 'Алия Бекова',            when: '22 июня', today: false },
  { img: '/bd1.png',  name: 'Тимур Исаев',            when: '23 июня', today: false },
  { img: '/bd8.png',  name: 'Жанар Сатыбалды',       when: '24 июня', today: false },
  { img: '/bd9.png',  name: 'Ерлан Мухамедов',       when: '25 июня', today: false },
  { img: '/bd10.png', name: 'Сауле Ержанова',        when: '26 июня', today: false },
]

const EXTRA_SYSTEMS = [
  { icon: 'insert_chart', label: 'Bagdar',    url: 'https://bagdar.bi.group',  color: '#be185d', bg: 'rgba(190,24,93,0.08)'  },
  { icon: 'person_search', label: 'BI Hunter', url: 'https://hunter.bi.group', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { icon: 'science',       label: 'TestLab',   url: 'https://testlab.bi.group', color: '#0f766e', bg: 'rgba(15,118,110,0.08)' },
  { icon: 'construction',  label: 'Opera Build', url: 'https://operabuild.bi.group', color: '#b45309', bg: 'rgba(180,83,9,0.08)' },
]

const QUICK_LAUNCH = [
  { icon: 'star',            label: 'Фонд Жулдызай' },
  { icon: 'desktop_windows', label: 'Service Desk'  },
  { icon: 'edit_note',       label: 'Записка'        },
  { icon: 'description',     label: 'Договор'        },
  { icon: 'flight_takeoff',  label: 'На отпуск'      },
  { icon: 'lock',            label: 'Доступ'         },
]

const COURSES = [
  { name: 'Онбординг: BI Group', pct: 75 },
  { name: 'Lean в строительстве', pct: 30 },
]

const DAUYS_BATCH = 4

const PER_PAGE = 10

function HorizontalPagedGrid({ items, renderCard, title, icon }) {
  const [page, setPage] = useState(0)
  const total = Math.ceil(items.length / PER_PAGE)
  const visible = items.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  return (
    <div>
      {/* Заголовок с контролами */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold flex items-center gap-2" style={{ fontSize: 20, color: '#1a1b22' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#002068' }}>{icon}</span>
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <a href="#" className="px-3 py-1.5 bg-white shadow-sm rounded-lg font-semibold hover:bg-surface-container transition-colors" style={{ fontSize: 12, color: '#444653' }}>
            Все
          </a>
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 0}
            className="p-1.5 bg-white shadow-sm rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === total - 1}
            className="p-1.5 bg-white shadow-sm rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
          </button>
        </div>
      </div>

      {/* Сетка */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PER_PAGE}, 1fr)`, gap: 10 }}>
        {visible.map((item, i) => renderCard(item, i))}
      </div>
    </div>
  )
}

export default function Feed({ onSystemClick: _onSystemClick, onOpenTasks }) {
  const [liked, setLiked] = useState(() => new Set([1]))
  const [likeCounts, setLikeCounts] = useState(() =>
    Object.fromEntries(DAUYS_POSTS.map((p, i) => [i, p.likes]))
  )
  const [visibleCount, setVisibleCount] = useState(DAUYS_BATCH)
  const [newsTab, setNewsTab] = useState('all')
  const feedRef = useRef(null)
  const sentinel = useRef(null)

  // Синхронизировать высоту BI Дауысы с правой колонкой
  useEffect(() => {
    const rightCol = document.getElementById('right-col')
    const dauysCard = document.getElementById('dauys-card')
    if (!rightCol || !dauysCard) return
    const sync = () => {
      const h = rightCol.offsetHeight
      if (h > 0) dauysCard.style.height = h + 'px'
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(rightCol)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!sentinel.current || !feedRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + DAUYS_BATCH, DAUYS_POSTS.length))
        }
      },
      { root: feedRef.current, threshold: 0.1 }
    )
    observer.observe(sentinel.current)
    return () => observer.disconnect()
  }, [visibleCount])

  function toggleLike(i) {
    setLiked((prev) => {
      const next = new Set(prev)
      const wasLiked = next.has(i)
      wasLiked ? next.delete(i) : next.add(i)
      setLikeCounts((c) => ({ ...c, [i]: c[i] + (wasLiked ? -1 : 1) }))
      return next
    })
  }

  const visiblePosts = DAUYS_POSTS.slice(0, visibleCount)
  const hasMore = visibleCount < DAUYS_POSTS.length

  return (
    <div>
      {/* Приветствие */}
      <p className="mb-4" style={{ fontSize: 15, color: '#444653' }}>
        Добрый день, Каиржан. Сегодня — 1 июня, понедельник
      </p>

      {/* News Grid */}
      <section className="mb-6">
        {/* Заголовок + табы + пагинация */}
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1b22' }}>Новости</h2>
          <div className="flex items-center gap-2">
            {/* Табы */}
            <div className="flex items-center gap-1 bg-surface-container rounded-xl p-1">
              {NEWS_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setNewsTab(tab.key)}
                  className="px-3 py-1.5 rounded-lg font-semibold transition-all"
                  style={{
                    fontSize: 12,
                    background: newsTab === tab.key ? 'linear-gradient(135deg, #001752, #0038b8)' : 'transparent',
                    color: newsTab === tab.key ? '#fff' : '#4a4955',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Пагинация */}
            <a href="#" className="px-3 py-1.5 bg-white shadow-sm rounded-lg font-semibold hover:bg-surface-container transition-colors" style={{ fontSize: 12, color: '#444653' }}>
              Все
            </a>
            <button className="p-1.5 bg-white shadow-sm rounded-lg hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
            </button>
            <button className="p-1.5 bg-white shadow-sm rounded-lg hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
            </button>
          </div>
        </div>

        {(() => {
          const filtered = newsTab === 'all' ? ALL_NEWS : ALL_NEWS.filter(n => n.tab === newsTab)
          const featured = filtered.find(n => n.featured) ?? filtered[0]
          const secondary = filtered.filter(n => n !== featured).slice(0, 3)
          return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Featured */}
              <div className="md:col-span-2 group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow flex flex-col">
                <div className="relative overflow-hidden" style={{ height: 200 }}>
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={featured.img} alt={featured.title} />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded text-[11px] font-bold uppercase" style={{ background: 'rgba(255,255,255,0.9)', color: '#002068' }}>
                    {featured.category}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded text-[11px]" style={{ background: 'rgba(0,0,0,0.4)', color: '#fff' }}>
                    {featured.date}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-bold mb-2 group-hover:text-primary transition-colors leading-snug" style={{ fontSize: 17 }}>
                    {featured.title}
                  </h4>
                  {featured.text && <p style={{ fontSize: 13, color: '#444653', lineHeight: '20px' }}>{featured.text}</p>}
                  <div className="mt-auto pt-3 flex justify-end">
                    <span className="text-[12px] font-semibold text-primary hover:underline cursor-pointer">Читать →</span>
                  </div>
                </div>
              </div>

              {/* Secondary — flex колонка, каждая карточка flex-1 */}
              <div className="md:col-span-2 flex flex-col gap-3">
                {secondary.map(n => (
                  <div key={n.title} className="group cursor-pointer flex gap-3 bg-white p-3 rounded-xl shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow flex-1">
                    <div className="relative rounded-lg overflow-hidden shrink-0 self-stretch" style={{ width: 100, minHeight: 72 }}>
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={n.img} alt={n.title} />
                    </div>
                    <div className="flex-1 flex flex-col justify-center py-0.5">
                      <div className="text-[10px] font-bold uppercase mb-1" style={n.categoryStyle}>{n.category}</div>
                      <h4 className="font-bold group-hover:text-primary transition-colors mb-1 leading-snug" style={{ fontSize: 13 }}>{n.title}</h4>
                      <p style={{ fontSize: 11, color: 'rgba(68,70,83,0.6)' }}>{n.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}
      </section>

      {/* Discussions & Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ alignItems: 'start' }}>
        {/* BI Дауысы */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col" id="dauys-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2 font-bold" style={{ fontSize: 24 }}>
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>campaign</span>
              BI Дауысы
            </h3>
            <a href="#" className="font-semibold hover:underline" style={{ fontSize: 13, color: '#002068' }}>
              Все обсуждения
            </a>
          </div>

          <div
            ref={feedRef}
            className="space-y-0 flex-1 overflow-y-auto custom-scrollbar"
          >
            {visiblePosts.map((post, i) => (
              <div
                key={i}
                className={i < visiblePosts.length - 1 ? 'pb-6 mb-6 border-b border-outline-variant/30' : ''}
              >
                <div className="flex items-center gap-3 mb-3">
                  {post.img ? (
                    <img src={post.img} className="w-10 h-10 rounded-full object-cover" alt={post.name} />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold" style={{ fontSize: 15 }}>{post.name ?? 'Анонимно'}</p>
                    <p style={{ fontSize: 11, color: '#444653' }}>{post.time}</p>
                  </div>
                </div>
                <p className="mb-4 leading-relaxed" style={{ fontSize: 15, color: '#1a1b22' }}>
                  {post.text}
                </p>
                <div className="flex gap-6">
                  <button
                    onClick={() => toggleLike(i)}
                    className="flex items-center gap-2 transition-colors"
                    style={{ color: liked.has(i) ? '#dc2626' : '#444653' }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: 20,
                        fontVariationSettings: liked.has(i) ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      favorite
                    </span>
                    <span className="font-medium" style={{ fontSize: 13 }}>{likeCounts[i]}</span>
                  </button>
                  <button className="flex items-center gap-2 transition-colors" style={{ color: '#444653' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chat_bubble_outline</span>
                    <span className="font-medium" style={{ fontSize: 13 }}>
                      {post.comments} {post.comments === 1 ? 'ответ' : 'ответа'}
                    </span>
                  </button>
                  {post.photos && (
                    <div className="flex items-center gap-1 ml-1" style={{ color: '#747684' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>photo_camera</span>
                      <span style={{ fontSize: 12 }}>{post.photos}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {hasMore && <div ref={sentinel} style={{ height: 20 }} />}
          </div>

          <button className="w-full mt-6 py-3 rounded-xl font-bold text-white hover:opacity-90 transition-opacity" style={{ fontSize: 13, background: 'linear-gradient(135deg, #001752, #0038b8)' }}>
            Перейти в обсуждения
          </button>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6" id="right-col">
          {/* Quick Launch */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/20">
            <h3 className="font-semibold mb-6 flex items-center gap-2" style={{ fontSize: 18 }}>
              <span className="material-symbols-outlined text-primary">rocket_launch</span>
              Быстрый запуск
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_LAUNCH.map((item) => (
                <button
                  key={item.label}
                  className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-surface-container transition-colors group text-left"
                  style={{ background: 'rgba(0,32,104,0.04)' }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0" style={{ background: 'rgba(0,51,153,0.1)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 17 }}>{item.icon}</span>
                  </div>
                  <span className="font-medium leading-tight" style={{ fontSize: 12, color: '#1a1b22' }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Системы */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/20">
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ fontSize: 16 }}>
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>grid_view</span>
              Мои системы
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {EXTRA_SYSTEMS.map((sys) => (
                <a
                  key={sys.label}
                  href={sys.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-surface-container transition-colors group"
                  style={{ background: 'rgba(0,0,0,0.03)', textDecoration: 'none' }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0" style={{ background: sys.bg }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 17, color: sys.color }}>{sys.icon}</span>
                  </div>
                  <span className="font-medium leading-tight" style={{ fontSize: 12, color: '#1a1b22' }}>{sys.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Learning */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/20 flex-1">
            <h3 className="font-semibold mb-6 flex items-center gap-2" style={{ fontSize: 18 }}>
              <span className="material-symbols-outlined text-primary">auto_stories</span>
              Мое обучение
            </h3>
            <div className="space-y-6">
              {COURSES.map((course) => (
                <div key={course.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold" style={{ fontSize: 13 }}>{course.name}</span>
                    <span className="font-bold text-primary" style={{ fontSize: 11 }}>{course.pct}%</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${course.pct}%`, background: 'linear-gradient(90deg, #002068, #0040bf)' }}
                    />
                  </div>
                </div>
              ))}
              <button className="w-full py-2 font-bold rounded-xl text-white hover:opacity-90 transition-opacity mt-2" style={{ fontSize: 13, background: 'linear-gradient(135deg, #001752, #0038b8)' }}>
                Продолжить курс
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Дни рождения */}
      <section className="mt-6">
        <HorizontalPagedGrid
          title="Дни рождения"
          icon="cake"
          items={BIRTHDAYS}
          renderCard={(b) => (
            <div
              key={b.name}
              className="flex flex-col items-center gap-2 bg-white rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-all cursor-pointer"
              style={{ padding: '12px 6px', minWidth: 0, ...(b.today ? { borderColor: '#0038b8', background: 'linear-gradient(135deg, #eef2ff, #e8f0ff)' } : {}) }}
            >
              <div className="relative">
                <img src={b.img} alt={b.name} className="rounded-full object-cover flex-shrink-0" style={{ width: 56, height: 56 }} />
                {b.today && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full border-2 border-white flex items-center justify-center" style={{ fontSize: 10, width: 20, height: 20 }}>
                    🎂
                  </span>
                )}
              </div>
              <p className="font-semibold text-center leading-tight" style={{ fontSize: 11, color: '#1a1b22', width: '100%', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 28 }}>
                {b.name}
              </p>
              <p className="font-bold" style={{ fontSize: 11, color: b.today ? '#002068' : '#747684' }}>{b.when}</p>
              <button className="flex items-center justify-center gap-1 rounded-lg font-semibold transition-colors" style={{ fontSize: 10, whiteSpace: 'nowrap', width: '100%', padding: '4px 0', background: 'rgba(0,32,104,0.07)', color: '#002068' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>celebration</span>
                Поздравить
              </button>
            </div>
          )}
        />
      </section>

      {/* Клубы BI */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold flex items-center gap-2" style={{ fontSize: 20, color: '#1a1b22' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#002068' }}>diversity_1</span>
            Клубы BI
          </h2>
          <a href="#" className="font-semibold hover:underline" style={{ fontSize: 13, color: '#002068' }}>Все</a>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${BI_CLUBS.length}, 1fr)` }}>
          {BI_CLUBS.map((club) => (
            <div
              key={club.short}
              className="flex flex-col bg-white rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
            >
              {/* Лого */}
              <div className="flex items-center justify-center" style={{ background: club.bg, height: 80 }}>
                <img src={club.logo} alt={club.short} style={{ height: 56, width: 'auto', objectFit: 'contain' }} />
              </div>
              {/* Контент */}
              <div className="p-3 flex flex-col gap-1 flex-1">
                <p className="font-bold leading-tight" style={{ fontSize: 13, color: club.color }}>{club.short}</p>
                <p className="font-semibold leading-tight" style={{ fontSize: 11, color: '#1a1b22' }}>{club.name}</p>
                <p className="leading-snug mt-1" style={{ fontSize: 10, color: '#747684', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {club.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
