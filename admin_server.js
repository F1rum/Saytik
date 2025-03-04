const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

// Middleware для обработки JSON
app.use(express.json());

// Путь к файлу с данными о товарах (на уровень выше текущей директории)
const dataFilePath = path.join(__dirname,'products.json');

// Загрузка данных о товарах
let products = [];
products = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

// Сохранение данных о товарах
const saveProducts = () => {
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));
};

// Отдача статического файла admin.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Добавление товара
app.post('/products', (req, res) => {
    const newProduct = req.body;
    products.push(newProduct);
    saveProducts();
    res.status(201).send('Товар добавлен');
});

// Редактирование товара по ID
app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedProduct = req.body;
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        saveProducts();
        res.send('Товар обновлен');
    } else {
        res.status(404).send('Товар не найден');
    }
});

// Удаление товара по ID
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products.splice(index, 1);
        saveProducts();
        res.send('Товар удален');
    } else {
        res.status(404).send('Товар не найден');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});
app.get('/products.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'products.json'));
});

app.listen(PORT, () => {
    console.log(`Admin Backend server is running on http://localhost:${PORT}`);
});