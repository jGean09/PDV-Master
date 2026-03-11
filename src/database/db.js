const Database = require('better-sqlite3');
const path = require('path');

// Localização do banco na raiz do projeto
const dbPath = path.join(__dirname, '../../pdv.db');
const db = new Database(dbPath);


console.log("📍 Tentando conectar ao banco em:", dbPath); // ADICIONE ISSO

// Configuração de performance do SQLite (WAL mode)
db.pragma('journal_mode = WAL');

/**
 * Inicializa a estrutura do banco de dados
 */
const initDb = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            custo REAL NOT NULL,
            fornecedor TEXT,
            quantity INTEGER NOT NULL,
            category_id INTEGER REFERENCES categories(id)
        );

        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            address TEXT
        );

        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER,
            total REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(customer_id) REFERENCES customers(id)
        );

        CREATE TABLE IF NOT EXISTS sale_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sale_id INTEGER,
            product_id INTEGER,
            price REAL,
            quantity INTEGER,
            FOREIGN KEY(sale_id) REFERENCES sales(id),
            FOREIGN KEY(product_id) REFERENCES products(id)
        );
    `);
    console.log("✅ Banco de dados inicializado com sucesso.");
};

module.exports = { db, initDb };