import type { Request, Response } from "express"
import type { AuthRequest } from "../middlewares/auth.middleswares.js"
import { prisma } from "../../lib/prisma.js"
import { enviarEmailRecuperacao } from "../email/email.js"
import bcrypt from "bcryptjs"

function gerarCodigoRecuperacao(): string {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let codigo = ""
    for (let i = 0; i < 4; i++) {
        codigo += caracteres[Math.floor(Math.random() * caracteres.length)]
    }
    return codigo
}

function contarDiferencas(a: string, b: string): number {
    const linhas = a.length + 1
    const colunas = b.length + 1
    const dp: number[][] = Array.from({ length: linhas }, () => new Array(colunas).fill(0))

    for (let i = 0; i < linhas; i++) dp[i]![0] = i
    for (let j = 0; j < colunas; j++) dp[0]![j] = j

    for (let i = 1; i < linhas; i++) {
        for (let j = 1; j < colunas; j++) {
            if (a[i - 1] === b[j - 1]) {
                dp[i]![j] = dp[i - 1]![j - 1]!
            } else {
                dp[i]![j] = 1 + Math.min(dp[i - 1]![j]!, dp[i]![j - 1]!, dp[i - 1]![j - 1]!)
            }
        }
    }

    return dp[linhas - 1]![colunas - 1]!
}

export async function CriarCliente(req: Request, res: Response) {
    const { nome, email, senha, saldo, tipo } = req.body

    const emailJaCadastrado = await prisma.clientes.findUnique({ where: { email } })
    if (emailJaCadastrado) {
        res.status(409).json({ error: "já existe um usuário cadastrado com esse e-mail" })
        return
    }

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const novoCliente = await prisma.clientes.create({
            data: { nome, email, senha: senhaCriptografada, saldo, tipo },
            select: { id: true }
        })

        await prisma.log.create({
            data: {
                descricao: "Cadastro de cliente",
                complemento: `Novo cliente cadastrado: ${nome} (${email}), tipo ${tipo}.`,
                clienteId: novoCliente.id
            }
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

export async function SolicitarRecuperacaoSenha(req: Request, res: Response) {
    const { email } = req.body

    const cliente = await prisma.clientes.findUnique({ where: { email } })

    if (!cliente) {
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

export async function RedefinirSenha(req: Request, res: Response) {
    const { email, codigo, novaSenha } = req.body

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
        const senhaCriptografada = await bcrypt.hash(novaSenha, 10)

        await prisma.clientes.update({
            where: { email },
            data: {
                senha: senhaCriptografada,
                codigoRecuperacao: null
            }
        })

        await prisma.log.create({
            data: {
                descricao: "Senha redefinida",
                complemento: `Usuário ${cliente.nome} redefiniu a senha através da recuperação por e-mail.`,
                clienteId: cliente.id
            }
        })

        res.status(200).json({ message: "senha redefinida com sucesso" })
    } catch {
        res.status(500).json({ error: "erro ao redefinir senha" })
    }
}

export async function AlterarSenha(req: AuthRequest, res: Response) {
    const { senhaAtual, novaSenha } = req.body

    if (!req.userId) {
        res.status(401).json({ error: "usuário não autenticado" })
        return
    }

    const cliente = await prisma.clientes.findUnique({ where: { id: req.userId } })
    if (!cliente) {
        res.status(404).json({ error: "cliente não encontrado" })
        return
    }

    const senhaAtualCorreta = await bcrypt.compare(senhaAtual, cliente.senha)
    if (!senhaAtualCorreta) {
        res.status(400).json({ error: "senha atual incorreta" })
        return
    }

    if (contarDiferencas(senhaAtual, novaSenha) < 2) {
        res.status(400).json({ error: "a nova senha deve ter no mínimo 2 caracteres diferentes da senha atual" })
        return
    }

    try {
        const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 10)

        await prisma.clientes.update({
            where: { id: req.userId },
            data: { senha: novaSenhaCriptografada }
        })

        await prisma.log.create({
            data: {
                descricao: "Senha alterada",
                complemento: `Usuário ${cliente.nome} alterou a própria senha.`,
                clienteId: cliente.id
            }
        })

        res.status(200).json({ message: "senha alterada com sucesso" })
    } catch {
        res.status(500).json({ error: "erro ao alterar senha" })
    }
}