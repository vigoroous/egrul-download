# egrul-download

Скачать выписки с ЕГРЮЛ по ИНН ЮЛ / ИП.
Получить актуальную информацию о статусе компании.
Сформировать отчет в Excel.

# Настройка
1. Создать файл **.env.local**
```
DATABASE_URL="file:./dev.db"
DOWNLOAD_DIR="./downloads"
LOG_DIR="./logs"
DADATA_API_KEY=""
```
2. Добавить API-ключ https://dadata.ru/api/
3. Выбрать опции в **src/app.ts**

```ts
const options = {
    useInput: true,     // Считать входные данные из экселя или txt
    useEgrul: false,    // Скачать выписки
    useDadata: true,    // Использовать бобра
    createReport: true, // Сформировать отчет
}
```
4. Добавить файл с входными данными
5. Указать откуда считывать данные
```ts
{
  file: { name: "data/Untitled.xlsx", colName: "B" },
  type: "xlsx"
}
```

# Использование
* Установка зависимостей ```yarn```
* Инициализция БД ```yarn prisma:migrate```
* Запуск ```yarn dev```
