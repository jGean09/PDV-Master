const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getFinancialReport = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        
        const stats = products.reduce((acc, p) => {
            acc.totalVenda += p.price * p.quantity;
            acc.totalCusto += p.cost * p.quantity;
            return acc;
        }, { totalVenda: 0, totalCusto: 0 });

        res.json({
            faturamento: stats.totalVenda,
            custo: stats.totalCusto,
            lucro: stats.totalVenda - stats.totalCusto
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao gerar relatório" });
    }
};

module.exports = { getFinancialReport };