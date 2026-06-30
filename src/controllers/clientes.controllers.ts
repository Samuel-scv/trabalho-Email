import type { Request, Response } from "express"
import type { AuthRequest } from "../middlewares/auth.middleswares.js"
import type { cliente } from "../interface/cliente.interfaces.js"
import { prisma } from "../../lib/prisma.js"
import { enviarEmailRecuperacao } from "../email/email.js"

function gerarCodigoRecuperacao(): string {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let codigo = ""
    for (let i = 0; i < 4; i++) {
        codigo += caracteres[Math.floor(Math.random() * caracteres.length)]
    }
    return codigo
}

function senhaValida(senha: string): boolean {
    // mínimo 8 caracteres, pelo menos 1 letra maiúscula, 1 minúscula e 1 número
    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return regexSenha.test(senha)
}


export async function CriarCliente(req: Request, res: Response) {
    const { nome, email, senha, saldo, tipo }: cliente = req.body

    if (!nome || !email || !senha || saldo === undefined || !tipo) {
        res.status(400).json({ error: "nome, email, senha, saldo e tipo são obrigatórios" })
        return
    }

    if (tipo !== "CLIENTE" && tipo !== "ADMIN") {
        res.status(400).json({ error: "tipo deve ser 'CLIENTE' ou 'ADMIN'" })
        return
    }

    if (!senhaValida(senha)) {
        res.status(400).json({
            error: "a senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, letra minúscula e número"
        })
        return
    }

    try {
        const novoCliente = await prisma.clientes.create({
            data: { nome, email, senha, saldo, tipo },
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
            where: { id: Number(id) },
            select: {
                id: true,
                nome: true,
                email: true,
                saldo: true,
                tipo: true
            }
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

export async function DeletarCliente(req: AuthRequest, res: Response) {
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

        await prisma.log.create({
            data: {
                descricao: "Exclusão de cliente",
                complemento: `Cliente "${clienteExiste.nome}" (id ${id}, email ${clienteExiste.email}) foi excluído do sistema.`,
                clienteId: req.userId ?? null
            }
        })

        res.status(200).json({ message: `cliente ${id} deletado` })
    } catch {
        res.status(400).json({ error: "erro ao deletar cliente" })
    }
}

// Rota 1: solicitar recuperação de senha
// Valida o e-mail, gera um código de 4 caracteres, salva no cliente e envia por e-mail
export async function SolicitarRecuperacaoSenha(req: Request, res: Response) {
    const { email } = req.body

    if (!email) {
        res.status(400).json({ error: "email é obrigatório" })
        return
    }

    const cliente = await prisma.clientes.findUnique({ where: { email } })

    if (!cliente) {
        // Não revela se o e-mail existe ou não, por segurança
        res.status(200).json({ message: "se o e-mail existir, um código de recuperação será enviado" })
        return
    }

    const codigo = gerarCodigoRecuperacao()

    try {
        await prisma.clientes.update({
            where: { email },
            data: { codigoRecuperacao: codigo }
        })

        await enviarEmailRecuperacao(cliente.email, cliente.nome, codigo)

        res.status(200).json({ message: "se o e-mail existir, um código de recuperação será enviado" })
    } catch {
        res.status(500).json({ error: "erro ao processar solicitação de recuperação de senha" })
    }
}

// Rota 2: redefinir a senha a partir do e-mail, código recebido e nova senha
export async function RedefinirSenha(req: Request, res: Response) {
    const { email, codigo, novaSenha } = req.body

    if (!email || !codigo || !novaSenha) {
        res.status(400).json({ error: "email, código e nova senha são obrigatórios" })
        return
    }

    if (!senhaValida(novaSenha)) {
        res.status(400).json({
            error: "a senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, letra minúscula e número"
        })
        return
    }

    const cliente = await prisma.clientes.findUnique({ where: { email } })

    if (!cliente || !cliente.codigoRecuperacao) {
        res.status(400).json({ error: "código de recuperação inválido" })
        return
    }

    if (cliente.codigoRecuperacao !== codigo) {
        res.status(400).json({ error: "código de recuperação inválido" })
        return
    }

    try {
        await prisma.clientes.update({
            where: { email },
            data: {
                senha: novaSenha,
                codigoRecuperacao: null
            }
        })

        res.status(200).json({ message: "senha redefinida com sucesso" })
    } catch {
        res.status(500).json({ error: "erro ao redefinir senha" })
    }
}