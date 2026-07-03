import type { Request, Response, NextFunction } from "express"
import type { ZodType } from "zod"

export function validarBody(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const resultado = schema.safeParse(req.body)

        if (!resultado.success) {
            res.status(400).json({ error: resultado.error.issues[0]?.message ?? "dados inválidos" })
            return
        }

        req.body = resultado.data
        next()
    }
}