import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function login(req: Request, res: Response) {
    const { email, senha } = req.body;

    const user = await prisma.clientes.findUnique({ where: { email } });

    const senhaCorreta = user ? await bcrypt.compare(senha, user.senha) : false;

    if (!user || !senhaCorreta) {
        await prisma.log.create({
            data: {
                descricao: "Tentativa de login inválida",
                complemento: `Tentativa com o email: ${email}`,
                clienteId: user ? user.id : null
            }
        });

        res.status(400).json({ error: "Credenciais inválidas" });
        return;
    }

    await prisma.log.create({
        data: {
            descricao: "Login realizado com sucesso",
            complemento: `Usuário ${user.nome} acessou o sistema.`,
            clienteId: user.id
        }
    });

    const mensagemBoasVindas = user.ultimoLogin
        ? `Bem-vindo, ${user.nome}! Seu último acesso ao sistema foi em ${user.ultimoLogin.toLocaleString("pt-BR")}.`
        : `Bem-vindo, ${user.nome}! Este é o seu primeiro acesso ao sistema.`;

    await prisma.clientes.update({
        where: { id: user.id },
        data: { ultimoLogin: new Date() }
    });

    const token = jwt.sign(
        {
            userId: user.id,
            tipo: user.tipo
        },
        process.env.TOKEN as string,
        { expiresIn: "1h" }
    );

    res.status(200).json({ token, mensagem: mensagemBoasVindas });
}