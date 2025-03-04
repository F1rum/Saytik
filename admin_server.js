const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

const productsFilePath = path.join(__dirname, '../backend_store/products.json');

// Helper functions (readProducts and writeProducts) remain the same
async function readProducts() {
    try {
        const data = await fs.readFile(productsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading products.json:", err);
        return [];
    }
}

async function writeProducts(products) {
    try {
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
        console.log("Successfully wrote to products.json");
    } catch (err) {
        console.error("Error writing to products.json:", err);
        throw err;
    }
}

// GET /products
app.get('/products', async (req, res) => {
    try {
        const products = await readProducts();
        res.json(products);
    } catch(e) {
        console.error("Error fetching products:", e);
        res.status(500).send("Failed to fetch products");
    }
});

// POST /products
app.post('/products', async (req, res) => {
    try {
        const { Name, Price, Description } = req.body;
        if (!Name || Price === undefined || !Description) {
            return res.status(400).json({ message: "Name, Price, and Description are required" });
        }

        const products = await readProducts();
        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            Name,
            Price,
            Description
        };

        products.push(newProduct);
        await writeProducts(products);
        res.status(201).json(newProduct);
    } catch (e) {
        console.error("Error adding product:", e);
        res.status(500).send("Failed to add product");
    }
});

// GET /products/:id
app.get('/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const products = await readProducts();
        const product = products.find(p => p.id === productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (e) {
        console.error("Error fetching product:", e);
        res.status(500).send("Failed to fetch product");
    }
});

// PUT /products/:id
app.put('/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const { Name, Price, Description } = req.body;

        if (!Name || Price === undefined || !Description) {
            return res.status(400).json({ message: "Name, Price, and Description are required" });
        }

        const products = await readProducts();
        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found" });
        }

        products[productIndex] = { id: productId, Name, Price, Description };
        await writeProducts(products);
        res.json(products[productIndex]);

    } catch (e) {
        console.error("Error updating product:", e);
        res.status(500).send("Failed to update product");
    }
});

// DELETE /products/:id
app.delete('/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        let products = await readProducts();
        const initialLength = products.length;
        products = products.filter(p => p.id !== productId);

        if (products.length === initialLength) {
            return res.status(404).json({ message: "Product not found" });
        }

        await writeProducts(products);
        res.status(204).send();

    } catch (e) {
        console.error("Error deleting product:", e);
        res.status(500).send("Failed to delete product");
    }
});

app.listen(PORT, () => {
    console.log(`Admin Backend server is running on http://localhost:${PORT}`);
});