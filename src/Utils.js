/**
 * Файл: Utils.gs
 * Проєкт: QA Job Tracker Bot (v3.0 STLC Architecture)
 * Призначення: Допоміжні утиліти. Перевірка дублікатів, парсинг сайтів, 
 * а також головна функція безпечного автосортування (яка не затирає ARRAYFORMULA).
 */

function checkUrlDuplicate(urlToFind) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    var data = sheet.getRange("E2:E" + Math.max(sheet.getLastRow(), 2)).getValues();
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().trim() === urlToFind.trim()) return true;
    }
    return false;
  } catch (e) { return false; }
}

function checkCompanyDuplicate(companyToFind) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    var data = sheet.getRange("A2:H" + Math.max(sheet.getLastRow(), 2)).getValues();
    var results = [];
    var searchName = companyToFind.toString().toLowerCase().trim();
    
    for (var i = 0; i < data.length; i++) {
      var compName = data[i][1] ? data[i][1].toString().toLowerCase().trim() : "";
      if (compName === searchName) {
        var dateStr = data[i][7] instanceof Date ? Utilities.formatDate(data[i][7], Session.getScriptTimeZone(), "dd.MM.yyyy") : data[i][7];
        results.push({ status: data[i][2], title: data[i][6], date: dateStr });
      }
    }
    return results;
  } catch (e) { return []; }
}

function checkArchiveDuplicate(companyToFind) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(ARCHIVE_SHEET_NAME);
    if (!sheet) return null;
    
    var data = sheet.getRange("B2:M" + Math.max(sheet.getLastRow(), 2)).getValues();
    var searchName = companyToFind.toString().toLowerCase().trim();
    
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().toLowerCase().trim() === searchName) {
        return {
          status: data[i][1] ? data[i][1].toString().trim() : "Відмова",
          reason: data[i][11] || "Причину не вказано" // Стовпець M в Архіві
        };
      }
    }
    return null;
  } catch (e) { return null; }
}

function getActiveCompanies() {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    var data = sheet.getRange("B2:C" + Math.max(sheet.getLastRow(), 2)).getValues();
    var comps = [];
    
    for (var i = 0; i < data.length; i++) {
      var status = data[i][1] ? data[i][1].toString().toLowerCase().trim() : "";
      // Виключаємо всі архівні статуси
      if (data[i][0] && status.indexOf("відмова") === -1 && status.indexOf("я відмовив") === -1 && status.indexOf("закрита") === -1 && status.indexOf("резерв") === -1 && status.indexOf("відкликан") === -1) {
        if (comps.indexOf(data[i][0]) === -1) comps.push(data[i][0].toString().trim());
      }
    }
    return comps;
  } catch (e) { return []; }
}

function getPendingVacancies() {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    var data = sheet.getRange("B2:C" + Math.max(sheet.getLastRow(), 2)).getValues();
    var pending = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i][1] && data[i][1].toString().trim() === "нова вакансія" && data[i][0]) {
        pending.push(data[i][0].toString().trim());
      }
    }
    return pending;
  } catch (e) { return []; }
}

// --- БЕЗПЕЧНЕ СОРТУВАННЯ ТА АВТОНУМЕРАЦІЯ ---
function autoSortSheet() {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    if (lastRow < 2) return; // Нічого сортувати

    // Зчитуємо всі дані (крім заголовка)
    var fullData = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

    // Визначаємо пріоритет за новими статусами v3.0
    var getPriority = function(status) {
      var s = String(status).toLowerCase().trim();
      
      // Пріоритет 1 (Гарячі активності)
      if (s.indexOf("співбесіда") > -1 || s.indexOf("скринінг") > -1 || s.indexOf("тестове") > -1 || s.indexOf("background") > -1 || s.indexOf("переговор") > -1 || s.indexOf("офер") > -1) return 1;
      
      // Пріоритет 2 (Потребує уваги/Тиша)
      if (s === "потребує фолоу-апу") return 2;
      
      // Пріоритет 3 (Очікування)
      if (s === "очікує відповідь" || s.indexOf("фідбек") > -1) return 3;
      
      // Пріоритет 4 (Старт)
      if (s === "надіслано відгук") return 4;
      
      // Пріоритет 5 (Нові чернетки та інше)
      return 5;
    };

    // Сортуємо: спочатку за пріоритетом, потім за датою контакту (найновіші зверху)
    fullData.sort(function(a, b) {
      var prioA = getPriority(a[2]);
      var prioB = getPriority(b[2]);
      if (prioA !== prioB) return prioA - prioB; // Сортування за категорією
      
      var dateA = new Date(a[7]); // Стовпець H
      var dateB = new Date(b[7]);
      return dateB - dateA; // Сортування за датою всередині категорії
    });

    // АВТОНУМЕРАЦІЯ (Колонка А): Після сортування просто перенумеровуємо від 1 до кінця
    for (var i = 0; i < fullData.length; i++) { 
      fullData[i][0] = i + 1; 
    }

    // СНАЙПЕРСЬКИЙ ЗАПИС (ОБХІД ARRAYFORMULA В КОЛОНКАХ D ТА F)
    
    // Пишемо A, B, C (ID, Компанія, Статус)
    var abcData = fullData.map(function(row) { return [row[0], row[1], row[2]]; });
    sheet.getRange(2, 1, lastRow - 1, 3).setValues(abcData);

    // Пишемо E (URL), пропускаючи D
    var eData = fullData.map(function(row) { return [row[4]]; });
    sheet.getRange(2, 5, lastRow - 1, 1).setValues(eData);

    // Пишемо від G до кінця, пропускаючи F
    if (lastCol >= 7) {
        var gToEndData = fullData.map(function(row) { return row.slice(6); });
        sheet.getRange(2, 7, lastRow - 1, gToEndData[0].length).setValues(gToEndData);
    }
  } catch (e) {
    Telegram.sendText(MY_TELEGRAM_ID, "⚠️ Помилка автосортування (Utils.gs): " + e.message);
  }
}

// Допоміжна функція для парсингу звітів ШІ
function parseValidationText(text) {
  var data = {};
  var lines = text.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.indexOf("🏢 Компанія:") > -1) data.companyName = line.replace("🏢 Компанія:", "").trim();
    if (line.indexOf("📌 Статус:") > -1) data.type = line.replace("📌 Статус:", "").trim();
    if (line.indexOf("👤 Рекрутер:") > -1) data.recruiterName = line.replace("👤 Рекрутер:", "").trim();
    if (line.indexOf("📅 Деталі:") > -1) data.details = line.replace("📅 Деталі:", "").trim();
  }
  return data;
}

// Парсинг тексту вакансії з сайту
function fetchUrlContent(url) {
  if (!url || !url.startsWith("http")) return null;
  try {
    var options = {
      "muteHttpExceptions": true, 
      "followRedirects": true,
      "headers": { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" }
    };
    var response = UrlFetchApp.fetch(url, options);
    if (response.getResponseCode() !== 200) return null;

    var html = response.getContentText();
    // Вирізаємо скрипти та стилі, щоб не "смітити" в промпт для ШІ
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
    html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ");
    
    // Чистимо HTML теги
    var text = html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    text = text.replace(/\s+/g, " ").trim();

    if (text.length < 400) return null; // Якщо сайт заблокував нас (напр. Cloudflare)
    return text.substring(0, 15000);    // Обмеження тексту для Gemini
  } catch (e) { return null; }
}