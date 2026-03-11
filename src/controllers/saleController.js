const { db } = require('../database/db');

exports.createSale = (req, res) => {
    const { customer, items } = req.body;
    const customer_id = customer ? customer.id : null;

    try {
        const saleId = db.transaction(() => {
            let totalVenda = 0;
            items.forEach(item => totalVenda += (item.price * item.quantity));

            const saleInfo = db.prepare('INSERT INTO sales (customer_id, total) VALUES (?, ?)').run(customer_id, totalVenda);
            const sId = saleInfo.lastInsertRowid;

            const itemStmt = db.prepare('INSERT INTO sale_items (sale_id, product_id, price, quantity) VALUES (?, ?, ?, ?)');
            const stockStmt = db.prepare('UPDATE products SET quantity = quantity - ? WHERE id = ?');

            for (const item of items) {
                itemStmt.run(sId, item.product_id, item.price, item.quantity);
                stockStmt.run(item.quantity, item.product_id);
            }
            return sId;
        })();
        res.status(201).json({ ok: true, saleId });
    } catch (err) { res.status(400).json({ ok: false, error: err.message }); }
};

exports.getSalesReport = (req, res) => {
    const sales = db.prepare('SELECT s.*, c.name as customer_name FROM sales s LEFT JOIN customers c ON s.customer_id = c.id ORDER BY created_at DESC').all();
    const fullSales = sales.map(sale => {
        const items = db.prepare('SELECT si.*, p.name as product_name FROM sale_items si JOIN products p ON si.product_id = p.id WHERE si.sale_id = ?').all(sale.id);
        return { ...sale, items, customer: sale.customer_name ? { name: sale.customer_name } : null };
    });
    res.json(fullSales);
};