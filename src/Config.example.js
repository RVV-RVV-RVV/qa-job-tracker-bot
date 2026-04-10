// QA Job Tracker Bot - Config Skeleton (v3.0.1)
// УВАГА: Це шаблон. Реальні ключі знаходяться у файлі Config.js, який додано до .gitignore для безпеки.

// 1. Токени та Ключі
var BOT_TOKEN = "YOUR_BOT_TOKEN_HERE";
var GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";
var APPSHEET_API_KEY = "YOUR_APPSHEET_API_KEY_HERE"; // Для webhook-інтеграцій (опціонально)

// 2. Ідентифікатори Google Sheets
var SHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";
var SHEET_NAME = "Job-трекер";
var ARCHIVE_SHEET_NAME = "Архів"; 

// 3. Безпека (White-list)
var MY_TELEGRAM_ID = 123456789;

// 4. Дані для ШІ
var MY_BACKGROUND = "Тут текст бекграунду кандидата для генерації Cover Letters";

// 5. JSON Клавіатури (Меню бота)
var MAIN_MENU = { "keyboard": [[{"text": "Аналіз відповіді 📩"}, {"text": "Вакансія 💼"}], [{"text": "Статистика 📊"}, {"text": "✅ Відправив фоллоу-ап"}]], "resize_keyboard": true };
var VACANCY_MENU = { "keyboard": [[{"text": "URL на вакансію"}, {"text": "Cover Letter"}], [{"text": "повернутися на початок"}]], "resize_keyboard": true };
var CANCEL_MENU = { "keyboard": [[{"text": "❌ Скасувати"}]], "resize_keyboard": true };
var CONTINUE_MENU = { "keyboard": [[{"text": "Гоу далі 🚀"}, {"text": "Залишимо на потім ⏸️"}]], "resize_keyboard": true };
var DUPLICATE_COMPANY_MENU = { "keyboard": [[{"text": "❌ Відмінити"}, {"text": "✅ Все ж таки додати ще одну"}]], "resize_keyboard": true };
var RESUME_SENT_MENU = { "keyboard": [[{"text": "❌ Скасувати"}, {"text": "✅ Резюме надіслав"}]], "resize_keyboard": true };
var CHANNEL_MENU = { "keyboard": [[{"text": "Telegram"}, {"text": "Viber"}], [{"text": "Gmail"}, {"text": "На платформі"}], [{"text": "❌ Скасувати"}]], "resize_keyboard": true };

// ОНОВЛЕНО ЗГІДНО З v3.0.1 (Human-in-the-loop)
var VALIDATION_MENU = { "keyboard": [[{"text": "✅ Так, записуй"}, {"text": "✏️ Виправити"}]], "resize_keyboard": true };