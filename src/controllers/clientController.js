const { db } = require('../database/db');

exports.getAllClients = (req, res) => {
    res.json(db.prepare('SELECT * FROM customers ORDER BY name').all());
};

exports.createClient = (req, res) => {
    const { name, phone, address } = req.body;
    try {
        const info = db.prepare('INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)').run(name, phone, address);
        res.status(201).json({ ok: true, id: info.lastInsertRowid });
    } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
};