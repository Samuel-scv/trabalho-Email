import { Router } from "express"
import { CriarInstalacao, ListarInstalacoes, DeletarInstalacao, EnviarRelatorio } from "../controllers/instalacoes.controllers.js"
import { Authmiddleware } from "../../auth.middlewares.js" // Importe o seu middleware

const router = Router()
 
router.post("/", Authmiddleware, CriarInstalacao) 
router.get("/", ListarInstalacoes)
router.get("/relatorio/:id", EnviarRelatorio)
router.delete("/:id", DeletarInstalacao)
 
export default router