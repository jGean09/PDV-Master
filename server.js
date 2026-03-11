const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./src/database/db');

// Importação dos Módulos de Rota
const productRoutes = require('./src/routes/productRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const saleRoutes = require('./src/routes/saleRoutes');

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Inicialização do Banco de Dados
initDb();

// Registro das Rotas da API
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/clients', clientRoutes);
app.use('/sales', saleRoutes);

// Servindo o Frontend Estático
app.use(express.static(path.join(__dirname, 'public')));

// Inicialização do Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
    =========================================
    🚀 PDV MASTER - ARQUITETURA MVC ATIVA
    📡 Servidor: http://localhost:${PORT}
    📂 Pasta Pública: /public
    🗄️ Banco de Dados: pdv.db
    =========================================
    `);
});