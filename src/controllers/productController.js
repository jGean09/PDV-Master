const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Busca todos os produtos incluindo os dados da categoria vinculada
 */
const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: { 
                category: true // Isso traz o objeto completo da categoria (id e name)
            }
        });
        res.json(products);
    } catch (error) {
        console.error("❌ Erro ao buscar produtos:", error);
        res.status(500).json({ error: "Erro interno ao buscar produtos" });
    }
};

/**
 * Cria um novo produto com validação de tipos e conexão de categoria
 */
const createProduct = async (req, res) => {
    const { name, price, cost, quantity, categoryId } = req.body;

    try {
        // Validação básica: se o categoryId for nulo ou indefinido, o Prisma vai falhar no connect
        if (!categoryId) {
            return res.status(400).json({ error: "ID da categoria é obrigatório." });
        }

        const product = await prisma.product.create({
            data: {
                name: name,
                price: parseFloat(price),
                cost: parseFloat(cost),
                quantity: parseInt(quantity),
                // O método connect vincula o produto à categoria existente pelo ID
                category: { 
                    connect: { id: parseInt(categoryId) } 
                }
            }
        });

        res.status(201).json(product);

    } catch (error) {
        // Exibe o erro real no terminal do VS Code para facilitar o conserto
        console.error("❌ ERRO TÉCNICO NO PRISMA:", error.message);

        res.status(400).json({ 
            error: "Erro ao criar produto. Verifique se a categoria selecionada ainda existe no sistema.",
            details: error.message 
        });
    }
};

module.exports = { 
    getAllProducts, 
    createProduct 
};