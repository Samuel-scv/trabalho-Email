import type { Request, Response } from "express"
import { prisma } from "../../lib/prisma.js"
import { transporter } from "../email/email.js"
 
export async function CriarInstalacao(req: Request, res: Response) {
    const { id_cliente, id_cyber } = req.body
 
    if (!id_cliente || !id_cyber) {
        res.status(400).json({ error: "id_cliente e id_cyber são obrigatórios" })
        return
    }
 
    const cliente = await prisma.clientes.findUnique({ where: { id: Number(id_cliente) } })
    if (!cliente) {
        res.status(404).json({ error: "cliente não encontrado" })
        return
    }
 
    const cyber = await prisma.cyberwares.findUnique({ where: { id: Number(id_cyber) } })
    if (!cyber) {
        res.status(404).json({ error: "cyberware não encontrado" })
        return
    }
 
    if (Number(cyber.estoque) <= 0) {
        res.status(400).json({ error: "cyberware sem estoque" })
        return
    }
 
    if (Number(cliente.saldo) < Number(cyber.preco)) {
        await prisma.log.create({
            data: {
                descricao: "Tentativa de instalação falhou",
                complemento: "Motivo: Saldo insuficiente",
                clienteId: cliente.id
            }
        });
        res.status(400).json({ error: "saldo insuficiente" })
        return
    }

    const instalacaoExistente = await prisma.instalacoes.findFirst({
    where: {
        id_cliente: Number(id_cliente),
        cyber: {
            id_categoria: cyber.id_categoria
        }
    }
    })

    if (instalacaoExistente) {
        res.status(400).json({ error: "cliente já possui um cyberware dessa categoria instalado" })
        return
    }
 
    try {
        const resultado = await prisma.$transaction(async (tx) => {
            const instalacao = await tx.instalacoes.create({
                data: {
                    id_cliente: Number(id_cliente),
                    id_cyber: Number(id_cyber)
                }
            })
 
            await tx.clientes.update({
                where: { id: Number(id_cliente) },
                data: { saldo: Number(cliente.saldo) - Number(cyber.preco) }
            })
 
            await tx.cyberwares.update({
                where: { id: Number(id_cyber) },
                data: { estoque: String(Number(cyber.estoque) - 1) }
            })
 
            await tx.historicoVendas.create({
                data: {
                    nome_cliente: cliente.nome,
                    email_cliente: cliente.email,
                    nome_cyberware: cyber.nome,
                    valor_pago: cyber.preco
                }
            })

            await tx.log.create({
                data: {
                    descricao: "Instalação de Cyberware",
                    complemento: `Cyberware instalado: ${cyber.nome}`,
                    clienteId: cliente.id
                }
            })
 
            return instalacao
        })
 
        const saldoRestante = Number(cliente.saldo) - Number(cyber.preco)
 
        await transporter.sendMail({
            from: '"Cyberware Corp" <cyberware@corp.com>',
            to: cliente.email,
            subject: `Instalação confirmada — ${cyber.nome}`,
            html: `
                <h2>Instalação confirmada!</h2>
                <p>Olá, <strong>${cliente.nome}</strong>!</p>
                <p>Seu novo cyberware <strong>${cyber.nome}</strong> foi instalado com sucesso.</p>
                <br/>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #333; color: #fff;">
                            <th style="padding: 8px; text-align: left;">Cyberware</th>
                            <th style="padding: 8px; text-align: left;">Valor Pago</th>
                            <th style="padding: 8px; text-align: left;">Saldo Restante</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;">${cyber.nome}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">R$ ${Number(cyber.preco).toFixed(2)}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">R$ ${saldoRestante.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
                <br/>
                <p>Obrigado por escolher a Cyberware Corp!</p>
            `
        })
 
        res.status(200).json(resultado)
    } catch {
        res.status(400).json({ error: "erro ao realizar instalação" })
    }
}
 
