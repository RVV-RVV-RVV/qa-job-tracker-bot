%% QA Job Tracker Bot v3.0.1 - Detailed Logical & Architectural Flow Diagram
%% Component Interaction combined with Detailed User/System Activities

activityDiagram
|User (Telegram App)|
start
:Ввід URL вакансії або Сирого Тексту;
|GAS Code.gs (doPost)|
:Security Check (My ID White-list);
|GAS Logic.gs (Logic Branch A)|
if (Перевірка дубліката URL (Utils.gs)) then (Знайдено в Архіві/Активній БД)
  |User (Telegram App)|
  :Пуш: "🚨 УВАГА! Ця компанія в АРХІВІ/БАЗІ... Точно хочеш податися знову?";
  if (Вибір: `❌ Відмінити`) then (Відміна)
    |GAS Logic.gs (Logic Branch A)|
    :Скидання State Machine (CacheService.remove);
    stop
  else (Вибір: `✅ Все ж таки додати...`)
    :Продовження флоу подачі;
  endif
else (Не знайдено)
endif
|GAS AI.gs|
:AI Парсинг сайту/тексту;
:AI STLC Аналіз & Генерування Cover Letter (UK/EN JSON);
|User (Telegram App)|
:Вивід звіту ШІ: ЗП, Посада, Аналіз, Листи;
:Клавіатура: `[Гоу далі 🚀]`, `[Залишимо на потім ⏸️]`, `[❌ Скасувати]`;
if (Вибір користувача) then (`Залишимо на потім` / `❌ Скасувати`)
  |GAS Logic.gs (Logic Branch A)|
  :Скидання State Machine (CacheService.remove);
  |GAS Utils.gs|
  :`autoSortSheet` (Сортування БД за пріоритетом `D` ArrayFormula);
  stop
else (`Гоу далі 🚀`)
  |User (Telegram App)|
  :Запит: "💰 Фінансовий етап! Яка твої очікувана ЗП?";
  :Ввід ЗП вручну;
  |GAS Logic.gs (Logic Branch A)|
  :Снайперський запис у Sheets стовпця J (10);
  :Sheets (Job-трекер) Status = `нова вакансія`;
  :Глобальна валідація ШІ (`VALIDATION_MENU`);
  |User (Telegram App)|
  :Перевірка звіту ШІ користувачем (`Human-in-the-loop`);
  :Клавіатура: `[✅ Так, записуй]` або `[✏️ Виправити]`;
  if (Вибір користувача) then (`✏️ Виправити`)
    :User inputs corrected validated text manually;
    |GAS Logic.gs (Logic Branch A)|
    :Accept correction (parseValidationText);
    :Update Cache with fixed data;
  else (`✅ Так, записуй`)
  endif
  |GAS Logic.gs (Logic Branch A)|
  :Бот: "Зрозумів. Який канал зв'язку?";
  |User (Telegram App)|
  :Вибір Каналу (`Telegram`, `Viber`, `Gmail`, `На платформі`);
  |GAS Logic.gs (Logic Branch A)|
  :Запит: "Додати Нотатки?";
  |User (Telegram App)|
  :Ввід Нотаток вручну;
  |GAS Logic.gs (Logic Branch A)|
  :Sheets Status updated: Status = `Надіслано відгук`;
  :H Column (Дата контакту) = Today (new Date());
  |GAS Utils.gs|
  :`autoSortSheet` (Сортування БД за пріоритетом `D` ArrayFormula);
endif
|User (Telegram App)|
:Пуш: "✅ Статус Надіслано відгук (Старт, запускається пасивний таймер F)";
stop

%% ---
%% Branch B: Reply Input Flow

activityDiagram
|User (Telegram App)|
start
:Натиснути кнопку `Аналіз відповіді 📩`;
:Копіпаст тексту від рекрутера;
|GAS Code.gs (doPost)|
:Security Check (My ID White-list);
|GAS AI.gs|
:AI STLC Аналіз тексту: Новий статус, Дати, Дедлайни (JSON);
|User (Telegram App)|
:Вивід звіту ШІ (новий STLC етап воронки);
:Клавіатура: `[✅ Так, продовжуй]` або `[❌ Ні, є помилка]`;
if (Вибір користувача (`Human-in-the-loop`)) then (`❌ Ні, є помилка`)
  |User (Telegram App)|
  :Input corrected validated text manually;
  |GAS Logic.gs (Branch B)|
  :AI re-analyzes validated text;
