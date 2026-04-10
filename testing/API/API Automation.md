## Section 6: API Automation (Postman Collection)

Для швидкої автоматизованої перевірки безпеки та стійкості Webhook-ендпоінту (TC-23 та TC-24) створено готову колекцію Postman. 

### Як запустити тести:
1. Скопіюйте JSON-код колекції нижче.
2. У Postman натисніть **Import** ➔ **Raw text** ➔ Вставте код ➔ **Import**.
3. Відкрийте колекцію, перейдіть на вкладку **Variables**.
4. Вставте ваш реальний URL розгорнутого вебхука у змінну `webhook_url` та збережіть (Ctrl+S / Cmd+S).
5. Запускайте запити по черзі або через Collection Runner.

<details>
<summary><b>🛠 Розгорнути код Postman Collection (JSON)</b></summary>

```json
{
	"info": {
		"name": "QA Job Tracker Bot v3.0.1 - Webhook API Tests",
		"description": "Автоматизована колекція для тестування безпеки та стійкості Webhook (Google Apps Script). Створена для перевірки TC-23 та TC-24.",
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
					"host": [
						"{{webhook_url}}"
					]
				},
				"description": "Перевірка захисту від пустих запитів. Очікується статус 200 OK та відповідь 'OK' (HtmlService)."
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
					"raw": "",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "{{webhook_url}}",
					"host": [
						"{{webhook_url}}"
					]
				},
				"description": "Тест на падіння скрипта при відсутності об'єкта e.postData.contents."
			},
			"response": []
		},
		{
			"name": "TC-23: [Security] Спроба доступу з чужого ID",
			"request": {
				"method": "POST",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json",
						"type": "text"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"update_id\": 10000001,\n    \"message\": {\n        \"message_id\": 1,\n        \"from\": {\n            \"id\": 123456789,\n            \"is_bot\": false,\n            \"first_name\": \"Hacker\"\n        },\n        \"chat\": {\n            \"id\": 123456789,\n            \"type\": \"private\"\n        },\n        \"date\": 1710000000,\n        \"text\": \"/start\"\n    }\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "{{webhook_url}}",
					"host": [
						"{{webhook_url}}"
					]
				},
				"description": "Перевірка блокування доступу для ID, що не дорівнює MY_TELEGRAM_ID. Очікується 200 OK, але бот має надіслати алерт адміністратору."
			},
			"response": []
		},
		{
			"name": "[Baseline] Валідний POST-запит (Happy Path)",
			"request": {
				"method": "POST",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json",
						"type": "text"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"update_id\": 10000002,\n    \"message\": {\n        \"message_id\": 2,\n        \"from\": {\n            \"id\": {{my_telegram_id}},\n            \"is_bot\": false,\n            \"first_name\": \"Viktor\"\n        },\n        \"chat\": {\n            \"id\": {{my_telegram_id}},\n            \"type\": \"private\"\n        },\n        \"date\": 1710000000,\n        \"text\": \"❌ Скасувати\"\n    }\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "{{webhook_url}}",
					"host": [
						"{{webhook_url}}"
					]
				},
				"description": "Перевірка штатної роботи бекенду (скидання кешу та виклик MAIN_MENU)."
			},
			"response": []
		}
	],
	"variable": [
		{
			"key": "webhook_url",
			"value": "ВСТАВ_СВІЙ_WEBHOOK_URL_ТУТ",
			"type": "string"
		},
		{
			"key": "my_telegram_id",
			"value": "430025631",
			"type": "string"
		}
	]
}