const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createSale = async (req, res) => {
    const { customer, items, total } = req.body;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Cria a venda
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
                },
                // INCLUSÃO CRÍTICA: Retorna os nomes para o cupom
                include: {
                    client: true,
                    items: {
                        include: {
                            product: true
                        }
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

        // Retornamos o objeto 'result' completo (com includes)
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
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