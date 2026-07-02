import { Router } from "express"
import { CriarInstalacao, ListarInstalacoes, DeletarInstalacao, EnviarRelatorio } from "../controllers/instalacoes.controllers.js"
import { AdminMiddleware } from "../middlewares/authAdmin.middlewares.js"
import { Authmiddleware } from "../middlewares/auth.middleswares.js"
import { horarioPermitidoMiddleware } from "../middlewares/horario.middlewares.js"

const router = Router()

router.post("/", Authmiddleware, AdminMiddleware, horarioPermitidoMiddleware(10, 22), CriarInstalacao)
router.get("/", Authmiddleware, AdminMiddleware, ListarInstalacoes)
router.get("/relatorio/:id", Authmiddleware, AdminMiddleware, EnviarRelatorio)
router.delete("/:id", Authmiddleware, AdminMiddleware, horarioPermitidoMiddleware(10, 22), DeletarInstalacao)

export default router