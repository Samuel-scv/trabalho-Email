import type { Request, Response } from "express"
import type { cliente } from "../interface/cliente.interfaces.js"
import { prisma } from "../../lib/prisma.js"

export async function CriarCliente(req: Request, res: Response) {
    const { nome, email, saldo }: cliente = req.body

    if (!nome || !email || !saldo) {
        res.status(400).json({ error: "todos os dados são obrigatórios" })
        return
    }

    try {
        const novoCliente = await prisma.clientes.create({
            data: { nome, email, saldo },
            select: { id: true }
        })
        res.status(200).json(novoCliente)
    } catch {
        res.status(400).json({ error: "erro ao criar cliente" })
    }
}

export async function ListarClientes(req: Request, res: Response) {
    try {
        const lista = await prisma.clientes.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                saldo: true
            }
        })
        res.status(200).json(lista)
    } catch {
        res.status(400).json({ error: "erro ao listar clientes" })
    }
}

export async function BuscarCliente(req: Request, res: Response) {
    const { id } = req.params

    if (!id) {
        res.status(400).json({ error: "ID não fornecido" })
        return
    }

    try {
        const clienteEncontrado = await prisma.clientes.findUnique({
            where: { id: Number(id) }
        })

        if (!clienteEncontrado) {
            res.status(404).json({ error: "cliente não encontrado" })
            return
        }

        res.status(200).json(clienteEncontrado)
    } catch {
        res.status(400).json({ error: "erro ao buscar cliente" })
    }
}

export async function AtualizarCliente(req: Request, res: Response) {
    const { id } = req.params

    if (!id) {
        res.status(400).json({ error: "ID não fornecido" })
        return
    }

    const { nome, email, saldo } = req.body

    if (!nome || !email || !saldo) {
        res.status(400).json({ error: "insira todos os dados" })
        return
    }

    const clienteExiste = await prisma.clientes.findUnique({ where: { id: Number(id) } })
    if (!clienteExiste) {
        res.status(404).json({ error: "cliente não encontrado" })
        return
    }

    try {
        const atualizado = await prisma.clientes.update({
            where: { id: Number(id) },
            data: { nome, email, saldo }
        })
        res.status(200).json(atualizado)
    } catch {
        res.status(400).json({ error: "erro ao atualizar cliente" })
    }
}

export async function DeletarCliente(req: Request, res: Response) {
    const { id } = req.params

    if (!id) {
        res.status(400).json({ error: "ID não fornecido" })
        return
    }

    const clienteExiste = await prisma.clientes.findUnique({ where: { id: Number(id) } })
    if (!clienteExiste) {
        res.status(404).json({ error: "cliente não encontrado" })
        return
    }

    try {
        await prisma.clientes.delete({ where: { id: Number(id) } })
        res.status(200).json({ message: `cliente ${id} deletado` })
    } catch {
        res.status(400).json({ error: "erro ao deletar cliente" })
    }
}