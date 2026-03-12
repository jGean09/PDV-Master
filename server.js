const express = require('express');
const app = express();

const categoryRoutes = require('./src/routes/categoryRoutes');
const productRoutes = require('./src/routes/productRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const saleRoutes = require('./src/routes/saleRoutes');

app.use(express.json());
app.use(express.static('public'));

app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/clients', clientRoutes);
app.use('/reports', reportRoutes);
app.use('/sales', saleRoutes);

app.listen(3000, () => console.log('🚀 Sistema PDV Master Online em http://localhost:3000'));