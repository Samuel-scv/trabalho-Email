import { Router } from "express"
import { CriarCyberware, ListarCyberwares, BuscarCyberware, AtualizarCyberware, DeletarCyberware } from "../controllers/cyberwares.controllers.js"
 
const router = Router()
 
router.post("/", CriarCyberware)
router.get("/", ListarCyberwares)
router.get("/:id", BuscarCyberware)
router.patch("/:id", AtualizarCyberware)
router.delete("/:id", DeletarCyberware)
 
export default router
 