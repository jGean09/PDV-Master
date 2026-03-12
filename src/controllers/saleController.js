const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createSale = async (req, res) => {
    const { customer, items, total } = req.body;

    try {
        // Transação do Prisma: Garante que ou grava tudo ou não grava nada
        const result = await prisma.$transaction(async (tx) => {
            const sale = await tx.sale.create({
                data: {
                    customerId: customer ? parseInt(customer.id) : null,
                    total: parseFloat(total),
                    items: {
                        create: items.map(item => ({
                            productId: parseInt(item.product_id),
                            price: parseFloat(item.price),
                            quantity: parseInt(item.quantity)
                        }))
                    }
                }
            });

            // Baixa no estoque automática
            for (const item of items) {
                await tx.product.update({
                    where: { id: parseInt(item.product_id) },
                    data: { quantity: { decrement: parseInt(item.quantity) } }
                });
            }

            return sale;
        });

        res.status(201).json({ ok: true, saleId: result.id });
    } catch (err) {
        console.error(err);
        res.status(400).json({ ok: false, error: err.message });
    }
};

exports.getSalesReport = async (req, res) => {
    try {
        const sales = await prisma.sale.findMany({
            include: {
                client: true,
                items: { include: { product: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(sales);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};