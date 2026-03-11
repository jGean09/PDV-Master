const { db } = require('../database/db');

// Controller lida com a lógica
const getAllProducts = (req, res) => {
    try {
        const rows = db.prepare(`
            SELECT p.*, c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
        `).all();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createProduct = (req, res) => {
    const { name, price, custo, quantity, fornecedor, category_id } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO products (name, price, custo, fornecedor, quantity, category_id) VALUES (?, ?, ?, ?, ?, ?)');
        const info = stmt.run(name, price, custo, fornecedor || null, quantity, category_id || null);
        res.status(201).json({ ok: true, id: info.lastInsertRowid });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
};

module.exports = { getAllProducts, createProduct };