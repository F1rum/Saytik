const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Отдача статического файла index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Отдача JSON-файла с данными о товарах
app.get('/products.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'products.json'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log('Сервер запущен на http://localhost:${PORT}');
});