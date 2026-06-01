# ТЗ для бэкенд-разработчика — BILife Portal
**Версия:** 1.1 | **Дата:** июнь 2026

---

## 1. Общая архитектура

BILife — корпоративный портал-агрегатор. Бэкенд выступает единой точкой сбора данных из внешних систем и обслуживает фронтенд через REST API.

### Принцип интеграции: Push, не Pull

Внешние системы **сами отправляют** события на BILife через webhook.
BILife **не поллит** внешние системы периодически.

```
Unity BPM  ──┐
BILIM       ──┤──► POST /api/webhook/{source} ──► BILife DB ──► Frontend
1С HRMS    ──┤
Bagdar      ──┘
```

**Почему push:**
- Нет задержки — уведомление приходит мгновенно
- Нет лишней нагрузки — не опрашиваем 4 системы каждые N секунд
- Масштабируемо — подключение новой системы = добавить новый webhook handler

### Идентификатор пользователя

Единственный идентификатор пользователя во всей системе — **GUID физлица** из 1С HRMS.
Все таблицы используют `user_id UUID` = GUID физлица.
Внешние системы при отправке webhook передают `assignee_guid` = GUID физлица исполнителя.

---

## 2. База данных

### 2.1 Таблица задач

```sql
CREATE TABLE tasks (
  id              BIGSERIAL PRIMARY KEY,
  external_id     VARCHAR(255) NOT NULL,        -- ID задачи во внешней системе
  source          VARCHAR(50)  NOT NULL,         -- 'unity_bpm' | 'bilim' | '1c_hrms' | 'bagdar'
  process_name    VARCHAR(500) NOT NULL,         -- название процесса
  doc_number      VARCHAR(100),                  -- номер документа
  status          VARCHAR(100) NOT NULL,         -- 'Согласование'|'Подписать'|'Исполнить'|'Ознакомиться'
  assignee_id     UUID NOT NULL,                 -- GUID физлица исполнителя
  created_at_src  TIMESTAMPTZ,                   -- дата создания в источнике
  deadline        TIMESTAMPTZ,                   -- срок исполнения
  deep_link       VARCHAR(500),                  -- прямая ссылка на задачу в источнике
  fields          JSONB DEFAULT '[]',            -- динамические поля процесса
  actions         JSONB DEFAULT '[]',            -- доступные действия
  attachments     JSONB DEFAULT '[]',            -- вложения
  is_completed    BOOLEAN DEFAULT FALSE,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(source, external_id)
);

CREATE INDEX idx_tasks_assignee    ON tasks(assignee_id);
CREATE INDEX idx_tasks_source      ON tasks(source);
CREATE INDEX idx_tasks_completed   ON tasks(is_completed);
CREATE INDEX idx_tasks_created_at  ON tasks(created_at DESC);
```

### 2.2 Таблица уведомлений

Таблица `notifications` уже существует в системе. Необходимо убедиться что в ней присутствуют следующие колонки. Если каких-то нет — добавить миграцией:

```sql
-- Проверить наличие колонок, добавить недостающие:
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS type    VARCHAR(50),   -- 'task' | 'mention' | 'news'
  ADD COLUMN IF NOT EXISTS source  VARCHAR(50),   -- 'unity_bpm' | 'bilim' | 'bagdar' | 'dauys'
  ADD COLUMN IF NOT EXISTS task_id BIGINT REFERENCES tasks(id),
  ADD COLUMN IF NOT EXISTS link    VARCHAR(500);  -- deep link внутри портала

-- Индексы если отсутствуют:
CREATE INDEX IF NOT EXISTS idx_notif_user_id    ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_is_read    ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notif_created_at ON notifications(created_at DESC);
```

### 2.3 Настройки уведомлений пользователя

```sql
CREATE TABLE notification_settings (
  user_id             UUID PRIMARY KEY,          -- GUID физлица
  notify_news         BOOLEAN DEFAULT TRUE,
  notify_suggestions  BOOLEAN DEFAULT TRUE,
  notify_tasks        BOOLEAN DEFAULT TRUE,
  notify_mentions     BOOLEAN DEFAULT TRUE,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.4 Счётчики по системам (кэш)

```sql
CREATE TABLE system_counters (
  user_id    UUID NOT NULL,                      -- GUID физлица
  source     VARCHAR(50) NOT NULL,               -- 'unity_bpm' | 'bilim' | 'bagdar'
  count      INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (user_id, source)
);
```

Обновляется при каждом входящем webhook и при выполнении задачи.

### 2.5 Маппинг внешних идентификаторов

Нужен только если внешняя система передаёт свой внутренний ID вместо GUID физлица.
Если система передаёт GUID физлица напрямую — эта таблица не задействуется.

```sql
CREATE TABLE user_integrations (
  id              BIGSERIAL PRIMARY KEY,
  user_id         UUID NOT NULL,                 -- GUID физлица
  source          VARCHAR(50) NOT NULL,           -- система-источник
  external_id     VARCHAR(255) NOT NULL,          -- внутренний ID в этой системе

  UNIQUE(source, external_id)
);

