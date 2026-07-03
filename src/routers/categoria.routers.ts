import { Router } from "express"
import { CriarCategoria, ListarCategorias, BuscarCategoria, AtualizarCategoria, DeletarCategoria } from "../controllers/categoria.controllers.js"
import { validarBody } from "../middlewares/Validation.middlewares.js"
import { categoriaSchema } from "../validators/schemas.js"

const router = Router()

router.post("/", validarBody(categoriaSchema), CriarCategoria)
router.get("/", ListarCategorias)
router.get("/:id", BuscarCategoria)
router.patch("/:id", validarBody(categoriaSchema), AtualizarCategoria)
router.delete("/:id", DeletarCategoria)

export default router