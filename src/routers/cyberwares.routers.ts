import { Router } from "express"
import { CriarCyberware, ListarCyberwares, BuscarCyberware, AtualizarCyberware, DeletarCyberware } from "../controllers/cyberwares.controllers.js"
import { horarioPermitidoMiddleware } from "../middlewares/horario.middlewares.js"

const router = Router()

router.post("/", horarioPermitidoMiddleware(10, 22), CriarCyberware)
router.get("/", ListarCyberwares)
router.get("/:id", BuscarCyberware)
router.patch("/:id", AtualizarCyberware)
router.delete("/:id", horarioPermitidoMiddleware(10, 22), DeletarCyberware)

export default router