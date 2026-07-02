import type { Request, Response, NextFunction } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { Tipo } from "../../generated/prisma/enums.js"

export interface AuthRequest extends Request {
    userId?: number
    tipo?: Tipo
}

export function Authmiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    console.log("Header recebido:", authHeader)

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Token não fornecido ou mal formatado" })
        return 
    }

    const token = authHeader.split(" ")[1]!

    try {
        const validateToken = jwt.verify(token, "algo") as JwtPayload
        
        req.userId = validateToken.userId
        req.tipo = validateToken.tipo
        
        next()
    } catch (error) {
        res.status(401).json({ error: "Token inválido ou expirado" })
        return
    }
}