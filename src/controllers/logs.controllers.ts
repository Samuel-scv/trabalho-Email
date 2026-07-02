import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export async function ListarLogs(req: Request, res: Response) {
    try {
        const logs = await prisma.log.findMany({
            include: {
                cliente: {
                    select: { nome: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar logs" });
    }
}

export async function BuscarLogsPorCliente(req: Request, res: Response) {
    const { clienteId } = req.params;

    if (!clienteId) {
        res.status(400).json({ error: "ID do cliente não fornecido" });
        return;
    }

    try {
        const logs = await prisma.log.findMany({
            where: { clienteId: Number(clienteId) },
            include: {
                cliente: {
                    select: { nome: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar logs do cliente" });
    }
}