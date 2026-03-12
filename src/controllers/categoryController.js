const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar categorias" });
    }
};

const createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const category = await prisma.category.create({ 
            data: { name } 
        });
        res.status(201).json(category);
    } catch (error) {
        // ISSO VAI APARECER NO SEU TERMINAL (NODEMON)
        console.error("❌ ERRO NO PRISMA:", error); 
        res.status(400).json({ error: error.message });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const category = await prisma.category.update({
            where: { id: parseInt(id) },
            data: { name }
        });
        res.json(category);
    } catch (error) {
        res.status(400).json({ error: "Erro ao atualizar" });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.category.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Deletado com sucesso" });
    } catch (error) {
        if (error.code === 'P2003') {
            return res.status(400).json({ error: "Existem produtos vinculados!" });
        }
        res.status(500).json({ error: "Erro ao deletar" });
    }
};

// AQUI ESTÁ O SEGREDO: Todos os nomes devem estar aqui!
module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};