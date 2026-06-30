import type { Request, Response, NextFunction } from "express"
import jwt , { JwtPayload } from "jsonwebtoken"
import { Tipo } from "../../generated/prisma/enums.js"

export interface AuthRequest extends Request{
    userId?:number
    tipo?:Tipo
}

export function Authmiddleware(req:AuthRequest, res:Response, next:NextFunction) {
    const authHeader = req.headers.authorization

    console.log(authHeader)

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(200).json({error:"token não fornecido"})
        return
    }

    const token = authHeader.split(" ")[1]!
    console.log(token)

    try{
        const validateToken = jwt.verify(token,"algo") as JwtPayload
        req.userId = validateToken.userId
        req.tipo = validateToken.tipo
        next()
    } catch {
        res.status(200).json({error:"token invalido"})
    }
    
}