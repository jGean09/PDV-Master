const { db } = require('../database/db');

exports.getAllCategories = (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM categories ORDER BY name').all();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCategory = (req, res) => {
    const { name } = req.body;
    try {
        const info = db.prepare('INSERT INTO categories (name) VALUES (?)').run(name);
        res.status(201).json({ ok: true, id: info.lastInsertRowid });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ ok: false, error: 'Esta categoria já existe.' });
        }
        res.status(500).json({ ok: false, error: err.message });
    }
};