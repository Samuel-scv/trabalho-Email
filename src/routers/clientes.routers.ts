import { Router } from "express"
import { CriarCliente, ListarClientes, BuscarCliente, AtualizarCliente, DeletarCliente, SolicitarRecuperacaoSenha, RedefinirSenha } from "../controllers/clientes.controllers.js"
import { Authmiddleware } from "../middlewares/auth.middleswares.js"
import { AdminMiddleware } from "../middlewares/authAdmin.middlewares.js"

const router = Router()

router.post("/", CriarCliente)
router.get("/", ListarClientes)
router.get("/:id", BuscarCliente)
router.patch("/:id", AtualizarCliente)
router.delete("/:id", Authmiddleware, AdminMiddleware, DeletarCliente)
router.post("/recuperar-senha", SolicitarRecuperacaoSenha)
router.post("/redefinir-senha", RedefinirSenha)

export default router