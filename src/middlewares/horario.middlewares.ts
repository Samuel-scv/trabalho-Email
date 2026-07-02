import type { Request, Response, NextFunction } from "express"

export function horarioPermitidoMiddleware(horaInicio: number, horaFim: number) {
    return (req: Request, res: Response, next: NextFunction) => {
        const horaAtual = new Date().getHours()

        const dentroDaFaixa = horaInicio <= horaFim
            ? horaAtual >= horaInicio && horaAtual < horaFim
            : horaAtual >= horaInicio || horaAtual < horaFim // suporta faixa que cruza a meia-noite (ex: 22h às 6h)

        if (!dentroDaFaixa) {
            res.status(403).json({
                error: `Esta ação só pode ser realizada entre ${horaInicio}h e ${horaFim}h. Horário atual: ${horaAtual}h.`
            })
            return
        }

        next()
    }
}