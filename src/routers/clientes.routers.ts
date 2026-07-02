import { Router } from "express"
import { CriarCliente, ListarClientes, BuscarCliente, AtualizarCliente, DeletarCliente, SolicitarRecuperacaoSenha, RedefinirSenha, AlterarSenha } from "../controllers/clientes.controllers.js"
import { Authmiddleware } from "../middlewares/auth.middleswares.js"
import { AdminMiddleware } from "../middlewares/authAdmin.middlewares.js"

const router = Router()

router.post("/", CriarCliente)
router.get("/", ListarClientes)
router.post("/recuperar-senha", SolicitarRecuperacaoSenha)
router.post("/redefinir-senha", RedefinirSenha)
router.patch("/alterar-senha", Authmiddleware, AlterarSenha)
router.get("/:id", BuscarCliente)
router.patch("/:id", AtualizarCliente)
router.delete("/:id", Authmiddleware, AdminMiddleware, DeletarCliente)

export default router