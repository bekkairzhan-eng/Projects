# Аналитика событий — BILife
## Техническое задание

---

## 1. Цель

Собирать данные о поведении пользователей внутри портала без внешних сервисов.
Хранить события в собственной БД, строить дашборды через Metabase.

---

## 2. Структура таблицы событий

```sql
CREATE TABLE events (
  id          BIGSERIAL PRIMARY KEY,
  event       VARCHAR(100)  NOT NULL,      -- тип события
  category    VARCHAR(100),                -- раздел портала
  label       VARCHAR(255),                -- уточнение (что именно нажали)
  value       INTEGER,                     -- числовое значение (если нужно)
  user_id     UUID          NOT NULL,      -- ID сотрудника
  session_id  UUID          NOT NULL,      -- ID сессии (генерируется при входе)
  page        VARCHAR(255),                -- текущий URL / раздел
  created_at  TIMESTAMPTZ   DEFAULT NOW()
);

-- Индексы для быстрых выборок
CREATE INDEX idx_events_event      ON events(event);
CREATE INDEX idx_events_user_id    ON events(user_id);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_category   ON events(category);
```

---

## 3. API

```
POST /api/analytics
Content-Type: application/json
Authorization: Bearer {token}

{
  "event":    "click",
  "category": "quick_launch",
  "label":    "На отпуск",
  "value":    null,
  "page":     "/"
}
```

**Ответ:**
```json
{ "ok": true }
```

Запрос всегда возвращает 200 — аналитика не должна ломать UI при сбое.
На фронте обёртка:

```js
function track(event, category, label, value = null) {
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, category, label, value, page: window.location.pathname }),
  }).catch(() => {}) // тихий фейл
}
```

---

## 4. События для трекинга

### 4.1 Навигация

| event | category | label | Когда |
|-------|----------|-------|-------|
| `page_view` | `navigation` | название раздела | При каждом переходе в раздел |
| `sidebar_collapse` | `navigation` | `collapse` / `expand` | Кнопка сворачивания сайдбара |
| `sidebar_item_click` | `navigation` | название пункта меню | Клик по любому пункту |

---

### 4.2 Мой день

| event | category | label | Когда |
|-------|----------|-------|-------|
| `widget_click` | `my_day` | `waiting_tasks` | Клик на «Ждут меня» |
| `widget_click` | `my_day` | `active_tasks` | Клик на «Активные» |

> **Бизнес-смысл:** если «Ждут меня» кликают чаще всего — задачи важнее новостей, стоит вынести их выше.

---

### 4.3 Новости

| event | category | label | Когда |
|-------|----------|-------|-------|
| `news_tab_click` | `news` | `all` / `news` / `suggestions` / `surveys` | Переключение вкладки |
| `news_card_click` | `news` | заголовок новости | Клик на карточку |
| `news_pagination` | `news` | `prev` / `next` | Стрелки пагинации |
| `news_all_click` | `news` | — | Кнопка «Все» |

> **Бизнес-смысл:** какая вкладка популярнее — туда больше контента. Какие новости кликают — ориентир для редакции.

---

### 4.4 Быстрый запуск

| event | category | label | Когда |
|-------|----------|-------|-------|
| `quick_launch_click` | `quick_launch` | название кнопки | Клик на любую кнопку |

> **Бизнес-смысл:** какие процессы запускают чаще — поднять их выше или добавить ещё.

---

### 4.5 Задачи

| event | category | label | Когда |
|-------|----------|-------|-------|
| `tasks_drawer_open` | `tasks` | `bell` / `waiting_widget` / `all_button` | Откуда открыли drawer |
| `task_action` | `tasks` | `approve` / `reject` / `sign` / `read` / `survey` | Кнопка действия по задаче |
| `task_action` | `tasks` | название процесса (label2) | Дополнительно — какой именно документ |

> **Бизнес-смысл:** сколько задач согласуют vs отклоняют. Откуда чаще открывают drawer — через виджет или колокольчик.

---

### 4.6 BI Дауысы

| event | category | label | value | Когда |
|-------|----------|-------|-------|-------|
| `post_like` | `dauys` | `like` / `unlike` | ID поста | Лайк/снять лайк |
| `post_view` | `dauys` | — | номер поста в ленте | Пост попал во viewport |
| `dauys_scroll_depth` | `dauys` | `batch_2` / `batch_3`... | номер батча | Подгрузка новой порции |
| `dauys_all_click` | `dauys` | — | — | Кнопка «Перейти в обсуждения» |

> **Бизнес-смысл:** до какого поста долистывают — оптимальная длина ленты. Какие посты лайкают — понять интересы аудитории.

---

### 4.7 Уведомления

| event | category | label | Когда |
|-------|----------|-------|-------|
| `notif_panel_open` | `notifications` | — | Клик на колокольчик |
| `notif_mark_all_read` | `notifications` | — | Кнопка «Отметить все» |
| `notif_click` | `notifications` | `task` / `mention` / `news` | Клик на конкретное уведомление |
| `notif_news_toggle` | `notifications` | `on` / `off` | Чекбокс «Получать новости» |

---

### 4.8 Дни рождения и Назначения

| event | category | label | Когда |
|-------|----------|-------|-------|
| `birthday_congrats` | `birthdays` | имя сотрудника | Кнопка «Поздравить» |
| `birthday_pagination` | `birthdays` | `prev` / `next` | Стрелки |
| `appointments_pagination` | `appointments` | `prev` / `next` | Стрелки |

---

### 4.9 Клубы BI

| event | category | label | Когда |
|-------|----------|-------|-------|
| `club_click` | `clubs` | название клуба | Клик на карточку |

---

### 4.10 Рабочие системы (сайдбар)

| event | category | label | Когда |
|-------|----------|-------|-------|
| `system_open` | `systems` | `Unity BPM` / `BILIM` / `Bagdar` и др. | Переход в систему через iframe |

---

## 5. Сессия

При входе пользователя генерируется `session_id` (UUID) и хранится в `sessionStorage`.
Сессия завершается при закрытии вкладки или по таймауту 30 минут бездействия.

```js
function getSessionId() {
  let sid = sessionStorage.getItem('bi_session_id')
  if (!sid) {
    sid = crypto.randomUUID()
    sessionStorage.setItem('bi_session_id', sid)
  }
  return sid
}
```

---

## 6. Дашборды в Metabase (первая очередь)

| Дашборд | Вопрос |
|---------|--------|
| Топ-5 кнопок быстрого запуска | Что запускают чаще всего |
| Воронка задач | Открыл drawer → увидел задачу → согласовал / отклонил |
| Глубина прокрутки Дауысы | До какого поста листают |
| Популярность вкладок новостей | Лента vs Новости vs Предложения vs Опросы |
| DAU / WAU по разделам | Какие разделы живые, какие мёртвые |
| Время до первого действия | Сколько секунд от входа до первого клика |

---

## 7. Приоритет внедрения

| Приоритет | Что | Почему |
|-----------|-----|--------|
| 🔴 Высокий | Задачи (action, drawer_open) | Прямо влияет на бизнес-процессы |
| 🔴 Высокий | Быстрый запуск | Показывает какие процессы нужны |
| 🟡 Средний | Новости (вкладки, клики) | Помогает редакции |
| 🟡 Средний | Дауысы (лайки, глубина) | Понять вовлечённость |
| 🟢 Низкий | Дни рождения, клубы | Nice to have |

