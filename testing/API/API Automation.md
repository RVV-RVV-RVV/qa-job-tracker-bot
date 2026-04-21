## Section 6: API Automation (Postman Collection)

Для швидкої автоматизованої перевірки безпеки та стійкості Webhook-ендпоінту (TC-23, TC-24 та TC-25) створено готову колекцію Postman. Версія 3.0.4 підтримує перевірку цілісності даних при роботі "Авто-Двірника".

### Як запустити тести:
1. Скопіюйте JSON-код колекції нижче.
2. У Postman натисніть **Import** ➔ **Raw text** ➔ Вставте код ➔ **Import**.
3. Відкрийте колекцію, перейдіть на вкладку **Variables**.
4. Вставте ваш реальний URL розгорнутого вебхука у змінну `webhook_url` та збережіть (Ctrl+S).
5. Запускайте запити по черзі або через Collection Runner.

<details>
<summary><b>🛠 Розгорнути код Postman Collection (JSON) v3.0.4</b></summary>

```json
{
    "info": {
        "name": "QA Job Tracker Bot v3.0.4 - Webhook API Tests",
        "description": "Автоматизована колекція для тестування безпеки та стійкості Webhook (Google Apps Script). Включає перевірку Data Integrity при роботі Авто-Двірника. Створена для перевірки TC-23, TC-24 та TC-25.",
        "schema": "[https://schema.getpostman.com/json/collection/v2.1.0/collection.json](https://schema.getpostman.com/json/collection/v2.1.0/collection.json)"
    },
    "item": [
        {
            "name": "TC-24: [Health Check] Порожній GET-запит",
            "request": {
                "method": "GET",
                "header": [],
                "url": {
                    "raw": "{{webhook_url}}",
                    "host": ["{{webhook_url}}"]
                },
                "description": "Перевірка захисту від пустих запитів. Очікується статус 200 OK та відповідь 'OK'."
            },
            "response": []
        },
        {
            "name": "TC-24: [Health Check] Порожній POST-запит",
            "request": {
                "method": "POST",
                "header": [],
                "body": {
                    "mode": "raw",
                    "raw": ""
                },
                "url": {
                    "raw": "{{webhook_url}}",
                    "host": ["{{webhook_url}}"]
                },
                "description": "Тест на падіння скрипта при відсутності contents."
            },
            "response": []
        },
        {
            "name": "TC-23: [Security] Спроба доступу з чужого ID",
            "request": {
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"update_id\": 10000001,\n    \"message\": {\n        \"from\": {\"id\": 123456789},\n        \"chat\": {\"id\": 123456789},\n        \"text\": \"/start\"\n    }\n}"
                },
                "url": {
                    "raw": "{{webhook_url}}",
                    "host": ["{{webhook_url}}"]
                },
                "description": "Блокування доступу для ID, що не дорівнює MY_TELEGRAM_ID."
            },
            "response": []
        },
        {
            "name": "[Baseline] Валідний POST-запит (Happy Path)",
            "request": {
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"update_id\": 10000002,\n    \"message\": {\n        \"from\": {\"id\": {{my_telegram_id}}},\n        \"chat\": {\"id\": {{my_telegram_id}}},\n        \"text\": \"❌ Скасувати\"\n    }\n}"
                },
                "url": {
                    "raw": "{{webhook_url}}",
                    "host": ["{{webhook_url}}"]
                },
                "description": "Перевірка штатної роботи бекенду (скидання кешу)."
            },
            "response": []
        }
    ],
    "variable": [
        { "key": "webhook_url", "value": "ВСТАВ_СВІЙ_WEBHOOK_URL_ТУТ", "type": "string" },
        { "key": "my_telegram_id", "value": "430025631", "type": "string" }
    ]
}