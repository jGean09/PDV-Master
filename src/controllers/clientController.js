const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createClient = async (req, res) => {
    const { name, phone, address } = req.body;
    try {
        const client = await prisma.client.create({
            data: { name, phone, address }
        });
        res.status(201).json(client);
    } catch (error) {
        res.status(400).json({ error: "Erro ao cadastrar cliente" });
    }
};

const getAllClients = async (req, res) => {
    const clients = await prisma.client.findMany();
    res.json(clients);
};

module.exports = { createClient, getAllClients };