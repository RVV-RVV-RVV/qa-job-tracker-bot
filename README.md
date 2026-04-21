# 🎯 QA Job Tracker Bot (v3.0.4 - Streamlined Flow & Follow-up Manager)

![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-blue?logo=telegram)
![Google Apps Script](https://img.shields.io/badge/Google_Apps_Script-Backend-green)
![Gemini AI](https://img.shields.io/badge/Gemini_API-AI-orange)
![AppSheet](https://img.shields.io/badge/AppSheet-Database_UI-blueviolet)

> 💡 **Демонстрація роботи бота:**
> *(Тут буде  GIF-анімація.)*

## 📌 Про проєкт
**QA Job Tracker Bot** — це кастомна мікро-CRM система для автоматизації процесу пошуку роботи. Версія 3.0.4 побудована за принципами **STLC (Software Testing Life Cycle)** та використовує підхід **Human-in-the-loop** (обов'язкова валідація дій ШІ людиною). 

Проєкт створено не лише для оптимізації рутини, а й як **майданчик для практики QA**: забезпечення цілісності даних (Data Integrity) при синхронізації БД, написання тестової документації, E2E тестування Webhooks та роботи зі State Machines.

## 🛠 Технологічний стек
* **Backend:** Google Apps Script (Enterprise-модульна архітектура)
* **Database / UI:** Google Sheets + **AppSheet** ("God Mode" для прямого керування БД)
* **Integrations:** Telegram Bot API, Gemini API (суворий JSON-парсинг)
* **QA Tools:** Jira (Bug Tracking), Postman (API Testing), Draw.io (State Transitions), Qase.io (Test Management)

## 🚀 Ключові інженерні рішення
- **Двовладдя (Telegram vs AppSheet) та "Авто-Двірник":** Telegram слугує фронтендом для вводу даних, а AppSheet — адмін-панеллю. Спеціальний скрипт-двірник (`Utils.gs`) відстежує ручні зміни через AppSheet і автоматично форматує та архівує відхилені вакансії, зберігаючи цілісність БД.
- **AI-Driven Follow-up Manager:** ШІ класифікує відповіді рекрутерів за 12+ STLC етапами, генерує персоналізовані тексти для фоллоу-апів (зберігаючи контекст вакансії) та пропонує драфти відповідей на відмови чи тестові завдання.
- **Human-in-the-Loop & Date Blockers:** Жорстка валідація звітів ШІ користувачем. Система блокує переходи на етапи типу "Інтерв'ю" чи "Тестове", якщо парсер не знайшов дедлайн або дату події.
- **Дворівневий Детектор Гостингу (Cron):** Фаза 1 — soft-нагадування після 7 днів тиші. Фаза 2 — hard ghosting (авто-архівація вакансії через 3 дні після відправки фоллоу-апу).

---

## 🧪 QA Process & Testing (Процес тестування)
*Цей розділ демонструє підхід до забезпечення якості продукту.*

### 1. Тестова документація
- **State Transition Diagram:** [Логіка переходів статусів (Mermaid)](docs/Vacancy_State_Transition.md)
- **Test Plan & E2E Scenarios:** Детальний [регресійний тест-план](testing/TEST_PLAN.md) із покриттям Date Blockers та Cron-задач.
- **Postman API Automation:** У папці `testing/API` лежить колекція для перевірки безпеки вебхука (імітація доступу з чужих ID, health-check порожніх запитів).

### 2. Види проведеного тестування
- **API Testing:** Тестування Webhooks Телеграму (E2E тести воронки, перевірка сек'юріті-блокувань).
- **Database Testing & Data Integrity:** Перевірка "снайперського запису" в Google Sheets, захист від затирання масивів `ARRAYFORMULA`, тестування консистентності даних при одночасній роботі через Telegram та AppSheet.
- **Functional Testing:** Перевірка всіх User Flows, тест Date Blockers, робота багаторівневих Cron-тригерів.
- **Negative Testing:** Стійкість системи до некоректних вводів (спроба переходу без дати, обробка спецсимволів у тексті, обхід анти-парсинг захисту).

### 3. Баг-трекінг
Усі знайдені дефекти фіксуються в **Jira**.

---

## 📂 Архітектура (Бекенд)
🔗 **Детальний опис:** [Опис архітектури та глобальних правил](docs/ARCHITECTURE.md)

Проєкт розбито на модулі за принципом єдиної відповідальності (SRP):
* `Config.gs` — Сховище констант, токенів та JSON-клавіатур.
* `Code.gs` — Вхідна точка (`doPost`), сек'юріті-перевірка ID.
* `Telegram.gs` — Сервісний модуль для відправки повідомлень.
* `AI.gs` — Інтеграція з Gemini API, генерація Cover Letters та Follow-ups.
* `Utils.gs` — Утиліти: "Авто-двірник", валідація дат, `autoSortSheet`, анти-дублікати.
* `Logic.gs` — Ядро (Маршрутизатор). Обробка State Machine користувача.
* `Cron.gs` — Менеджер автономних фонових задач (нагадування, дедлайни, детектори).
* `Data.gs` — База мотиваційних цитат та промптів.

## 👤 Автор
**Віктор Роженко** - Junior QA Engineer
[LinkedIn](https://www.linkedin.com/in/rvv-rvv) | [Telegram](https://t.me/RVV_RVV)