CREATE INDEX idx_user_int_user_id ON user_integrations(user_id);
```

### 2.6 Аналитика событий

```sql
CREATE TABLE events (
  id          BIGSERIAL PRIMARY KEY,
  event       VARCHAR(100) NOT NULL,
  category    VARCHAR(100),
  label       VARCHAR(255),
  value       INTEGER,
  user_id     UUID NOT NULL,                     -- GUID физлица
  session_id  UUID NOT NULL,
  page        VARCHAR(255),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_event      ON events(event);
CREATE INDEX idx_events_user_id    ON events(user_id);
CREATE INDEX idx_events_created_at ON events(created_at);
```

---

## 3. Webhook эндпоинты (входящие от систем)

### 3.1 Эндпоинт приёма событий

```
POST /api/webhook/{source}
Headers:
  X-Webhook-Secret: {shared_secret}   ← каждая система имеет свой секрет
  Content-Type: application/json
```

**Тело запроса (универсальный формат):**
```json
{
  "event": "task.created",
  "task": {
    "external_id":    "TASK-00487",
    "process_name":   "Табель учёта рабочего времени ГПХ",
    "doc_number":     "№ ТАБ-2026-00487",
    "status":         "Согласование",
    "assignee_guid":  "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "created_at":     "2026-05-26T09:14:00Z",
    "deadline":       "2026-05-31T18:00:00Z",
    "deep_link":      "https://bpm.bi.group/tasks/TASK-00487",
    "fields": [
      { "label": "Период",        "value": "Май 2026" },
      { "label": "Подразделение", "value": "ДС Цифровые сервисы" },
      { "label": "Сумма",         "value": "150 000 ₸" }
    ],
    "actions": [
      { "label": "Согласовать", "action": "approve" },
      { "label": "Отказать",    "action": "reject"  }
    ],
    "attachments": [
      { "name": "табель_май.pdf", "url": "https://bpm.bi.group/files/..." }
    ]
  }
}
```

**Поддерживаемые события:**
| event | Действие в BILife |
|-------|------------------|
| `task.created` | Создать задачу + уведомление + обновить счётчик |
| `task.updated` | Обновить поля задачи (status, fields, deadline) |
| `task.completed` | Установить is_completed = true, обновить счётчик |
| `task.recalled` | Удалить из активных, обновить счётчик |

**Алгоритм обработки:**
1. Валидировать `X-Webhook-Secret`. Неверный — вернуть 401.
2. `user_id` = `assignee_guid` из тела запроса (GUID физлица напрямую).
3. Если система передаёт свой внутренний ID вместо GUID — найти через `user_integrations`.
4. Upsert в таблицу `tasks` по паре `(source, external_id)`.
5. Обновить `system_counters` для данного `user_id` и `source`.
6. Создать запись в `notifications`.
7. Вернуть `{ "ok": true }` — **всегда 200**. Источник не должен знать о наших внутренних ошибках.

---

## 4. API для фронтенда

Идентификация текущего пользователя происходит автоматически через SSO-сессию (Keycloak).
SSO токен хранится в **httpOnly cookie**, в заголовках запросов не передаётся.
Бэкенд читает cookie, определяет GUID физлица и использует его как `user_id` во всех запросах.

### 4.1 Задачи

```
GET /api/tasks?status=active&page=1&limit=10
GET /api/tasks?status=completed&page=1&limit=10
GET /api/tasks/{id}
```

**Ответ GET /api/tasks:**
```json
{
  "total": 7,
  "items": [
    {
      "id":           1,
      "source":       "unity_bpm",
      "source_label": "Unity BPM",
      "process_name": "Табель учёта рабочего времени ГПХ",
      "doc_number":   "№ ТАБ-2026-00487",
      "status":       "Согласование",
      "created_at":   "2026-05-26T09:14:00Z",
      "deadline":     "2026-05-31T18:00:00Z",
      "deep_link":    "https://bpm.bi.group/tasks/TASK-00487",
      "fields":       [...],
      "actions":      [...],
      "attachments":  [...]
    }
  ]
}
```

```
POST /api/tasks/{id}/action
Body: { "action": "approve", "comment": "Согласовано" }
```

**Алгоритм POST /tasks/{id}/action:**
1. Найти задачу в нашей БД.
2. Получить сервисный токен для API источника (см. раздел 5).
3. Проксировать действие в API источника.
4. Если источник вернул успех — `is_completed = true`, обновить `system_counters`.
5. Вернуть результат фронтенду.

### 4.2 Счётчики для сайдбара

```
GET /api/counters
```

```json
{
  "unity_bpm":     4,
  "bilim":         3,
  "bagdar":        1,
  "total_waiting": 7
}
```

Данные из `system_counters` — без запросов во внешние системы.

### 4.3 Уведомления

```
GET  /api/notifications?page=1&limit=20
PATCH /api/notifications/read-all
PATCH /api/notifications/{id}/read
```

### 4.4 Настройки уведомлений

```
GET   /api/settings/notifications
PATCH /api/settings/notifications
Body: { "notify_news": true, "notify_suggestions": false }
```

### 4.5 Аналитика

```
POST /api/analytics
Body: { "event": "click", "category": "quick_launch", "label": "На отпуск", "page": "/" }
```

Всегда 200. Запись в БД — асинхронно.

---

## 5. Авторизация между системами

Keycloak используется для авторизации пользователей — детали реализации на стороне Keycloak.

Для взаимодействия BILife с API внешних систем (проксирование действий по задачам) используется **сервисный аккаунт**:

```
BILife Backend ──► POST {bpm_api}/tasks/{id}/action
Headers:
  Authorization: Bearer {service_account_token}
  Content-Type: application/json
```

- Сервисный токен получается через client credentials flow в Keycloak.
- Токен кэшируется на бэкенде и обновляется до истечения.
- Каждая внешняя система предоставляет отдельный scope/роль для сервисного аккаунта BILife.
- Пользовательский SSO токен **не передаётся** во внешние системы.

---

## 6. Подписание через ЭЦП

ЭЦП реализуется полностью на стороне Unity BPM, не в BILife.

1. Пользователь нажимает «Открыть в Unity BPM» в карточке задачи.
2. Задача открывается по `deep_link` в BPM.
3. Пользователь подписывает через NCALayer внутри BPM.
4. BPM присылает webhook `task.completed` в BILife.
5. BILife обновляет счётчик и помечает задачу выполненной.

**Бэкенд BILife ничего дополнительно не реализует для ЭЦП.**

---

## 7. Требования к внешним системам

| # | Требование | Примечание |
|---|-----------|-----------|
| 1 | Передавать `assignee_guid` = GUID физлица в webhook | Если невозможно — предоставить маппинг своего ID → GUID |
| 2 | Shared secret для валидации webhook | Генерирует BILife, передаётся системе |
| 3 | Эндпоинт для приёма действий (approve/reject) | Вызывается сервисным аккаунтом BILife |
| 4 | Предоставить роль/scope для сервисного аккаунта BILife в Keycloak | Для авторизации при проксировании |
| 5 | Deep link формат для открытия задачи | Передаётся в каждом webhook |
| 6 | Список возможных статусов задач | Для корректной цветовой маркировки |

**Особенности по системам:**

| Система | assignee_guid | Кнопка «Открыть» | ЭЦП |
|---------|--------------|-----------------|-----|
| Unity BPM | GUID физлица | Да, iframe | Через BPM |
| BILIM | GUID физлица | Да, iframe | Нет |
| Bagdar | GUID физлица | Да, новая вкладка | Нет |
| 1С HRMS | GUID физлица (родная) | Нет (терминал) | Нет |

---

## 8. Нефункциональные требования

| Параметр | Значение |
|----------|---------|
| Время ответа API (p95) | < 200 мс |
| Время обработки webhook | < 500 мс |
| Доступность | 99.5% |
| Хранение уведомлений | 90 дней |
| Хранение аналитики | 365 дней |
| Webhook retry при ошибке | 3 попытки с экспоненциальной задержкой |
| Максимальный размер webhook | 1 МБ |
