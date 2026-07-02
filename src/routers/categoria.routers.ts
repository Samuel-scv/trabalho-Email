import { Router } from "express"
import { CriarCategoria, ListarCategorias, BuscarCategoria, AtualizarCategoria, DeletarCategoria } from "../controllers/categoria.controllers.js"

const router = Router()

router.post("/", CriarCategoria)
router.get("/", ListarCategorias)
router.get("/:id", BuscarCategoria)
router.patch("/:id", AtualizarCategoria)
router.delete("/:id", DeletarCategoria)

export default router