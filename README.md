# 🎯 QA Job Tracker Bot (v3.0.1 - STLC Architecture)

![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-blue?logo=telegram)
![Google Apps Script](https://img.shields.io/badge/Google_Apps_Script-Backend-green)
![Gemini AI](https://img.shields.io/badge/Gemini_API-AI-orange)
![AppSheet](https://img.shields.io/badge/AppSheet-Database_UI-blueviolet)

## 📌 Про проєкт
**QA Job Tracker Bot** — це кастомна CRM-система для автоматизації та відстеження процесу пошуку роботи. Версія 3.0.1 побудована за принципами **STLC (Software Testing Life Cycle)** та використовує підхід **Human-in-the-loop** (обов'язкова валідація дій ШІ людиною). Проєкт слугує майданчиком для практики забезпечення якості: написання тестової документації, E2E тестування API та роботи зі State Machines.

## 🛠 Технологічний стек
* **Backend:** Google Apps Script (Enterprise-модульна архітектура)
* **Database / UI:** Google Sheets + **AppSheet** ("Режим Бога" для прямого керування БД)
* **Integrations:** Telegram Bot API, Gemini API (з жорсткою типізацією JSON)
* **QA Tools:** Jira (Bug Tracking), Postman (API Testing), Draw.io (State Transitions), Qase.io (Test Management)

## 🚀 Ключовий функціонал
- **STLC Воронка (12+ етапів):** Гнучка маршрутизація від "Нової вакансії" до "Оферу" з можливістю скасування на будь-якому етапі.
- **Human-in-the-Loop & Date Blockers:** Жорстка валідація відповідей ШІ користувачем та блокування статусів (напр., "Інтерв'ю") без вказання дати/дедлайну.
- **Двовладдя (Telegram vs AppSheet):** Використання Telegram для первинного вводу даних (State Machine) та AppSheet як адміністративної панелі для прямого редагування БД без конфліктів логіки.
- **Cron Manager (Фонові задачі):** Дворівневий "Детектор гостингу" (нагадування через 7 днів ➡️ авто-архів через 3 дні), тайм-аути дедлайнів та автоматична мотивація.

---

## 🧪 QA Process & Testing (Процес тестування)
*Цей розділ демонструє підхід до тестування даного продукту.*

### 1. Тестова документація
- **State Transition Diagram:** Логіка переходів статусів вакансії та обробка скасувань.
![State Transition Diagram](docs/Vacancy_State_Transition.png)
- **Test Cases & Checklists:** [Посилання на Qase.io / таблицю] *(Тут буде лінк на твої тест-кейси)*
- **Postman Collection:** У папці `/api_testing` цього репозиторію лежить експортована колекція з налаштованими запитами до Telegram API для тестування відправки повідомлень та вебхуків.

### 2. Види проведеного тестування
- **Functional Testing:** Перевірка всіх User Flows, тест блокувальників дат (Date Blockers), робота дворівневого детектора тиші.
- **API Testing:** Перевірка відповідей від Telegram API та коректності парсингу JSON від Gemini API.
- **Database Testing:** Перевірка "снайперського запису" в Google Sheets, захист від затирання `ARRAYFORMULA`, перевірка синхронізації з AppSheet.
- **Negative Testing:** Перевірка стійкості системи до некоректних вводів (спроба переходу без дати, обробка спецсимволів та літер-двійників у тексті).

### 3. Баг-трекінг
Усі знайдені дефекти фіксувалися в **Jira**. Приклади оформлених Bug Reports можна переглянути тут: [Посилання на дошку Jira або PDF зі звітом].

---

## 📂 Архітектура (Бекенд)

🔗 **Детальний опис:** [Опис архітектури та логіки бота (User Flows)](docs/ARCHITECTURE.md)

Проєкт розбито на модулі за принципом єдиної відповідальності (SRP):
* `Config.gs` — Сховище констант, токенів та JSON-клавіатур.
* `Code.gs` — Вхідна точка (`doPost`), перевірка безпеки та розпізнавання `callback_query`.
* `Telegram.gs` — Сервісний модуль для відправки повідомлень та редагування меню.
* `AI.gs` — Інтеграція з Gemini API (`application/json`), захардкоджені еталонні Cover Letters.
* `Utils.gs` — Допоміжні функції, валідація дат, парсинг сайтів та перевірка дублікатів.
* `Logic.gs` — Ядро (Маршрутизатор). Обробка State Machine користувача.
* `Cron.gs` — Менеджер автономних фонових задач (нагадування, дедлайни, детектори).
* `Data.gs` — База мотиваційних цитат.

## 👤 Автор
**Віктор** - Junior QA Engineer
[LinkedIn] | [Telegram]