import { Router } from "express"
import { CriarCyberware, ListarCyberwares, BuscarCyberware, AtualizarCyberware, DeletarCyberware } from "../controllers/cyberwares.controllers.js"
import { horarioPermitidoMiddleware } from "../middlewares/horario.middlewares.js"
import { validarBody } from "../middlewares/Validation.middlewares.js"
import { cyberwareSchema } from "../validators/schemas.js"

const router = Router()

router.post("/", horarioPermitidoMiddleware(10, 22), validarBody(cyberwareSchema), CriarCyberware)
router.get("/", ListarCyberwares)
router.get("/:id", BuscarCyberware)
router.patch("/:id", validarBody(cyberwareSchema), AtualizarCyberware)
router.delete("/:id", horarioPermitidoMiddleware(10, 22), DeletarCyberware)

export default router