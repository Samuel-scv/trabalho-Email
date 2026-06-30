import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import jwt from "jsonwebtoken";

export async function login(req: Request, res: Response) {
    const { email, senha } = req.body;

    if (!email || !senha) {
        res.status(400).json({ error: "email e senha são obrigatórios" });
        return; // <-- CORREÇÃO: Adicionado o return para parar a execução
    }

    // Buscando na tabela correta do seu sistema (clientes)
    const user = await prisma.clientes.findUnique({ where: { email } });

    // REQUISITO 2: Tentativa de login inválida (Usuário não existe OU senha errada)
    if (!user || (user.senha !== senha)) {
        
        // SALVANDO O LOG DE TENTATIVA INVÁLIDA
        await prisma.log.create({
            data: {
                descricao: "Tentativa de login inválida",
                complemento: `Tentativa com o email: ${email}`,
                clienteId: user ? user.id : null // Se o usuário não existir, grava como nulo
            }
        });

        res.status(400).json({ error: "Credenciais inválidas" });
        return;
    }

    // REQUISITO 2: Login realizado com sucesso
    await prisma.log.create({
        data: {
            descricao: "Login realizado com sucesso",
            complemento: `Usuário ${user.nome} acessou o sistema.`,
            clienteId: user.id
        }
    });

    // Geração do Token
    const token = jwt.sign(
        {
            userId: user.id,
            tipo: user.tipo
        },
        "algo",
        { expiresIn: "1h" }
    );

    res.status(200).json({ token });
}