export async function ListarInstalacoes(req: Request, res: Response) {
    try {
        const lista = await prisma.instalacoes.findMany({
            include: {
                clientes: true,
                cyber: true
            }
        })
        res.status(200).json(lista)
    } catch {
        res.status(400).json({ error: "erro ao listar instalações" })
    }
}
 
export async function DeletarInstalacao(req: Request, res: Response) {
    const { id } = req.params
 
    if (!id) {
        res.status(400).json({ error: "ID não fornecido" })
        return
    }
 
    const instalacao = await prisma.instalacoes.findUnique({
        where: { id: Number(id) },
        include: { clientes: true, cyber: true }
    })
 
    if (!instalacao) {
        res.status(404).json({ error: "instalação não encontrada" })
        return
    }
 
    try {
        await prisma.$transaction(async (tx) => {
            await tx.instalacoes.delete({ where: { id: Number(id) } })
 
            await tx.clientes.update({
                where: { id: instalacao.id_cliente },
                data: { saldo: Number(instalacao.clientes.saldo) + Number(instalacao.cyber.preco) }
            })
 
            await tx.cyberwares.update({
                where: { id: instalacao.id_cyber },
                data: { estoque: String(Number(instalacao.cyber.estoque) + 1) }
            })

            await tx.log.create({
                data: {
                    descricao: "Exclusão de Instalação",
                    complemento: `Instalação do cyberware ID: ${instalacao.id_cyber} estornada`,
                    clienteId: instalacao.id_cliente
                }
            })
        })
 
        res.status(200).json({ message: `instalação ${id} deletada e saldo estornado` })
    } catch {
        res.status(400).json({ error: "erro ao deletar instalação" })
    }
}
 
export async function EnviarRelatorio(req: Request, res: Response) {
    const { id } = req.params
 
    if (!id) {
        res.status(400).json({ error: "ID não fornecido" })
        return
    }
 
    const cliente = await prisma.clientes.findUnique({ where: { id: Number(id) } })
    if (!cliente) {
        res.status(404).json({ error: "cliente não encontrado" })
        return
    }
 
    const historico = await prisma.historicoVendas.findMany({
        where: { email_cliente: cliente.email },
        orderBy: { data_procedimento: "desc" }
    })
 
    if (historico.length === 0) {
        res.status(404).json({ error: "nenhuma instalação encontrada para este cliente" })
        return
    }
 
    const totalGasto = historico.reduce((acc, item) => acc + Number(item.valor_pago), 0)
 
    const linhasTabela = historico.map(item => `
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${new Date(item.data_procedimento).toLocaleString("pt-BR")}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${item.nome_cyberware}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">R$ ${Number(item.valor_pago).toFixed(2)}</td>
        </tr>
    `).join("")
 
    const html = `
        <h2>Cyberware Corp — Relatório de Instalações</h2>
        <p><strong>Cliente:</strong> ${cliente.nome}</p>
        <p><strong>E-mail:</strong> ${cliente.email}</p>
 
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <thead>
                <tr style="background-color: #333; color: #fff;">
                    <th style="padding: 8px; text-align: left;">Data e Hora</th>
                    <th style="padding: 8px; text-align: left;">Cyberware</th>
                    <th style="padding: 8px; text-align: left;">Valor Pago</th>
                </tr>
            </thead>
            <tbody>
                ${linhasTabela}
            </tbody>
            <tfoot>
                <tr style="background-color: #f5f5f5;">
                    <td colspan="2" style="padding: 8px; font-weight: bold; text-align: right;">Total Gasto:</td>
                    <td style="padding: 8px; font-weight: bold;">R$ ${totalGasto.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
 
        <p style="margin-top: 16px;"><strong>Saldo Atual:</strong> R$ ${Number(cliente.saldo).toFixed(2)}</p>
    `
 
    try {
        await transporter.sendMail({
            from: '"Cyberware Corp" <cyberware@corp.com>',
            to: cliente.email,
            subject: `Relatório de Instalações — ${cliente.nome}`,
            html
        })
 
        res.status(200).json( `relatório enviado para ${cliente.email}` )
    } catch {
        res.status(500).json({ error: "erro ao enviar e-mail" })
    }
}