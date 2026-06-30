import type { Response, NextFunction } from 'express'
import type { AuthRequest } from './auth.middleswares.js'
import { prisma } from '../../lib/prisma.js'

export async function AdminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    if (req.tipo !== "ADMIN") {
        await prisma.log.create({
            data: {
                descricao: "Tentativa de acesso negado",
                complemento: `Usuário sem permissão de administrador tentou acessar ${req.method} ${req.originalUrl}.`,
                clienteId: req.userId ?? null
            }
        })

        res.status(403).json({ error: "Acesso negado. Você não é admin." })
        return 
    }
    next()
}