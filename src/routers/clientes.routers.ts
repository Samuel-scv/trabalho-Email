import { Router } from "express"
import { CriarCliente, ListarClientes, BuscarCliente, AtualizarCliente, DeletarCliente } from "../controllers/clientes.controllers.js"

const router = Router()

router.post("/", CriarCliente)
router.get("/", ListarClientes)
router.get("/:id", BuscarCliente)
router.patch("/:id", AtualizarCliente)
router.delete("/:id", DeletarCliente)

export default router