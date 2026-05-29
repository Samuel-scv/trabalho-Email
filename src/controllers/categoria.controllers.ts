import type { Request, Response } from "express"
import type { categoria } from "../interface/Categoria.interfaces.js"
import { prisma } from "../../lib/prisma.js"
 
export async function CriarCategoria(req: Request, res: Response) {
    const { nome }: categoria = req.body
 
    if (!nome) {
        res.status(400).json({ error: "nome é obrigatório" })
        return
    }
 
    try {
        const novaCategoria = await prisma.categoria.create({
            data: { nome },
            select: { id: true }
        })
        res.status(200).json(novaCategoria)
    } catch {
        res.status(400).json({ error: "erro ao criar categoria" })
    }
}
 
export async function ListarCategorias(req: Request, res: Response) {
    try {
        const lista = await prisma.categoria.findMany({
            select: {
                id: true,
                nome: true
            }
        })
        res.status(200).json(lista)
    } catch {
        res.status(400).json({ error: "erro ao listar categorias" })
    }
}
 
export async function BuscarCategoria(req: Request, res: Response) {
    const { id } = req.params
 
    if (!id) {
        res.status(400).json({ error: "ID não fornecido" })
        return
    }
 
    try {
        const categoriaEncontrada = await prisma.categoria.findUnique({
            where: { id: Number(id) }
        })
 
        if (!categoriaEncontrada) {
            res.status(404).json({ error: "categoria não encontrada" })
            return
        }
 
        res.status(200).json(categoriaEncontrada)
    } catch {
        res.status(400).json({ error: "erro ao buscar categoria" })
    }
}
 
export async function AtualizarCategoria(req: Request, res: Response) {
    const { id } = req.params
 
    if (!id) {
        res.status(400).json({ error: "ID não fornecido" })
        return
    }
 
    const { nome } = req.body
 
    if (!nome) {
        res.status(400).json({ error: "nome é obrigatório" })
        return
    }
 
    const categoriaExiste = await prisma.categoria.findUnique({ where: { id: Number(id) } })
    if (!categoriaExiste) {
        res.status(404).json({ error: "categoria não encontrada" })
        return
    }
 
    try {
        const atualizada = await prisma.categoria.update({
            where: { id: Number(id) },
            data: { nome }
        })
        res.status(200).json(atualizada)
    } catch {
        res.status(400).json({ error: "erro ao atualizar categoria" })
    }
}
 
export async function DeletarCategoria(req: Request, res: Response) {
    const { id } = req.params
 
    if (!id) {
        res.status(400).json({ error: "ID não fornecido" })
        return
    }
 
    const categoriaExiste = await prisma.categoria.findUnique({ where: { id: Number(id) } })
    if (!categoriaExiste) {
        res.status(404).json({ error: "categoria não encontrada" })
        return
    }
 
    try {
        await prisma.categoria.delete({ where: { id: Number(id) } })
        res.status(200).json({ message: `categoria ${id} deletada` })
    } catch {
        res.status(400).json({ error: "erro ao deletar categoria" })
    }
}