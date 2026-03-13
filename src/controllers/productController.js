const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Busca todos os produtos incluindo os dados da categoria vinculada
 */
// src/controllers/productController.js revisado
const getAllProducts = async (req, res) => {
    const { includeInactive } = req.query; // Lemos se o usuário quer ver os inativos

    try {
        const products = await prisma.product.findMany({
            where: includeInactive === 'true' ? {} : { active: true },
            include: { category: true }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar produtos" });
    }
};
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
            // REMOVA qualquer filtro de 'active: true' daqui!
        });
        
        if (!product) return res.status(404).json({ error: "Produto não encontrado" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar produto" });
    }
};

/**
 * Cria um novo produto com validação de tipos e conexão de categoria
 */
const createProduct = async (req, res) => {
    const { name, price, cost, quantity, categoryId } = req.body;

    try {
        if (!categoryId) {
            return res.status(400).json({ error: "ID da categoria é obrigatório." });
        }

        const product = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                cost: parseFloat(cost),
                quantity: parseInt(quantity),
                category: { 
                    connect: { id: parseInt(categoryId) } 
                }
            }
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("❌ ERRO TÉCNICO NO PRISMA:", error.message);
        res.status(400).json({ 
            error: "Erro ao criar produto. Verifique se a categoria ainda existe.",
            details: error.message 
        });
    }
};

/**
 * Atualiza um produto existente
 */
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, cost, quantity, categoryId, active } = req.body;

    try {
        // Criamos um objeto de dados dinâmico
        const updateData = {};

        // Se o campo existir no body, adicionamos ao update
        if (name !== undefined) updateData.name = name;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (cost !== undefined) updateData.cost = parseFloat(cost);
        if (quantity !== undefined) updateData.quantity = parseInt(quantity);
        if (active !== undefined) updateData.active = active; // ESSA LINHA É A CHAVE

        // Se enviou categoria, conectamos
        if (categoryId) {
            updateData.category = { connect: { id: parseInt(categoryId) } };
        }

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.json(product);
    } catch (error) {
        console.error("❌ ERRO NO UPDATE:", error.message);
        res.status(400).json({ error: "Erro ao atualizar produto no banco." });
    }
};

/**
 * Remove um produto (Verifica integridade referencial)
 */
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        // Em vez de prisma.product.delete, usamos UPDATE
        await prisma.product.update({
            where: { id: parseInt(id) },
            data: { active: false } // Apenas desativa
        });
        res.json({ message: "Produto desativado com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao desativar:", error.message);
        res.status(500).json({ error: "Erro ao remover produto." });
    }
};

// EXPORTAÇÃO ÚNICA - Essencial para o funcionamento das rotas
module.exports = { 
    getAllProducts, 
    getProductById,
    createProduct, 
    updateProduct, 
    deleteProduct 
};