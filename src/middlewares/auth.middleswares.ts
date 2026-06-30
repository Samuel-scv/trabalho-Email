import type { Request, Response, NextFunction } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { Tipo } from "../../generated/prisma/enums.js" // Confirme se este caminho está certo no seu projeto

export interface AuthRequest extends Request {
    userId?: number
    tipo?: Tipo
}

export function Authmiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    console.log("Header recebido:", authHeader) // Mantive para te ajudar a debugar

    // 1. Verifica se o header existe e começa com Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Token não fornecido ou mal formatado" })
        return // O return impede que o código continue executando
    }

    const token = authHeader.split(" ")[1]!

    try {
        // 2. Valida o token com a mesma chave secreta ("algo")
        const validateToken = jwt.verify(token, "algo") as JwtPayload
        
        // 3. Repassa as informações para a requisição
        req.userId = validateToken.userId
        req.tipo = validateToken.tipo
        
        next() // Permite que a requisição continue para o controller
    } catch (error) {
        res.status(401).json({ error: "Token inválido ou expirado" })
        return
    }
}