else (`✅ Так, продовжуй`)
endif
|GAS Logic.gs (Branch B)|
:ВАЛІДАЦІЯ + Date Blocker (TC-14);
if (Розпізнано подію (напр. Технічна) & dateTime пусте?) then (Так, блокувати)
  |User (Telegram App)|
  :Бот: "⚠️ Увага: Етап передбачає подію, але ШІ не знайшов дату. Натисніть '✏️ Виправити'...";
  |GAS Logic.gs (Branch B)|
  :Wait for user correction (Loop back to val menu);
  stop
else (Ні, дата є або події нема)
endif
if (Назва компанії пуста (ШІ не знайшов)? (TC-11)) then (Так, пуста)
  |User (Telegram App)|
  :Бот: "ШІ не зміг знайти назву компанії. Оберіть її з активних:";
  :Інлайн-клавіатура active companies;
  :User selects via inline button;
else (Ні, компанія є)
endif
|GAS Logic.gs (Branch B)|
if (Status = `Офер`/`Переговори`?) then (Так)
  |User (Telegram App)|
  :Запит: "💰 Фінансовий етап! Яка тепер ЗП?" (`KEEP_SALARY_MENU`);
  :Ввід нової ЗП вручну;
  |GAS Logic.gs (Branch B)|
  :update Sheet column J (10);
else (Ні)
endif
if (Status = `Очікування фідбеку` after ТЗ? (TC-04)) then (Так)
  |User (Telegram App)|
  :Запит: "Надішліть лінк на виконане ТЗ (Git/Docs)?";
  :Ввід лінка вручну;
  |GAS Logic.gs (Branch B)|
  :update Sheet column P (16);
else (Ні)
endif
|GAS Logic.gs (Branch B)|
:Sheets (Job-трекер/Архів) updated;
:M column (Notes) updated with marker `відправили запит-уточнення` if FU sent;
|GAS Utils.gs|
:`autoSortSheet` (Сортування БД за пріоритетом `D` ArrayFormula);
stop

%% ---
%% Branch C: Admin Mode Loop

activityDiagram
|AppSheet (God Mode)|
start
:User edits Sheet directly;
|Google Sheets (DataBase)|
:Status Changed in DB;
|GAS Code.gs (doPost)|
:Webhook e.postData.contents IS empty;
|GAS Utils.gs|
:`autoSortSheet` (Сортування БД за пріоритетом `D` ArrayFormula);
stop

%% ---
%% Branch D: Cron Autonomous Tasks Loop

activityDiagram
|Time-driven Triggers (Cron Manager)|
start
:checkRemindersCron (Вт та Пт о 12:00);
|GAS Utils.gs|
:Scan H Column (Дата контакту) >= 7 днів;
:Check U Column IS empty (No Deadline);
|User (Telegram App)|
:Фаза 1: Пуш: "⏰ НАГАДУВАННЯ про тишу! Список компаній:";
:Inline `[Відправив фоллоу-ап]` button;
if (User clicks `[Відправив фоллоу-ап]`) then (Так)
  |GAS Logic.gs (doPost callback)|
  :Add marker `відправили запит-уточнення` to Notes M (13);
  :H column (Дата контакту) = Today;
  |GAS Utils.gs|
  :`autoSortSheet`;
else (Ні)
endif
:Next cron run;
|GAS Utils.gs|
:Scan marker `відправили запит-уточнення` in Notes M;
:Scan H Column (Дата контакту) >= 3 дні;
if (Фаза 2 Complete?) then (Так)
  |GAS Logic.gs (Branch D)|
  :Sheets (Архів) updated Status = `Відмова (Загостили)`;
  :Sheets (Job-трекер) Row deleted;
  |User (Telegram App)|
  :Пуш: "⛔️ Авто-архів: Відмова (Загостили)";
  |GAS Utils.gs|
  :`autoSortSheet`;
else (Ні)
endif
stop