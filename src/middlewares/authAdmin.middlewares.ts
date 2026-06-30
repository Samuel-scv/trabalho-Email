import type { Response, NextFunction } from 'express'
import type { AuthRequest } from './auth.middleswares.js'

export function AdminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    // CORREÇÃO: Verificar usando a string exata do seu enum (maiúsculo)
    if (req.tipo !== "ADMIN") {
        res.status(403).json({ error: "Acesso negado. Você não é admin." })
        return // CORREÇÃO: Faltava o return aqui para parar a execução
    }
    next()
}