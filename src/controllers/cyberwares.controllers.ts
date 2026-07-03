import type { Request, Response } from "express"
import { prisma } from "../../lib/prisma.js"

export async function CriarCyberware(req: Request, res: Response) {
    const { nome, preco, estoque, id_categoria } = req.body

    try {
        const novoCyberware = await prisma.cyberwares.create({
            data: { nome, preco, estoque, id_categoria },
            select: { id: true }
        })
        res.status(200).json(novoCyberware)
    } catch {
        res.status(400).json({ error: "erro ao criar cyberware" })
    }
}

export async function ListarCyberwares(req: Request, res: Response) {
    try {
        const lista = await prisma.cyberwares.findMany({
            select: {
                id: true,
                nome: true,
                preco: true,
                estoque: true,
                id_categoria: true,
                categoria: true
            }
        })
        res.status(200).json(lista)
    } catch {
        res.status(400).json({ error: "erro ao listar cyberwares" })
    }
}

export async function BuscarCyberware(req: Request, res: Response) {
    const { id } = req.params

    if (!id) {
        res.status(400).json({ error: "ID não fornecido" })
        return
    }

    try {
        const cyberwareEncontrado = await prisma.cyberwares.findUnique({
            where: { id: Number(id) },
            include: { categoria: true }
        })

        if (!cyberwareEncontrado) {
            res.status(404).json({ error: "cyberware não encontrado" })
            return
        }

        res.status(200).json(cyberwareEncontrado)
    } catch {
        res.status(400).json({ error: "erro ao buscar cyberware" })
    }
}

export async function AtualizarCyberware(req: Request, res: Response) {
    const { id } = req.params

    if (!id) {
        res.status(400).json({ error: "ID não fornecido" })
        return
    }

    const { nome, preco, estoque, id_categoria } = req.body

    const cyberwareExiste = await prisma.cyberwares.findUnique({ where: { id: Number(id) } })
    if (!cyberwareExiste) {
        res.status(404).json({ error: "cyberware não encontrado" })
        return
    }

    try {
        const atualizado = await prisma.cyberwares.update({
            where: { id: Number(id) },
            data: { nome, preco, estoque, id_categoria }
        })
        res.status(200).json(atualizado)
    } catch {
        res.status(400).json({ error: "erro ao atualizar cyberware" })
    }
}

export async function DeletarCyberware(req: Request, res: Response) {
    const { id } = req.params

    if (!id) {
        res.status(400).json({ error: "ID não fornecido" })
        return
    }

    const cyberwareExiste = await prisma.cyberwares.findUnique({ where: { id: Number(id) } })
    if (!cyberwareExiste) {
        res.status(404).json({ error: "cyberware não encontrado" })
        return
    }

    try {
        await prisma.cyberwares.delete({ where: { id: Number(id) } })
        res.status(200).json({ message: `cyberware ${id} deletado` })
    } catch {
        res.status(400).json({ error: "erro ao deletar cyberware" })
    }
}